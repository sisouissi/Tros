import React, { useState } from 'react';

interface IahInputProps {
    onIahSubmit: (iah: number) => void;
}

const IahInput: React.FC<IahInputProps> = ({ onIahSubmit }) => {
    const [iahValue, setIahValue] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const iah = parseFloat(iahValue);
        if (!isNaN(iah) && iah >= 0) {
            onIahSubmit(iah);
        }
    };

    return (
        <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl shadow-lg w-full max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-blue-800">
                Avez-vous les résultats de l'examen du sommeil ?
            </h3>
            <p className="mt-2 text-sm text-blue-700">
                Si un examen (PSG/PG) a été réalisé, entrez l'index d'apnées-hypopnées (IAH) ci-dessous pour affiner la recommandation.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex-grow">
                    <label htmlFor="iah-input" className="sr-only">IAH (évènements/heure)</label>
                    <input
                        id="iah-input"
                        type="number"
                        step="0.1"
                        min="0"
                        value={iahValue}
                        onChange={(e) => setIahValue(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary text-lg"
                        placeholder="ex: 6.5"
                        aria-label="Valeur IAH"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-slate-400 disabled:cursor-not-allowed"
                    disabled={!iahValue || parseFloat(iahValue) < 0}
                >
                    Affiner la recommandation
                </button>
            </form>
        </div>
    );
};

export default IahInput;
