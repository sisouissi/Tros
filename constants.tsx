

import React from 'react';
import { BrodskyGrade } from './types';

export const MAJOR_NOCTURNAL_SYMPTOMS = [
  "Ronflements sonores (supérieur à 3 nuits/semaine)",
  "Pauses respiratoires ou apnées rapportées par les parents",
  "Reprise inspiratoire bruyante",
  "Nécessité de secouer l'enfant pour qu'il respire",
];

export const BRODSKY_DESCRIPTIONS: { grade: BrodskyGrade; label: string; description: string }[] = [
  { grade: '0', label: 'Grade 0', description: 'Amygdales non visibles, contenues dans les loges.' },
  { grade: '1', label: 'Grade 1', description: 'Amygdales visibles, obstruction des VAS inférieur à 25%.' },
  { grade: '2', label: 'Grade 2', description: 'Amygdales dépassant les piliers, obstruction des VAS 25-50%.' },
  { grade: '3', label: 'Grade 3', description: 'Amygdales dépassant largement les piliers, obstruction des VAS 50-75%.' },
  { grade: '4', label: 'Grade 4', description: 'Amygdales jointives, obstruction des VAS supérieur à 75%.' },
];

export const STEPS_CONFIG = [
    { id: 1, title: 'Profil Patient' },
    { id: 2, title: 'Symptômes' },
    { id: 3, title: 'Examen Clinique' },
    { id: 4, title: 'Comorbidités' },
    { id: 5, title: 'Recommandation' }
];


// --- Icon Components ---

export const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const InfoIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const StethoscopeIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h-1.538c-.621 0-1.125-.504-1.125-1.125v-8.625c0-.621.504-1.125 1.125-1.125h1.538m14.152 0h1.538c.621 0 1.125.504 1.125 1.125v8.625c0 .621-.504 1.125-1.125 1.125h-1.538m-14.152-13.5h14.152M12 18v-4.75m0 0a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a1.125 1.125 0 0 1 1.125-1.125h1.5a3.375 3.375 0 0 0 3.375-3.375M12 18v-4.75m0 0a3.375 3.375 0 0 1 3.375-3.375h1.5a1.125 1.125 0 0 0 1.125-1.125v-1.5a1.125 1.125 0 0 0-1.125-1.125h-1.5a3.375 3.375 0 0 1-3.375-3.375" />
    </svg>
);