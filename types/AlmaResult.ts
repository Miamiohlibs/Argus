import { AlmaHolding } from './AlmaHolding';

export interface AlmaResults {
  holding: AlmaHolding[];
  bib_data?: {
    title?: string;
    author?: string;
    mms_id?: string;
    [key: string]: any; // Allow other bib data properties
  };
  [key: string]: any; // Allow other top-level properties
}
