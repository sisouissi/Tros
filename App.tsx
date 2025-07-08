





import React, { useState, useMemo } from 'react';
import { PatientData, Recommendation as RecType, TrosType, BrodskyGrade } from './types';
import { MAJOR_NOCTURNAL_SYMPTOMS, StethoscopeIcon, STEPS_CONFIG } from './constants';
import StepCard from './components/StepCard';
import ProgressBar from './components/ProgressBar';
import BrodskyScaleSelector from './components/BrodskyScaleSelector';
import Recommendation from './components/Recommendation';

const initialPatientData: PatientData = {
    age: null,
    isObese: null,
    hasSyndrome: null,
    majorSymptoms: [],
    hasComorbidity: null,
    brodskyGrade: null,
    hasAdenoidHypertrophy: null,
    iah: null,
};

// Reusable Button Component for choices
const ChoiceButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full text-center py-3 px-4 border-2 rounded-lg transition-all duration-200 font-semibold ${
            isActive
                ? 'border-primary bg-primary-light shadow-md text-primary-dark'
                : 'border-slate-300 bg-white hover:border-primary text-secondary-dark'
        }`}
    >
        {children}
    </button>
);


const App: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [patientData, setPatientData] = useState<PatientData>(initialPatientData);

    const trosType: TrosType = useMemo(() => {
        if (patientData.isObese === true) return '2';
        if (patientData.hasSyndrome === true) return '3';
        if (patientData.isObese === false && patientData.hasSyndrome === false) return '1';
        return 'undetermined';
    }, [patientData.isObese, patientData.hasSyndrome]);


    const handleNext = () => {
        if (currentStep === 1 && trosType !== '1') {
            setCurrentStep(5); // For Type 2/3, skip to recommendation
        } else if (currentStep < 5) {
            setCurrentStep(prev => prev + 1);
        }
    };
    
    const handleBack = () => {
        if (currentStep === 5 && trosType !== '1') {
            setCurrentStep(1); // For Type 2/3, go back to start
        } else if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleReset = () => {
        setPatientData(initialPatientData);
        setCurrentStep(1);
    };

    const isNextDisabled = (): boolean => {
        switch (currentStep) {
            case 1:
                return patientData.age === null || patientData.isObese === null || patientData.hasSyndrome === null;
            case 2:
                return false; // Can proceed with 0 symptoms
            case 3:
                return patientData.brodskyGrade === null || patientData.hasAdenoidHypertrophy === null;
            case 4:
                return patientData.hasComorbidity === null;
            default:
                return true;
        }
    };

    const handleSymptomChange = (symptom: string) => {
        setPatientData(prev => {
            const newSymptoms = prev.majorSymptoms.includes(symptom)
                ? prev.majorSymptoms.filter(s => s !== symptom)
                : [...prev.majorSymptoms, symptom];
            return { ...prev, majorSymptoms: newSymptoms };
        });
    };
    
    const getRecommendation = useMemo((): RecType => {
        const { age, hasComorbidity, majorSymptoms, brodskyGrade, hasAdenoidHypertrophy, iah } = patientData;

        // --- TROS Type 2 (Obesity) or 3 (Syndromic) ---
        if (trosType === '2' || trosType === '3') {
            const typeText = trosType === '2' ? "de Type 2 (associé à l'obésité)" : "de Type 3 (associé à une pathologie complexe)";
            const baseRec = {
                '2': {
                    priseEnCharge: "Prise en charge diététique pour l'obésité.",
                    followUpPrefix: "Suivi spécialisé régulier (pneumo-pédiatre, ORL, nutritionniste)"
                },
                '3': {
                    priseEnCharge: "Le traitement est personnalisé en fonction de la pathologie sous-jacente.",
                    followUpPrefix: "Suivi très rapproché en centre de référence"
                }
            };
            
            if (iah === null) {
                return {
                    title: `Orientation: TROS ${typeText}`,
                    primaryAction: `PSG/PG systématique et prise en charge ${trosType === '2' ? 'multidisciplinaire' : 'en centre de référence'}`,
                    primaryActionColor: 'blue',
                    explanation: `Ce type de TROS nécessite une évaluation complète par un examen du sommeil (Polysomnographie) pour en déterminer la sévérité et guider la stratégie thérapeutique complexe.`,
                    alternatives: [baseRec[trosType].priseEnCharge, "La chirurgie ORL sera discutée en fonction des résultats de la PSG et de l'examen clinique."],
                    followUp: `${baseRec[trosType].followUpPrefix}. La suite dépend des résultats de la PSG.`
                };
            }
            if (iah < 5) {
                return {
                    title: `Résultat TROS ${typeText}: SAHOS léger (IAH &lt; 5)`,
                    primaryAction: "Prise en charge de la cause sous-jacente et surveillance",
                    primaryActionColor: 'green',
                    explanation: "Le SAHOS est léger. La priorité est la prise en charge de l'obésité ou de la pathologie associée.",
                    alternatives: [baseRec[trosType].priseEnCharge, "Traitement orthodontique et rééducation OMF si indiqué.", "La chirurgie ORL n'est généralement pas prioritaire."],
                    followUp: `${baseRec[trosType].followUpPrefix} avec contrôle clinique régulier.`
                };
            }
            const primaryAction = "Chirurgie ORL et/ou Pression Positive Continue (PPC) à discuter";
            return {
                title: `Résultat TROS ${typeText}: SAHOS ${iah < 10 ? 'modéré (IAH 5-10)' : 'sévère (IAH &gt; 10)'}`,
                primaryAction,
                primaryActionColor: 'amber',
                explanation: `Le SAHOS est significatif. Une discussion en milieu spécialisé est nécessaire pour décider de la meilleure stratégie entre chirurgie, PPC, ou les deux.`,
                alternatives: [baseRec[trosType].priseEnCharge, "La chirurgie peut nécessiter des gestes complémentaires (évalués par endoscopie de sommeil)."],
                followUp: `${baseRec[trosType].followUpPrefix} avec PSG/PG de contrôle post-thérapeutique obligatoire.`
            };
        }
        
        // --- TROS Type 1 (Typical child) ---
        const meetsAgeCriteria = age !== null && age >= 2 && age < 8;
        const hasSignificantObstruction = (brodskyGrade === '3' || brodskyGrade === '4') || hasAdenoidHypertrophy === true;
        
        if (meetsAgeCriteria && hasComorbidity === false && majorSymptoms.length >= 2 && hasSignificantObstruction) {
            return {
                title: "Orientation: TROS de Type 1 typique",
                primaryAction: "Chirurgie ORL de première intention (Adéno-amygdalectomie)",
                primaryActionColor: 'green',
                explanation: "Le profil de l'enfant (âge, symptômes, examen clinique) est très en faveur d'un TROS de type 1 typique. L'adéno-amygdalectomie est le traitement de référence et ne nécessite pas d'examen du sommeil préopératoire.",
                alternatives: ["Traitement médical (corticoïdes nasaux) si TROS léger sans obstacle majeur.", "Rééducation oro-maxillo-faciale ou traitement orthodontique si respiration buccale persistante post-op."],
                followUp: "Consultation ORL de contrôle à 2-6 mois post-opératoire. PSG/PG de contrôle non systématique."
            };
        }

        // TROS 1 Atypical: needs sleep study
        if (iah === null) {
            return {
                title: "Orientation: TROS de Type 1 atypique ou situation à clarifier",
                primaryAction: "Indication d'un examen du sommeil (PSG/PG)",
                primaryActionColor: 'blue',
                explanation: "La situation ne correspond pas aux critères stricts de la chirurgie de première intention sans examen complémentaire. Une polysomnographie (PSG) ou polygraphie (PG) est nécessaire pour confirmer le diagnostic, évaluer la sévérité et orienter la prise en charge.",
                alternatives: ["Traitement médical d'attente (corticoïdes nasaux) si hypertrophie adénoïdienne.", "Consultation ORL spécialisée avec naso-fibroscopie."],
                followUp: "Le suivi dépendra des résultats de l'examen du sommeil."
            };
        }
        
        // TROS 1 Atypical with IAH results
        if (iah < 2) {
            return {
                title: "Résultat TROS Type 1: Pas de SAHOS significatif (IAH &lt; 2)",
                primaryAction: "Surveillance et recherche d'une autre cause aux symptômes",
                primaryActionColor: 'green',
                explanation: "L'examen du sommeil n'objective pas de trouble respiratoire obstructif significatif. Les symptômes peuvent être liés à un ronflement simple ou une autre pathologie.",
                alternatives: ["Réévaluation clinique si les symptômes persistent.", "Discuter d'un traitement symptomatique (hygiène nasale)."],
                followUp: "Suivi clinique simple. Réorienter si la symptomatologie évolue."
            };
        }
        if (iah < 5) {
            return {
                title: "Résultat TROS Type 1: SAHOS léger (IAH 2-5)",
                primaryAction: "Traitement médical ou orthodontique à discuter",
                primaryActionColor: 'amber',
                explanation: "L'examen confirme un SAHOS léger. Une chirurgie n'est pas indiquée en première intention. Un traitement moins invasif est à privilégier.",
                alternatives: ["Corticoïdes par voie nasale (surtout si hypertrophie adénoïdienne).", "Disjonction maxillaire rapide (orthodontie) si palais étroit.", "Anti-leucotriènes (surveillance stricte des effets secondaires)."],
                followUp: "Suivi clinique pour évaluer la réponse au traitement. Un contrôle ORL et/ou orthodontique est nécessaire. La PSG n'est pas à refaire systématiquement."
            };
        }
        // IAH >= 5
        return {
            title: `Résultat TROS Type 1: SAHOS ${iah < 10 ? 'modéré (IAH 5-10)' : 'sévère (IAH &gt; 10)'}`,
            primaryAction: "Chirurgie ORL (Adéno-amygdalectomie) recommandée",
            primaryActionColor: 'amber',
            explanation: `L'examen du sommeil confirme un SAHOS ${iah < 10 ? 'modéré' : 'sévère'}. L'adéno-amygdalectomie est le traitement de choix pour lever l'obstruction.`,
            alternatives: ["Traitement orthodontique (disjonction maxillaire) si palais étroit.", "Rééducation oro-maxillo-faciale en cas de respiration buccale."],
            followUp: `Consultation ORL de contrôle 2 à 6 mois post-opératoire. Une PSG/PG de contrôle peut être discutée en cas de persistance des symptômes, notamment si des facteurs de risque persistent (âge &gt; 7 ans, asthme sévère, IAH préop &gt; 10).`
        };

    }, [patientData, trosType]);


    const renderContent = () => {
        if (currentStep === 5) {
            return <Recommendation recommendation={getRecommendation} patientData={patientData} onReset={handleReset} setPatientData={setPatientData} />;
        }

        let stepContent;
        const stepTitle = STEPS_CONFIG.find(s => s.id === currentStep)?.title || 'Étape';

        switch (currentStep) {
            case 1:
                stepContent = (
                    <>
                        <div>
                            <label htmlFor="age" className="block text-lg font-semibold text-secondary-dark mb-2">
                                Âge de l'enfant (années)
                            </label>
                            <input
                                type="number"
                                id="age"
                                value={patientData.age || ''}
                                onChange={(e) => setPatientData({ ...patientData, age: e.target.value ? parseInt(e.target.value) : null })}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="ex: 4"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-secondary-dark mb-3">
                                Présence d'une obésité ?
                            </label>
                            <div className="flex gap-4">
                               <ChoiceButton onClick={() => setPatientData({ ...patientData, isObese: true, iah: null })} isActive={patientData.isObese === true}>Oui</ChoiceButton>
                               <ChoiceButton onClick={() => setPatientData({ ...patientData, isObese: false, iah: null })} isActive={patientData.isObese === false}>Non</ChoiceButton>
                            </div>
                        </div>
                        <div>
                             <label className="block text-lg font-semibold text-secondary-dark mb-3">
                                Pathologie syndromique/génétique ou malformation craniofaciale connue ?
                            </label>
                            <div className="flex gap-4">
                                <ChoiceButton onClick={() => setPatientData({ ...patientData, hasSyndrome: true, iah: null })} isActive={patientData.hasSyndrome === true}>Oui</ChoiceButton>
                                <ChoiceButton onClick={() => setPatientData({ ...patientData, hasSyndrome: false, iah: null })} isActive={patientData.hasSyndrome === false}>Non</ChoiceButton>
                            </div>
                        </div>
                    </>
                );
                break;
            case 2:
                stepContent = (
                    <div>
                        <label className="block text-lg font-semibold text-secondary-dark mb-3">
                            Critères nocturnes majeurs (cocher si présent)
                        </label>
                        <div className="space-y-3">
                            {MAJOR_NOCTURNAL_SYMPTOMS.map(symptom => (
                                <label key={symptom} className="flex items-center p-4 bg-white border-2 rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary-light">
                                    <input
                                        type="checkbox"
                                        checked={patientData.majorSymptoms.includes(symptom)}
                                        onChange={() => handleSymptomChange(symptom)}
                                        className="h-5 w-5 rounded text-primary focus:ring-primary border-slate-300"
                                    />
                                    <span className="ml-4 text-secondary-dark">{symptom}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
                break;
            case 3:
                stepContent = (
                    <>
                        <BrodskyScaleSelector
                            selectedValue={patientData.brodskyGrade}
                            onChange={(value) => setPatientData({ ...patientData, brodskyGrade: value as BrodskyGrade })}
                        />
                        <div>
                            <label className="block text-lg font-semibold text-secondary-dark mb-3">
                                Hypertrophie des végétations adénoïdes (confirmée par naso-fibroscopie) ?
                            </label>
                            <div className="flex gap-4">
                                <ChoiceButton onClick={() => setPatientData({ ...patientData, hasAdenoidHypertrophy: true })} isActive={patientData.hasAdenoidHypertrophy === true}>Oui</ChoiceButton>
                                <ChoiceButton onClick={() => setPatientData({ ...patientData, hasAdenoidHypertrophy: false })} isActive={patientData.hasAdenoidHypertrophy === false}>Non</ChoiceButton>
                            </div>
                        </div>
                    </>
                );
                break;
            case 4:
                stepContent = (
                    <div>
                        <label className="block text-lg font-semibold text-secondary-dark mb-3">
                            Présence d'une comorbidité non contrôlée ?
                        </label>
                        <p className="text-sm text-secondary-dark/70 mb-4">Exemple : cardiopathie, trouble de l'hémostase, asthme sévère non contrôlé.</p>
                        <div className="flex gap-4">
                           <ChoiceButton onClick={() => setPatientData({ ...patientData, hasComorbidity: true })} isActive={patientData.hasComorbidity === true}>Oui</ChoiceButton>
                           <ChoiceButton onClick={() => setPatientData({ ...patientData, hasComorbidity: false })} isActive={patientData.hasComorbidity === false}>Non</ChoiceButton>
                        </div>
                    </div>
                );
                break;
            default:
                stepContent = <div>Étape non reconnue</div>;
        }

        return (
            <StepCard title={`Étape ${currentStep}: ${stepTitle}`}>
                {stepContent}
                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        className="px-6 py-2 border border-slate-300 text-base font-medium rounded-md text-secondary-dark bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                        disabled={currentStep === 1}
                    >
                        Précédent
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={isNextDisabled()}
                        className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        {currentStep === 4 || (currentStep === 1 && trosType !== '1') ? "Voir l'orientation" : 'Suivant'}
                    </button>
                </div>
            </StepCard>
        );
    };

    return (
        <div className="min-h-screen bg-secondary-light font-sans text-secondary-dark p-4 sm:p-8 flex flex-col items-center">
             <header className="text-center mb-8 w-full max-w-4xl mx-auto">
                <div className="flex justify-center items-center gap-4">
                    <StethoscopeIcon className="w-12 h-12 text-primary" />
                    <h1 className="text-3xl sm:text-4xl font-bold text-secondary-dark">
                        Aide à la Décision des <span className="text-primary">TROS de l'enfant</span>
                    </h1>
                </div>
                <p className="mt-2 text-lg text-secondary max-w-3xl mx-auto">
                    Troubles respiratoires obstructifs du sommeil de l'enfant
                </p>
            </header>

            <ProgressBar currentStep={currentStep} trosType={trosType} />

            <main className="w-full flex-grow flex items-start justify-center">
                {renderContent()}
            </main>

            <footer className="mt-auto pt-8 text-center text-xs text-secondary-dark/70 w-full max-w-4xl mx-auto">
                <p className="text-sm">Cet outil est une aide à la décision et ne remplace pas le jugement clinique.</p>
                <p className="mt-2 font-semibold">© 2025 Conception Dr Zouhair Souissi</p>
            </footer>
        </div>
    );
};

export { App };