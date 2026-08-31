import type { BibDataDraft, ItemDataDraft } from '@/lib/catalogs/types';

interface EntryActionData {
  bibData: BibDataDraft;
  itemData: ItemDataDraft[];
  projectId: number;
  actionType: 'add' | 'edit';
  existingEntryId?: string;
}
export default EntryActionData;
