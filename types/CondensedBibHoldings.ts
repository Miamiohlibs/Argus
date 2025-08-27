import type {
  AlmaItemHoldingBibData,
  AlmaItemHoldingHoldingData,
  AlmaItemHoldingItemData,
} from '@/types/AlmaItem';

export interface AlmaItemDataPlusHoldingDetails
  extends AlmaItemHoldingItemData {
  copy_id: string;
  holding_id: string;
  call_number: string;
  barcode: string;
}

export type CondensedBibHoldings = {
  bib_data: AlmaItemHoldingBibData;
  // holding_data: AlmaItemHoldingHoldingData;
  items: AlmaItemDataPlusHoldingDetails[];
  locationCodes: string;
};
