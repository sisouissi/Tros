import React, { useState, useCallback } from 'react';
import { PatientData, Recommendation as RecType } from '../types';
import { generateSummary } from '../services/geminiService';
import { SparklesIcon } from '../constants';

interface GeminiSummaryProps {
    patientData: PatientData;
    recommendation: RecType;
}

const GeminiSummary: React.FC<GeminiSummaryProps> = ({ patientData, recommendation }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const createPrompt = useCallback(() => {
        const { age, isObese, hasSyndrome, majorSymptoms, hasComorbidity, brodskyGrade, hasAdenoidHypertrophy, iah } = patientData;
        const data = `
- Âge: ${age} ans
- Obésité: ${isObese ? 'Oui' : 'Non'}
- Pathologie syndromique: ${hasSyndrome ? 'Oui' : 'Non'}
- Symptômes nocturnes majeurs: ${majorSymptoms.length > 0 ? majorSymptoms.join(', ') : 'Aucun rapporté'}
- Comorbidités associées: ${hasComorbidity ? 'Oui' : 'Non'}
- Examen clinique: Grade amygdalien (Brodsky) ${brodskyGrade || 'N/A'}, Hypertrophie adénoïdienne ${hasAdenoidHypertrophy ? 'Oui' : hasAdenoidHypertrophy === false ? 'Non' : 'N/A'}
- Index d'Apnées-Hypopnées (IAH): ${iah !== null ? `${iah} év/h` : 'Non réalisé ou non fourni'}
- Orientation diagnostique: ${recommendation.title}
- Action recommandée: ${recommendation.primaryAction}
        `;
        return `En tant qu'expert en pédiatrie et médecine du sommeil, générez un résumé clinique structuré et concis en français pour le dossier d'un patient enfant suspect de TROS. Le résumé doit être formel et prêt à être intégré dans un dossier médical. Voici les données du patient:\n${data}`;
    }, [patientData, recommendation]);

    const handleGenerateSummary = async () => {
        setIsLoading(true);
        setError('');
        setSummary('');
        const prompt = createPrompt();
        try {
            const result = await generateSummary(prompt);
            if (result.startsWith("Erreur:") || result.startsWith("Une erreur est survenue")) {
                setError(result);
            } else {
                setSummary(result);
            }
        } catch (e) {
            setError('Une erreur inattendue est survenue.');
            console.error(e);
        }
        setIsLoading(false);
    };

    return (
        <div className="p-6 bg-primary-light rounded-lg border border-primary/20">
            <h3 className="text-xl font-bold text-primary-dark flex items-center">
                <SparklesIcon className="w-6 h-6 mr-2" />
                Assistant IA - Résumé Clinique
            </h3>
            <p className="mt-2 text-sm text-primary-dark/80">
                Générez un résumé du cas pour le dossier patient en utilisant l'IA de Google. Vérifiez toujours l'exactitude du contenu généré.
            </p>
            <div className="mt-4">
                <button
                    onClick={handleGenerateSummary}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Génération en cours...' : 'Générer le résumé'}
                </button>
            </div>
            {isLoading && (
                 <div className="mt-4 text-center text-secondary-dark">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p>Contact de l'assistant IA...</p>
                 </div>
            )}
            {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {summary && (
                <div className="mt-4 p-4 bg-white rounded-md shadow-inner">
                    <h4 className="font-semibold text-secondary-dark">Résumé généré :</h4>
                    <pre className="mt-2 text-sm text-secondary-dark whitespace-pre-wrap font-sans">{summary}</pre>
                </div>
            )}
        </div>
    );
};

export default GeminiSummary;
