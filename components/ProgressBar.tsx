
import React from 'react';
import { STEPS_CONFIG, CheckIcon } from '../constants';

interface ProgressBarProps {
    currentStep: number;
    trosType: '1' | '2' | '3' | 'undetermined';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, trosType }) => {
    const isType1Path = trosType === '1';
    const stepsToShow = isType1Path ? STEPS_CONFIG : [STEPS_CONFIG[0], STEPS_CONFIG[4]];
    
    return (
        <div className="w-full max-w-4xl mx-auto mb-8 px-4">
            <div className="flex items-center justify-between">
                {stepsToShow.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;
                    const isLastStep = index === stepsToShow.length - 1;

                    return (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center text-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isCompleted ? 'bg-primary text-white' : isActive ? 'bg-primary-light border-2 border-primary text-primary' : 'bg-slate-200 text-slate-500'
                                    }`}
                                >
                                    {isCompleted ? <CheckIcon className="w-6 h-6" /> : <span className="font-bold">{step.id}</span>}
                                </div>
                                <p className={`mt-2 text-xs sm:text-sm font-semibold transition-colors duration-300 ${isActive || isCompleted ? 'text-primary' : 'text-slate-500'}`}>
                                    {step.title}
                                </p>
                            </div>
                            {!isLastStep && (
                                <div className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-500 ${isCompleted ? 'bg-primary' : 'bg-slate-200'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressBar;
