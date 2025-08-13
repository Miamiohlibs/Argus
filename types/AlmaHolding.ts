// Define only the fields you care about, allow anything else
export interface AlmaHolding {
  holding_id?: string;
  link?: string;
  library?: {
    desc?: string;
    [key: string]: any; // Allow other library properties
  };
  location?: {
    desc?: string;
    value?: string;
    [key: string]: any; // Allow other location properties
  };
  call_number?: string;
  itemDetails?: {
    item?: any[];
    total_record_count?: number;
    [key: string]: any; // Allow other item detail properties
  };
  [key: string]: any; // Allow any other properties at the holding level
}
