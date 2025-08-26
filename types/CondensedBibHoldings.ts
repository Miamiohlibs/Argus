import type {
  AlmaItemHoldingBibData,
  AlmaItemHoldingHoldingData,
  AlmaItemHoldingItemData,
} from '@/types/AlmaItem';

export type CondensedBibHoldings = {
  bib_data: AlmaItemHoldingBibData;
  holding_data: AlmaItemHoldingHoldingData;
  items: AlmaItemHoldingItemData[];
  locationCodes: string;
};
