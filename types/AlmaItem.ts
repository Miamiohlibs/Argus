export type AlmaItemHoldingBibData = {
  title: string;
  author: string;
  mms_id: string;
  bib_suppress_from_publishing: string;
  complete_edition: string;
  network_number: string[];
  place_of_publication: string;
  date_of_publication: string;
  publisher_const: string;
  link: string;
};

export type AlmaItemHoldingHoldingData = {
  holding_id: string;
  holding_suppress_from_publishing: string; // "false" in example, but API returns string
  calculated_suppress_from_publishing: string;
  permanent_call_number_type: {
    value: string;
    desc: string;
  };
  permanent_call_number: string;
  call_number_type: {
    value: string;
    desc: string;
  };
  call_number: string;
  accession_number: string;
  copy_id: string;
  in_temp_location: boolean;
  temp_library: Record<string, never>; // empty object in example
  temp_location: Record<string, never>;
  temp_call_number_type: {
    value: string;
  };
  temp_call_number: string;
  temp_call_number_source: string;
  temp_policy: {
    value: string;
  };
  link: string;
};
export type AlmaItemHoldingItemData = {
  pid: string;
  barcode: string;
  policy: {
    value: string;
    desc: string;
  };
  provenance: {
    value: string;
  };
  description: string;
  library: {
    value: string;
    desc: string;
  };
  location: {
    value: string;
    desc: string;
  };
  pages: string;
  pieces: string;
  requested: boolean;
  creation_date: string; // e.g., "2009-04-20Z"
  modification_date: string;
  base_status: {
    value: string;
    desc: string;
  };
  awaiting_reshelving: boolean;
  physical_material_type: {
    value: string;
    desc: string;
  };
  po_line: string;
  is_magnetic: boolean;
  arrival_date: string;
  year_of_issue: string;
  enumeration_a: string;
  enumeration_b: string;
  enumeration_c: string;
  enumeration_d: string;
  enumeration_e: string;
  enumeration_f: string;
  enumeration_g: string;
  enumeration_h: string;
  chronology_i: string;
  chronology_j: string;
  chronology_k: string;
  chronology_l: string;
  chronology_m: string;
  break_indicator: {
    value: string;
  };
  pattern_type: {
    value: string;
  };
  linking_number: string;
  type_of_unit: string;
  receiving_operator: string;
  process_type: {
    value: string;
  };
  inventory_number: string;
  inventory_price: string;
  alternative_call_number: string;
  alternative_call_number_type: {
    value: string;
  };
  storage_location_id: string;
  public_note: string;
  fulfillment_note: string;
  internal_note_1: string;
  internal_note_2: string;
  internal_note_3: string;
  statistics_note_1: string;
  statistics_note_2: string;
  statistics_note_3: string;
  physical_condition: Record<string, never>;
  committed_to_retain: Record<string, never>;
  retention_reason: {
    value: string;
  };
  retention_note: string;
  link: string;
};

export type AlmaItem = {
  link: string;
  holding_data: AlmaItemHoldingHoldingData;
  item_data: AlmaItemHoldingItemData;
  bib_data: AlmaItemHoldingBibData;
};

export type AlmaItemApiResponse = {
  total_record_count: number;
  item: AlmaItem[];
};
