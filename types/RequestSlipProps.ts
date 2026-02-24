export type RequestSlipProps = {
  author?: string;
  title?: string;
  location?: string;
  callNumber?: string | undefined;
  publisher?: string;
  box?: string;
  folder?: string;
  ms?: string;
  date?: string;
  notes?: string;
  itemInfo?: string[] | never[] | undefined;
  highlightedItemIndex?: number;
  userName?: string;
  userEmail?: string;
  userAffiliation?: 'Miami' | 'Other';
  userStatus?:
    | 'Undergrad'
    | 'Graduate'
    | 'Faculty'
    | 'Staff'
    | 'Alumni'
    | 'Other';
  personPrinting?: string;
  projectName?: string;
  purpose: string | undefined;
  // displayPrintButton?: boolean;
};
