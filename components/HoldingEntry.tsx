'use client';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import entryAction from '@/app/actions/addEntry';
import { EntryWithItems } from '@/types/EntryWithItems';
import type { BibDataDraft, ItemDataDraft } from '@/lib/catalogs/types';
import { inHouseLocationCodes } from '@/lib/locationCodes';
import { useRouter } from 'next/navigation';
import QuickSlipProjectInfo from './QuickSlipProjectInfo';

interface HoldingEntryProps {
  bibData: BibDataDraft;
  items: ItemDataDraft[];
  projectId: string | number;
  actionType: 'add' | 'edit' | 'quickSlip';
  existingEntry?: EntryWithItems;
  isEditor: boolean;
  quickSlip: boolean;
  nonOwnerEditor: boolean;
  currentUserName: string;
}

const HoldingEntry = ({
  bibData,
  items,
  projectId,
  actionType,
  existingEntry,
  isEditor,
  quickSlip,
  nonOwnerEditor,
  currentUserName,
}: HoldingEntryProps) => {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<ItemDataDraft[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);

  const matchStringIfPresent = (
    str1: string | null | undefined,
    str2: string | null | undefined,
  ) => {
    if (typeof str1 == 'undefined' || str1 == null) {
      str1 = '';
    }
    if (typeof str2 == 'undefined' || str2 == null) {
      str2 = '';
    }
    return str1 == str2;
  };
  // Initialize selectedItems with existing entry items
  useEffect(() => {
    if (existingEntry && !isInitialized) {
      const existingItemData: ItemDataDraft[] = [];

      existingEntry.items.forEach((existingItem) => {
        // Find the matching item from the items array
        const matchingItem = items.find(
          (item) =>
            matchStringIfPresent(item.description, existingItem.description) &&
            matchStringIfPresent(
              item.location_code,
              existingItem.location_code,
            ) &&
            matchStringIfPresent(item.call_number, existingItem.call_number) &&
            matchStringIfPresent(item.barcode, existingItem.barcode) &&
            matchStringIfPresent(item.copy_id, existingItem.copy_id),
        );

        if (matchingItem) {
          existingItemData.push(matchingItem);
        }
      });

      setSelectedItems(existingItemData);
      setIsInitialized(true);
    }
  }, [existingEntry, items, isInitialized]);

  const handleItemCheck = (item: ItemDataDraft, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, item]);
    } else {
      setSelectedItems((prev) =>
        prev.filter((selectedItem) => selectedItem.clientKey !== item.clientKey),
      );
    }
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const defaultNote = nonOwnerEditor
      ? `added by ${currentUserName} as admin`
      : '';
    const holdingNote = noteRef.current?.value || defaultNote;
    const finalBibData: BibDataDraft = {
      ...bibData,
      notes: holdingNote || bibData.notes,
    };

    if (actionType == 'quickSlip') {
      const formData = new FormData(event.currentTarget);
      const qs = new URLSearchParams();
      qs.set('bibData', JSON.stringify(finalBibData));
      qs.set('itemData', JSON.stringify(selectedItems));
      for (const key of ['userName', 'userStatus', 'userAffiliation', 'purpose']) {
        const value = formData.get(key);
        if (value) {
          qs.set(key, value.toString());
        }
      }
      router.push(`/quickSlip/handler?${qs.toString()}`);
      return;
    }

    const { data, error } = await entryAction({
      bibData: finalBibData,
      itemData: selectedItems,
      projectId: Number(projectId),
      actionType,
      ...(existingEntry?.id && { existingEntryId: existingEntry.id }),
    });

    if (error) {
      toast.error(
        `Failed to ${actionType === 'add' ? 'add' : 'update'} entry`,
      );
    } else {
      toast.success(
        `Entry ${actionType === 'add' ? 'added' : 'updated'} successfully`,
      );
      console.log('Entry saved:', data);

      if (actionType === 'add') {
        formRef.current?.reset();
        setSelectedItems([]);
      }
    }
  };

  if (!isEditor) {
    return (
      <>
        <p>Notes: {existingEntry?.notes}</p>
        <p>
          Selected items:
          {existingEntry?.items.map((item) => item.description).join(', ')}
        </p>
      </>
    );
  }

  let sortedItems = items;
  if (items && inHouseLocationCodes) {
    const inHouseCodes = inHouseLocationCodes();
    // sort into inHouse and not-inHouse location codes, keep the rest in order
    const inHouse = items.filter((item) =>
      inHouseCodes.includes(item.location_code ?? ''),
    );
    const other = items.filter(
      (item) => !inHouseCodes.includes(item.location_code ?? ''),
    );
    sortedItems = inHouse.concat(other);
  }
  let submitButtonText;

  switch (actionType) {
    case 'quickSlip':
      submitButtonText = 'Print Slip';
      break;
    case 'edit':
      submitButtonText = 'Save Edits to Item';
      break;
    default:
      submitButtonText = 'Add Item to Project';
  }
  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <div key={'holding'} className="mb-4 border p-3">
        {quickSlip && <QuickSlipProjectInfo />}

        <Form.Group controlId={`mmsIdSearch`}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="holding-note">Note</InputGroup.Text>
            <Form.Control
              ref={noteRef}
              name="holdingNote"
              placeholder="Enter holdings note and/or select items below"
              aria-label="Holding note"
              aria-describedby="holding-note"
              defaultValue={
                (existingEntry?.notes ?? nonOwnerEditor)
                  ? `added by ${currentUserName} as admin`
                  : ''
              }
            />
            <Button type="submit" variant="primary">
              {submitButtonText}
            </Button>
          </InputGroup>
        </Form.Group>

        {/* Item Selection */}
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {sortedItems ? (
            sortedItems.map((item: ItemDataDraft) => {
              const copyNo =
                item.copy_id && parseInt(item.copy_id) > 1
                  ? `, Copy: ${item.copy_id}`
                  : '';
              const description = item.description ? `, ${item.description}` : '';
              const itemLabel =
                sortedItems.length === 1
                  ? 'Sole Item'
                  : `Item: ${item.location_code}: ${item.call_number} ${description} ${copyNo} (${item.location_name})`;

              const isChecked = selectedItems.some(
                (selected) => selected.clientKey === item.clientKey,
              );

              return (
                <li key={item.clientKey} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id={`item-${item.clientKey}`}
                    label={itemLabel}
                    checked={isChecked}
                    onChange={(e) => handleItemCheck(item, e.target.checked)}
                  />
                </li>
              );
            })
          ) : (
            <li className="text-muted">No items found</li>
          )}
        </ul>
      </div>
    </Form>
  );
};

export default HoldingEntry;
