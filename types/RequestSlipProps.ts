export type RequestSlipProps = {
  author?: string;
  title?: string;
  location?: string;
  callNumber?: string | undefined;
  catalog: string;
  publisher?: string;
  box?: string;
  folder?: string;
  ms?: string;
  date?: string;
  notes?: string;
  itemInfo?: string[] | never[] | undefined;
  highlightedItemIndex?: number;
  patronName?: string;
  patronAffiliation?: 'Miami' | 'Other';
  patronStatus?:
    | 'Undergrad'
    | 'Graduate'
    | 'Faculty'
    | 'Staff'
    | 'Alumni'
    | 'Other';
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
  displayPrintButton?: boolean;
};
