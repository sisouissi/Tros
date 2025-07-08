
import React from 'react';

interface StepCardProps {
    title: string;
    children: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ title, children }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl mx-auto transition-all duration-500">
            <div className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-secondary-dark mb-6">{title}</h2>
                <div className="space-y-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default StepCard;
