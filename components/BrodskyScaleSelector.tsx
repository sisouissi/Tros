
import React from 'react';
import { BRODSKY_DESCRIPTIONS } from '../constants';
import { BrodskyGrade } from '../types';

interface BrodskyScaleSelectorProps {
    selectedValue: BrodskyGrade | null;
    onChange: (value: BrodskyGrade) => void;
}

const BrodskyScaleSelector: React.FC<BrodskyScaleSelectorProps> = ({ selectedValue, onChange }) => {
    return (
        <div>
            <label className="block text-lg font-semibold text-secondary-dark mb-3">
                Grade des amygdales (Score de Brodsky)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BRODSKY_DESCRIPTIONS.map(({ grade, label, description }) => (
                    <div
                        key={grade}
                        onClick={() => onChange(grade)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedValue === grade ? 'border-primary bg-primary-light shadow-md' : 'border-slate-200 bg-white hover:border-primary'
                        }`}
                    >
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id={`brodsky-${grade}`}
                                name="brodsky-scale"
                                value={grade}
                                checked={selectedValue === grade}
                                onChange={() => onChange(grade)}
                                className="h-4 w-4 text-primary focus:ring-primary border-slate-300"
                            />
                            <label htmlFor={`brodsky-${grade}`} className="ml-3 block text-sm font-bold text-secondary-dark">
                                {label}
                            </label>
                        </div>
                        <p className="mt-2 text-sm text-secondary-dark">{description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrodskyScaleSelector;
