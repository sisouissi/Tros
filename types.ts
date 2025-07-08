export type BrodskyGrade = '0' | '1' | '2' | '3' | '4';
export type TrosType = '1' | '2' | '3' | 'undetermined';

export interface PatientData {
  age: number | null;
  isObese: boolean | null;
  hasSyndrome: boolean | null;
  majorSymptoms: string[];
  hasComorbidity: boolean | null;
  brodskyGrade: BrodskyGrade | null;
  hasAdenoidHypertrophy: boolean | null;
  iah: number | null;
}

export interface Recommendation {
  title: string;
  primaryAction: string;
  primaryActionColor: 'green' | 'amber' | 'blue';
  explanation: string;
  alternatives: string[];
  followUp: string;
}