'use client';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import entryAction from '@/app/actions/addEntry';
import { EntryWithItems } from '@/types/EntryWithItems';
import type {
  AlmaItemDataPlusHoldingDetails,
  AlmaItemHoldingBibDataPlusCallAndLocation,
} from '@/types/CondensedBibHoldings';
import type { SafeStringifyInput } from '@/types/SafeStringInput';
import type { LocationCode } from '@/lib/locationCodes';
import { inHouseLocationCodes } from '@/lib/locationCodes';
import { useRouter } from 'next/navigation';
import QuickSlipProjectInfo from './QuickSlipProjectInfo';

interface miniItemData {
  pid: string;
  barcode: string;
  description?: string;
  location_code?: string;
  location_name?: string;
  call_number?: string;
  copy_id?: string;
  item_id: string;
  box?: string;
  folder?: string;
  ms?: string;
}

interface HoldingEntryProps {
  bibData: AlmaItemHoldingBibDataPlusCallAndLocation;
  items: AlmaItemDataPlusHoldingDetails[];
  locationCodes: string;
  locationNames: string;
  projectId: string | number;
  actionType: 'add' | 'edit' | 'quickSlip';
  existingEntry?: EntryWithItems;
  isEditor: boolean;
  quickSlip: boolean;
}

const HoldingEntry = ({
  bibData,
  items,
  locationCodes,
  locationNames,
  projectId,
  actionType,
  existingEntry,
  isEditor,
  quickSlip,
}: HoldingEntryProps) => {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<miniItemData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  // console.log('Existing Entry:', existingEntry);
  // console.log('Items', items);

  const matchStringIfPresent = (
    str1: string | null | undefined,
    str2: string | null | undefined
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
      // Convert existing entry items to miniItemData format
      const existingItemData: miniItemData[] = [];

      existingEntry.items.forEach((existingItem) => {
        // Find the matching item from the items array
        const matchingItem = items.find(
          (item) =>
            matchStringIfPresent(item.description, existingItem.description) &&
            matchStringIfPresent(
              item.location.value,
              existingItem.location_code
            ) &&
            matchStringIfPresent(item.call_number, existingItem.call_number) &&
            matchStringIfPresent(item.barcode, existingItem.barcode) &&
            matchStringIfPresent(item.copy_id, existingItem.copy_id)
        );

        if (matchingItem) {
          existingItemData.push({
            pid: matchingItem.pid || '',
            barcode: matchingItem.barcode || '',
            description: matchingItem.description || '',
            location_code: matchingItem.location.value,
            location_name: matchingItem.location.desc || '',
            call_number: matchingItem.call_number || '',
            copy_id: matchingItem.copy_id || '',
            item_id: `item-${matchingItem.pid || items.indexOf(matchingItem)}`,
          });
        }
      });

      setSelectedItems(existingItemData);
      setIsInitialized(true);
    }
  }, [existingEntry, items, isInitialized]);

  const handleItemCheck = (item: miniItemData, checked: boolean) => {
    console.log('working on item:', item);
    if (checked) {
      setSelectedItems((prev) => [...prev, item]);
      console.log('selected items after adding:', [...selectedItems, item]);
    } else {
      setSelectedItems((prev) =>
        prev.filter((selectedItem) => selectedItem.item_id !== item.item_id)
      );
      console.log(
        'selected items after removing:',
        selectedItems.filter(
          (selectedItem) => selectedItem.item_id !== item.item_id
        )
      );
    }
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const allFormData: Record<string, FormDataEntryValue> = {};
    const urlEncodedArray = [];
    for (const [key, value] of formData.entries()) {
      allFormData[key] = value;
      urlEncodedArray.push(key + '=' + encodeURIComponent(value.toString()));
    }
    const urlString = urlEncodedArray.join('&');

    // KEN: CALL & BIB MISSING FROM allFormData
    console.log('All Form Data:', allFormData);
    console.log('Selected Items:', selectedItems);

    const itemsToSubmit = selectedItems.map((item) => {
      console.log(`Item descripiton: ${JSON.stringify(item)}`);
      // console.log(`Desc:${description} Loc:${location}`);
      return {
        description: item.description || '',
        id: 'unknown',
        location_name: item.location_name || '',
        location_code: item.location_code || '',
        call_number: item.call_number || null,
        copy_id: item.copy_id || null,
        bibEntryId: 'unknown',
        barcode: item.barcode || null,
        box: item.box || null,
        folder: item.folder || null,
        ms: item.ms || null,
      };
    });

    if (actionType == 'quickSlip') {
      const slipsUrl = `/admin/quickSlip/handler?${urlString}`;
      console.log(slipsUrl);
      router.push(slipsUrl);
    } else {
      const { data, error } = await entryAction({
        bibData: allFormData,
        itemData: itemsToSubmit,
        actionType,
        ...(existingEntry?.id && { existingEntryId: existingEntry.id }),
      });

      if (error) {
        toast.error(
          `Failed to ${actionType === 'add' ? 'add' : 'update'} entry`
        );
      } else {
        toast.success(
          `Entry ${actionType === 'add' ? 'added' : 'updated'} successfully`
        );
        console.log('Entry saved:', data);

        if (actionType === 'add') {
          formRef.current?.reset();
          setSelectedItems([]);
        }
        // For edit, don't reload - let the user see the updated state
        // window.location.reload(); // Remove this for better UX
      }
    }
  };

  // Helper function to safely stringify values
  const safeStringify = (value: SafeStringifyInput): string => {
    if (value === undefined || value === null) {
      return '';
    }
    return JSON.stringify(value).replace(/^\"(.*)\"$/, '$1');
  };

  // Calculate location info
  let library_desc, location_value, location_desc;
  if (!locationCodes.includes(',') && items.length > 0) {
    location_desc = items[0].location?.desc;
    location_value = items[0].location?.value;
    library_desc = items[0].library?.desc;
    console.log(`set: ${location_desc}, ${library_desc}, ${location_value}`);
  }

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

  if (items && inHouseLocationCodes) {
    const inHouseCodes = inHouseLocationCodes();
    // sort into inHouse and not-inHouse location codes, keep the rest in order
    const inHouse = items.filter((item) =>
      inHouseCodes.includes(item.location.value)
    );
    const other = items.filter(
      (item) => !inHouseCodes.includes(item.location.value)
    );
    items = inHouse.concat(other);
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
    <Form onSubmit={handleSubmit}>
      <div key={'holding'} className="mb-4 border p-3">
        {quickSlip && <QuickSlipProjectInfo />}
        <Form.Control
          type="hidden"
          name="project_id"
          value={safeStringify(projectId)}
        />
        <Form.Control
          type="hidden"
          name="title"
          value={safeStringify(bibData?.title)}
        />
        <Form.Control
          type="hidden"
          name="author"
          value={safeStringify(bibData?.author)}
        />
        <Form.Control
          type="hidden"
          name="mms_id"
          value={safeStringify(bibData?.mms_id)}
        />
        <Form.Control
          type="hidden"
          name="place_of_publication"
          value={safeStringify(bibData?.place_of_publication)}
        />
        <Form.Control
          type="hidden"
          name="location"
          value={safeStringify(bibData?.location)}
        />
        <Form.Control
          type="hidden"
          name="location_names"
          value={safeStringify(bibData?.locationNames)}
        />
        <Form.Control
          type="hidden"
          name="call_number"
          value={safeStringify(bibData?.call_number)}
        />
        <Form.Control
          type="hidden"
          name="date_of_publication"
          value={safeStringify(bibData?.date_of_publication)}
        />
        <Form.Control
          type="hidden"
          name="publisher_const"
          value={safeStringify(bibData?.publisher_const)}
        />
        <Form.Control
          type="hidden"
          name="holdings_location_code"
          value={safeStringify(locationCodes)}
        />
        <Form.Control
          type="hidden"
          name="total_item_count"
          value={items.length}
        />
        <Form.Control type="hidden" name="actionType" value={actionType} />
        {existingEntry && (
          <Form.Control
            type="hidden"
            name="existing_entry_id"
            value={existingEntry?.id}
          />
        )}

        <Form.Group controlId={`mmsIdSearch`}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="holding-note">Note</InputGroup.Text>
            <Form.Control
              name="holdingNote"
              placeholder="Enter holdings note and/or select items below"
              aria-label="Holding note"
              aria-describedby="holding-note"
              defaultValue={existingEntry?.notes ?? ''}
            />
            <Button type="submit" variant="primary">
              {/* {actionType === 'add'
                ? 'Add Item to Project'
                : 'Save Edits to Item'} */}
              {submitButtonText}
            </Button>
          </InputGroup>
        </Form.Group>

        {/* Item Selection */}
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {items ? (
            items.map((item: AlmaItemDataPlusHoldingDetails, index: number) => {
              const copyNo =
                parseInt(item.copy_id) > 1 ? `, Copy: ${item.copy_id}` : '';
              const description =
                item.description != '' ? `, ${item.description}` : '';
              const itemLabel =
                items.length === 1
                  ? 'Sole Item'
                  : `Item: ${item.location.value}: ${item.call_number} ${description} ${copyNo} (${item.library.desc}: ${item.location.desc})`;

              const itemData: miniItemData = {
                pid: item.pid || '',
                barcode: item.barcode || '',
                description: item.description || '',
                location_code: item.location.value,
                location_name: item.location.desc,
                call_number: item.call_number || '',
                copy_id: item.copy_id || '',
                item_id: `item-${item.pid || index}`,
              };

              // Check if this item is selected (controlled by selectedItems state)
              const isChecked = selectedItems.some(
                (selected) => selected.item_id === itemData.item_id
              );

              return (
                <li key={item.barcode || `item-${index}`} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id={`item-${item.pid || index}`}
                    label={itemLabel}
                    checked={isChecked} // Now purely controlled by selectedItems state
                    onChange={(e) =>
                      handleItemCheck(itemData, e.target.checked)
                    }
                    value={
                      `${item.barcode};;;${item.location.value};;;${item.location.desc};;;${item.call_number};;;${item.description};;;${item.copy_id}` ||
                      ''
                    }
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
