'use client';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import AddEntry from '@/app/actions/addEntry';
import type { AlmaHolding } from '@/types/AlmaHolding';
import type { ItemEntry } from '@prisma/client';
import type { AlmaHoldingsItemData } from '@/types/AlmaHoldingsItemData';

interface HoldingEntryProps {
  holdings: AlmaHolding[];
  projectId: string | number;
  // onEntryAdded?: () => void;
}
const HoldingEntry = ({
  holdings,
  projectId,
}: // onEntryAdded,
HoldingEntryProps) => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const handleItemCheck = (item: any, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, item]);
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

    const { data, error } = await AddEntry({
      bibData: allFormData,
      itemData: selectedItems,
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
  const safeStringify = (value: any): string => {
    if (value === undefined || value === null) {
      return '';
    }
    return JSON.stringify(value).replace(/^\"(.*)\"$/, '$1'); // Remove surrounding quotes if present
  };

  return (
    <Form onSubmit={handleSubmit}>
      {holdings.map((holding) => {
        // Safe access to nested properties
        const firstItem = holding.itemDetails?.item?.[0];
        const bibData = firstItem?.bib_data;

        return (
          <div key={holding.holding_id} className="mb-4 border p-3">
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
              value={safeStringify(holding.holding_id)}
            />
            <Form.Control
              type="hidden"
              name="holdings_library_name"
              value={safeStringify(holding.library?.desc)}
            />
            <Form.Control
              type="hidden"
              name="holdings_library_location"
              value={safeStringify(holding.location?.desc)}
            />
            <Form.Control
              type="hidden"
              name="holdings_location_code"
              value={safeStringify(holding.location?.value)}
            />
            <Form.Control
              type="hidden"
              name="holdings_call"
              value={safeStringify(holding.call_number)}
            />
            <Form.Control
              type="hidden"
              name="total_item_count"
              value={holding.itemDetails?.total_record_count}
            />
            <Form.Group controlId={`mmsIdSearch-${holding.holding_id}`}>
              <InputGroup className="mb-3">
                <InputGroup.Text id="holding-note">Note</InputGroup.Text>
                <Form.Control
                  name="holdingNote"
                  placeholder="Enter holdings note and/or select items below"
                  aria-label="Holding note"
                  aria-describedby="holding-note"
                  defaultValue="" // Add default value to prevent uncontrolled->controlled warning
                />
                <Button type="submit" variant="primary">
                  Add Item to Project
                </Button>
              </InputGroup>
            </Form.Group>

            <p>
              <strong>{holding.library?.desc || 'Unknown Library'}</strong>{' '}
              &mdash; {holding.location?.desc || 'Unknown Location'} (
              {holding.location?.value || 'N/A'})
            </p>
            <p>
              Call Number: <strong>{holding.call_number || 'N/A'}</strong>
            </p>

            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
              {holding.itemDetails && holding.itemDetails.item ? (
                holding.itemDetails.item.map(
                  (item: AlmaHoldingsItemData, index: number) => {
                    // Calculate item label based on the number of items
                    const itemLabel =
                      item.length === 1
                        ? 'Sole Item'
                        : `Item: ${
                            item.item_data?.description ||
                            `Unknown Item: ${item.length}`
                          }`;

                    return (
                      <li
                        key={item.item_data?.barcode || `item-${index}`}
                        className="mb-2"
                      >
                        <Form.Check
                          type="checkbox"
                          id={`item-${item.item_data?.pid || index}`}
                          label={itemLabel}
                          onChange={(e) =>
                            handleItemCheck(
                              {
                                pid: item.item_data?.pid || '',
                                barcode: item.item_data?.barcode || '',
                                description: item.item_data?.description || '',
                              },
                              e.target.checked
                            )
                          }
                          value={item.item_data?.barcode || ''}
                        />
                      </li>
                    );
                  }
                )
              ) : (
                <li className="text-muted">No items found</li>
              )}
            </ul>
          </div>
        );
      })}
    </Form>
  );
};

export default HoldingEntry;
