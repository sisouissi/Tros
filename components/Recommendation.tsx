
import React from 'react';
import { Recommendation as RecType, PatientData } from '../types';
import { CheckIcon, InfoIcon } from '../constants';
import IahInput from './IahInput';
import GeminiSummary from './GeminiSummary';

interface RecommendationProps {
    recommendation: RecType | null;
    patientData: PatientData;
    onReset: () => void;
    setPatientData: React.Dispatch<React.SetStateAction<PatientData>>;
}

const colorClasses = {
    green: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-500',
        primaryText: 'text-green-700'
    },
    amber: {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-500',
        primaryText: 'text-amber-700'
    },
    blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-500',
        primaryText: 'text-blue-700'
    },
};

const Recommendation: React.FC<RecommendationProps> = ({ recommendation, patientData, onReset, setPatientData }) => {
    if (!recommendation) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-secondary-dark">Aucune recommandation disponible.</h2>
                <p className="mt-2 text-secondary">Veuillez compléter les étapes précédentes.</p>
            </div>
        );
    }

    const colors = colorClasses[recommendation.primaryActionColor];
    const isSleepStudyRecommended = recommendation.primaryAction.includes("examen du sommeil") || recommendation.primaryAction.includes("PSG");

    const handleIahSubmit = (iah: number) => {
        setPatientData(prev => ({...prev, iah}));
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl shadow-lg w-full overflow-hidden">
                <div className={`p-6 sm:p-8 ${colors.bg} border-b-4 ${colors.border}`}>
                    <h2 className={`text-2xl sm:text-3xl font-bold ${colors.text}`}>{recommendation.title}</h2>
                    <p className={`mt-4 text-lg font-semibold ${colors.primaryText}`}>{recommendation.primaryAction}</p>
                    <p className="mt-2 text-secondary-dark">{recommendation.explanation}</p>
                </div>
                <div className="p-6 sm:p-8 space-y-8">
                    <div>
                        <h3 className="text-xl font-bold text-secondary-dark mb-3">Traitements Alternatifs / Adjuvants</h3>
                        <ul className="space-y-2">
                            {recommendation.alternatives.map((alt, index) => (
                                <li key={index} className="flex items-start">
                                    <CheckIcon className="w-5 h-5 mt-1 text-primary flex-shrink-0 mr-3" />
                                    <span className="text-secondary-dark">{alt}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-secondary-dark mb-3">Suivi Recommandé</h3>
                        <div className="flex items-start p-4 bg-secondary-light rounded-lg">
                            <InfoIcon className="w-6 h-6 mt-1 text-secondary-dark flex-shrink-0 mr-4" />
                            <p className="text-secondary-dark">{recommendation.followUp}</p>
                        </div>
                    </div>
                </div>
            </div>

            {isSleepStudyRecommended && patientData.iah === null && (
                 <IahInput onIahSubmit={handleIahSubmit} />
            )}
            
            <GeminiSummary patientData={patientData} recommendation={recommendation} />

            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="text-center">
                    <button
                        onClick={onReset}
                        className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Commencer une nouvelle évaluation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Recommendation;
