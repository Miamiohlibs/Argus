export type RequestSlipProps = {
  author?: string;
  title?: string;
  location?: string;
  callNumber?: string | undefined;
  publisher?: string;
  date?: string;
  notes?: string;
  itemInfo?: string[] | undefined;
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
};
