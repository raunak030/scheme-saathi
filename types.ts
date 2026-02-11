export type Language = 'en' | 'hi';

export interface UserProfile {
  name: string;
  age: number | '';
  income: number | '';
  land: number | '';
  occupation: string;
  identityProof: boolean;
  bankAccount: boolean;
}

export type EligibilityStatus = 'ELIGIBLE' | 'CONDITIONAL' | 'INELIGIBLE';

export interface EligibilityResult {
  status: EligibilityStatus;
  score: number;
  reasonCode: string;
  explanation: string;
  missing: string[];
  alternatives: string[];
  requiresHumanReview: boolean;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}