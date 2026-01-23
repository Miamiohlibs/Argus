'use client';
import { useRef } from 'react';
import entryAction from '@/app/actions/addEntry';
import { toast } from 'react-toastify';
import { EntryWithItems } from '@/types/EntryWithItems';
import { Form, InputGroup, Button, FormSelect } from 'react-bootstrap';
import { BibEntry, ItemEntry } from '@prisma/client';
import { useState } from 'react';
import { useEffect } from 'react';
import { LocationCode, inHouseLocationData } from '@/lib/locationCodes';
import QuickSlipProjectInfo from './QuickSlipProjectInfo';
import { useRouter } from 'next/navigation';

interface CustomEntryFormProps {
  projectId?: number;
  existingEntry?: EntryWithItems;
  editable?: boolean;
  quickSlip?: boolean;
}

// interface LocationCode {
//   code: string;
//   name: string;
//   unofficial?: boolean;
// }

const CustomEntryForm = ({
  projectId,
  existingEntry,
  editable = true,
  quickSlip = false,
}: CustomEntryFormProps) => {
  const router = useRouter();
  const [locations, setLocations] = useState<LocationCode[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationCode | null>(
    null
  );

  const pageHeaderText = !existingEntry
    ? 'New Custom Entry'
    : editable
    ? `Edit Custom Entry: ${existingEntry.itemTitle}`
    : `Viewing Custom Entry: ${existingEntry.itemTitle}`;

  // Load locations only once on mount

  useEffect(() => {
    const locationCodes = inHouseLocationData();
    if (typeof locationCodes != 'undefined') {
      setLocations(locationCodes);
    }
  }, []);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(`Selected location: ${e.target.value}`);
    const selected =
      locations.find((loc) => loc.code === e.target.value) || null;
    setSelectedLocation(selected);
  };
  if (existingEntry?.location_codes && !selectedLocation) {
    const loc =
      locations.find((loc) => loc.code === existingEntry.location_codes) ||
      null;
    if (loc) {
      setSelectedLocation(loc);
    }
  }
  // Generate location select options
  const locationSelectOptions = locations.map((loc: LocationCode) => (
    <option key={loc.code} value={loc.code}>
      {loc.name}
    </option>
  ));
  const blankPullDownOption = (
    <option key="none" value="">
      --- Please select a location ---
    </option>
  );
  locationSelectOptions.unshift(blankPullDownOption);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    console.log('starting handleSubmit');
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log('Form submitted with data:', formData);
    if (quickSlip) {
      const allFormData: Record<string, FormDataEntryValue> = {};
      const urlEncodedArray = [];
      for (const [key, value] of formData.entries()) {
        allFormData[key] = value;
        urlEncodedArray.push(key + '=' + encodeURIComponent(value.toString()));
      }
      let urlString = urlEncodedArray.join('&');
      const slipsUrl = `/admin/quickSlip/handler?${urlString}`;
      router.push(slipsUrl);
      return true;
    }
    // const allFormData: Record<string, FormDataEntryValue> = {};
    // for (const [key, value] of formData.entries()) {
    //   allFormData[key] = value;
    // }
    // const actionType = 'add'; // or 'edit' (later)
    const actionType = existingEntry ? 'edit' : 'add';
    const bibData: Partial<BibEntry> = {
      itemTitle: formData.get('itemTitle') as string,
      author: formData.get('author') as string,
      almaId: 'unknown',
      almaIdType: 'unknown',
      // location: selectedLocation ? selectedLocation.code : '',
      location_codes: selectedLocation ? selectedLocation.code : '',
      location_display: selectedLocation ? selectedLocation.name : '',
      pub_date: formData.get('pub_date') as string,
      notes: (formData.get('itemNotes') as string) || '',
      projectId: projectId,
    };
    // Convert nulls to empty strings for FormData compatibility
    const safeBibData: Record<string, FormDataEntryValue> = Object.fromEntries(
      Object.entries(bibData).map(([key, value]) => [
        key,
        value === null
          ? ''
          : typeof value === 'number'
          ? value.toString()
          : value,
      ])
    );

    const safeItemData: {
      description: string | null;
      id: string;
      // location: string | null;
      location_name: string | null;
      location_code: string | null;
      call_number: string | null;
      copy_id: string | null;
      bibEntryId: string;
      barcode: string | null;
      box: string | null;
      folder: string | null;
      ms: string | null;
      //   notes: string | null;
    } = {
      description: (formData.get('itemDescription') as string) ?? null,
      id: 'unknown',
      // location: selectedLocation?.code ?? null,
      location_name: selectedLocation?.name ?? null,
      location_code: selectedLocation?.code ?? null,
      call_number: (formData.get('itemCallNumber') as string) ?? null,
      copy_id: (formData.get('itemCopy') as string) ?? null,
      bibEntryId: 'unknown',
      barcode: '',
      box: (formData.get('itemBox') as string) ?? null,
      folder: (formData.get('itemFolder') as string) ?? null,
      ms: (formData.get('itemMs') as string) ?? null,
      //   notes: (formData.get('itemNotes') as string) ?? null,
    };

    const { data, error } = await entryAction({
      bibData: safeBibData,
      itemData: [safeItemData],
      actionType,
      ...(existingEntry?.id && { existingEntryId: existingEntry.id }),
    });

    if (error) {
      toast.error(`Failed to ${actionType === 'add' ? 'add' : 'update'} entry`);
    } else {
      toast.success(
        `Entry ${actionType === 'add' ? 'added' : 'updated'} successfully`
      );
      console.log('Entry saved:', data);

      if (actionType === 'add') {
        formRef.current?.reset();
      }
      // For edit, don't reload - let the user see the updated state
    }
  };

  let itemData: ItemEntry | undefined = undefined;
  if (existingEntry && existingEntry.items && existingEntry?.items.length > 0) {
    itemData = existingEntry.items[0];
  }

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit}>
        {/* text fields for BibEntry and ItemEntry fields
       // // bib: itemTitle, author
        // item: description, location, call_number, copy, box, folder, ms 
        */}
        <Form.Control
          type="hidden"
          id="bibEntryId"
          name="bibEntryId"
          value={existingEntry?.id ?? 'unknown'}
        />
        <Form.Control
          type="hidden"
          id="projectId"
          name="projectId"
          value={projectId}
        />
        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="title-note" className="bg-primary text-white">
              <Form.Label htmlFor="itemTitle">Title</Form.Label>
              <sup>*</sup>
            </InputGroup.Text>
            <Form.Control
              type="text"
              id="itemTitle"
              name="itemTitle"
              aria-describedby="title-note"
              placeholder={editable ? 'Title (required)' : ''}
              disabled={!editable}
              defaultValue={existingEntry?.itemTitle ?? ''}
              required={true}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text className="bg-primary text-white" id="author-note">
              <Form.Label htmlFor="author">Author</Form.Label> <sup>*</sup>
            </InputGroup.Text>
            <Form.Control
              type="text"
              id="author"
              name="author"
              aria-describedby="author-note"
              placeholder={editable ? 'Author' : ''}
              disabled={!editable}
              defaultValue={existingEntry?.author ?? ''}
              required={true}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text
              id="location-note"
              className="bg-primary text-white"
            >
              <Form.Label htmlFor="itemLocation">Location</Form.Label>{' '}
              <sup>*</sup>
            </InputGroup.Text>
            <FormSelect
              id="itemLocation"
              name="itemLocation"
              aria-describedby="location-note"
              disabled={!editable}
              value={selectedLocation?.code || ''}
              onChange={handleLocationChange}
              required={true}
            >
              {locationSelectOptions}
            </FormSelect>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="pub-date-note">
              <Form.Label htmlFor="pub_date">Publication Date</Form.Label>
            </InputGroup.Text>
            <Form.Control
              type="text"
              id="pub_date"
              name="pub_date"
              aria-describedby="pub-date-note"
              placeholder={editable ? 'Publication Date' : ''}
              disabled={!editable}
              defaultValue={existingEntry?.pub_date ?? ''}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="call-number-note">
              <Form.Label htmlFor="itemCallNumber">Call Number</Form.Label>
            </InputGroup.Text>
            <Form.Control
              type="text"
              id="itemCallNumber"
              name="itemCallNumber"
              aria-describedby="call-number-note"
              placeholder={editable ? 'Item Call Number' : ''}
              disabled={!editable}
              defaultValue={itemData?.call_number ?? ''}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="copy-note">
              <Form.Label htmlFor="itemCopy">Copy</Form.Label>
            </InputGroup.Text>
            <Form.Control
              type="text"
              id="itemCopy"
              name="itemCopy"
              aria-describedby="copy-note"
              placeholder={editable ? 'Item Copy' : ''}
              disabled={!editable}
              defaultValue={itemData?.copy_id ?? ''}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="box-note">
              <Form.Label htmlFor="itemBox">Box</Form.Label>
            </InputGroup.Text>
            <Form.Control
              type="text"
              id="itemBox"
              name="itemBox"
              aria-describedby="box-note"
              placeholder={editable ? 'Item Box' : ''}
              defaultValue={itemData?.box ?? ''}
              disabled={!editable}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="folder-note">
              <Form.Label htmlFor="itemFolder">Folder</Form.Label>
            </InputGroup.Text>
            <Form.Control
              type="text"
              id="itemFolder"
              name="itemFolder"
              aria-describedby="folder-note"
              placeholder={editable ? 'Item Folder' : ''}
              disabled={!editable}
              defaultValue={itemData?.folder ?? ''}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="ms-note">
              <Form.Label htmlFor="itemMs">Manuscript</Form.Label>
            </InputGroup.Text>
            <Form.Control
              type="text"
              id="itemMs"
              name="itemMs"
              aria-describedby="ms-note"
              placeholder={editable ? 'Manuscript' : ''}
              disabled={!editable}
              defaultValue={itemData?.ms ?? ''}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="notes-note">
              <Form.Label htmlFor="itemNotes">Notes</Form.Label>
            </InputGroup.Text>
            <Form.Control
              type="text"
              id="itemNotes"
              name="itemNotes"
              aria-describedby="notes-note"
              placeholder={editable ? 'Item Notes' : ''}
              disabled={!editable}
              defaultValue={existingEntry?.notes ?? ''}
            />
          </InputGroup>
        </Form.Group>

        {quickSlip && <QuickSlipProjectInfo />}

        {editable && (
          <Button
            type="submit"
            className="btn btn-primary"
            onClick={() => {
              console.log('Form submitted');
            }}
          >
            Submit
          </Button>
        )}
      </Form>
    </>
  );
};

export default CustomEntryForm;
