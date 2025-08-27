export type RequestSlipProps = {
  author?: string;
  title?: string;
  location?: string;
  callNumber?: string | undefined;
  publisher?: string;
  pub_date?: string;
  notes?: string;
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
