'use client';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { useRef } from 'react';

const HoldingEntry = ({ holdings }: { holdings: any[] }) => {
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

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // console.log('FormData:', formData.get('holdingNote'));
    const allFormData: Record<string, FormDataEntryValue> = {};
    for (const [key, value] of formData.entries()) {
      allFormData[key] = value;
    }

    console.log('All Form Data:', allFormData);
    console.log('Selected Items:', selectedItems);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {holdings.map((holding) => (
        <div key={holding.holding_id} className="mb-4 border p-3">
          <Form.Control
            type="hidden"
            name="holdings_id"
            value={JSON.stringify(holding.holding_id)}
          />
          <Form.Control
            type="hidden"
            name="holdings_library_name"
            value={JSON.stringify(holding.library.desc)}
          />
          <Form.Control
            type="hidden"
            name="holdings_library_location"
            value={JSON.stringify(holding.location.desc)}
          />
          <Form.Control
            type="hidden"
            name="holdings_location_code"
            value={JSON.stringify(holding.location.value)}
          />
          <Form.Control
            type="hidden"
            name="holdings_call"
            value={JSON.stringify(holding.call_number)}
          />
          <Form.Group controlId="mmsIdSearch">
            <InputGroup className="mb-3">
              <InputGroup.Text id="holding-note">Note</InputGroup.Text>
              <Form.Control
                name="holdingNote"
                placeholder="Enter holdings note and/or select items below"
                aria-label="Holding note"
                aria-describedby="holding-note"
              />
              <Button type="submit" variant="primary">
                Add Item to Project
              </Button>
            </InputGroup>
          </Form.Group>
          <p>
            <strong>{holding.library.desc}</strong> &mdash;{' '}
            {holding.location.desc} ({holding.location.value})
          </p>
          <p>
            Call Number: <strong>{holding.call_number}</strong>
          </p>

          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {holding.itemDetails && holding.itemDetails.item ? (
              holding.itemDetails.item.map((item: any) => (
                <li key={item.item_data.barcode} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id={`item-${item.item_data.pid}`}
                    label={`Item: ${item.item_data.description}`}
                    onChange={(e) =>
                      handleItemCheck(
                        {
                          pid: item.item_data.pid,
                          barcode: item.item_data.barcode || '',
                          description: item.item_data.description,
                        },
                        e.target.checked
                      )
                    }
                    value={item.item_data.barcode}
                  />
                </li>
              ))
            ) : (
              <li className="text-muted">No items found</li>
            )}
          </ul>
        </div>
      ))}

      {selectedItems.length > 0 && (
        <div className="mt-3">
          <p>
            <strong>Selected Items: {selectedItems.length}</strong>
          </p>
          <Button type="submit" variant="primary">
            Submit Selected Items
          </Button>
        </div>
      )}
    </Form>
  );
};

export default HoldingEntry;
