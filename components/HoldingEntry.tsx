'use client';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import AddEntry from '@/app/actions/addEntry';
import type { AlmaHolding } from '@/types/AlmaHolding';
import { EntryWithItems } from '@/types/EntryWithItems';
// import type { BibEntry, ItemEntry } from '@prisma/client';
import type { AlmaHoldingsItemData } from '@/types/AlmaHoldingsItemData';
import {
  AlmaItem,
  AlmaItemHoldingHoldingData,
  AlmaItemHoldingItemData,
  AlmaItemHoldingBibData,
} from '@/types/AlmaItem';
import type { SafeStringifyInput } from '@/types/SafeStringInput';
interface miniItemData {
  pid: string;
  barcode: string;
  description: string;
  item_id: string;
}

interface HoldingEntryProps {
  bibData: AlmaItemHoldingBibData;
  holdings: AlmaItemHoldingHoldingData;
  items: AlmaItemHoldingItemData[];
  locationCodes: string;
  projectId: string | number;
  actionType: 'add' | 'edit';
  existingEntry?: EntryWithItems;
  // onEntryAdded?: () => void;
}
const HoldingEntry = ({
  bibData,
  holdings,
  items,
  locationCodes,
  projectId,
  actionType,
  existingEntry,
}: // onEntryAdded,
HoldingEntryProps) => {
  const [selectedItems, setSelectedItems] = useState<miniItemData[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const handleItemCheck = (item: miniItemData, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, item]);
      console.log('selected items:', selectedItems);
    } else {
      setSelectedItems(
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
    for (const [key, value] of formData.entries()) {
      allFormData[key] = value;
    }

    console.log('All Form Data:', allFormData);
    console.log('Selected Items:', selectedItems);

    const itemsToSubmit = selectedItems.map((item) => {
      return {
        description: item.description,
        id: 'unknown',
        bibEntryId: 'unknown',
      };
    });
    const { data, error } = await AddEntry({
      bibData: allFormData,
      itemData: itemsToSubmit,
    });

    if (error) {
      toast.error('Failed to add entry');
    } else {
      toast.success('Entry added successfully');
      console.log('Entry added:', data);
      window.location.reload();
      formRef.current?.reset(); // clear the form
      setSelectedItems([]); // Clear selected items after successful submission
      // Clear local state instead of reloading

      // Call the parent callback to clear other forms
      // onEntryAdded?.();
    }
  };

  // Helper function to safely stringify values
  const safeStringify = (value: SafeStringifyInput): string => {
    if (value === undefined || value === null) {
      return '';
    }
    return JSON.stringify(value).replace(/^\"(.*)\"$/, '$1'); // Remove surrounding quotes if present
  };

  let library_desc, location_value, location_desc;

  if (!locationCodes.includes(',')) {
    // if only one location
    location_desc = items[0].location.desc;
    location_value = items[0].location.value;
    library_desc = items[0].library.desc;
    console.log(`set: ${location_desc}, ${library_desc}, ${location_value}`);
  }
  const existingItemDescriptions = existingEntry?.items.map(
    (entry) => entry.description
  );

  return (
    <Form onSubmit={handleSubmit}>
      <div key={holdings.holding_id} className="mb-4 border p-3">
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
          name="holdings_id"
          value={safeStringify(holdings.holding_id)}
        />
        <Form.Control
          type="hidden"
          name="holdings_location_code"
          value={safeStringify(locationCodes)}
        />
        <Form.Control
          type="hidden"
          name="holdings_call"
          value={safeStringify(holdings.call_number)}
        />
        <Form.Control
          type="hidden"
          name="total_item_count"
          value={items.length}
        />
        <Form.Group controlId={`mmsIdSearch-${holdings.holding_id}`}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="holding-note">Note</InputGroup.Text>
            <Form.Control
              name="holdingNote"
              placeholder="Enter holdings note and/or select items below"
              aria-label="Holding note"
              aria-describedby="holding-note"
              defaultValue={existingEntry?.notes ?? ''} // Add default value to prevent uncontrolled->controlled warning
            />
            <Button type="submit" variant="primary">
              {actionType == 'add'
                ? 'Add Item to Project'
                : 'Save Edits to Item'}
            </Button>
          </InputGroup>
        </Form.Group>
        <p>Checked boxes: {JSON.stringify(existingEntry?.items)}</p>
        <p>
          <strong>{library_desc || 'Unknown Library'}</strong> &mdash;{' '}
          {location_desc || 'Unknown Location'} ({location_value || 'N/A'})
        </p>
        <p>
          Call Number: <strong>{holdings.call_number || 'N/A'}</strong>
        </p>
        {/*  */}
        {/* Begin Item Selection */}
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {items ? (
            items.map((item: AlmaItemHoldingItemData, index: number) => {
              // Calculate item label based on the number of items
              const itemLabel =
                items.length === 1
                  ? 'Sole Item'
                  : `Item: ${
                      item.description || `Unknown Item: ${items.length}`
                    }`;

              return (
                <li key={item.barcode || `item-${index}`} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id={`item-${item.pid || index}`}
                    label={itemLabel}
                    checked={
                      existingItemDescriptions?.includes(
                        item.description || ''
                      ) ||
                      selectedItems.some(
                        (selected) =>
                          selected.item_id === `item-${item.pid || index}`
                      )
                    }
                    onChange={(e) =>
                      handleItemCheck(
                        {
                          pid: item.pid || '',
                          barcode: item.barcode || '',
                          description: item.description || '',
                          item_id: `item-${item.pid || index}`,
                        },
                        e.target.checked
                      )
                    }
                    value={item.barcode || ''}
                  />
                </li>
              );
            })
          ) : (
            <li className="text-muted">No items found</li>
          )}
        </ul>
        {/* End Item Selection */}
      </div>
    </Form>
  );
};

export default HoldingEntry;
