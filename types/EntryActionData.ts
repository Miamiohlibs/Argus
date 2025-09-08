import { ItemEntry } from '@prisma/client';

interface EntryActionData {
  bibData: Record<string, FormDataEntryValue>;
  itemData: ItemEntry[];
  actionType: 'add' | 'edit';
  existingEntryId?: string;
}
export default EntryActionData;
