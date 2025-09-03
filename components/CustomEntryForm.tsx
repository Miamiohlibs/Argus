'use client';
import { useState } from 'react';
import { useRef } from 'react';
import entryAction from '@/app/actions/addEntry';
import { toast } from 'react-toastify';

import {
  Form,
  FormControl,
  InputGroup,
  Button,
  FormLabel,
} from 'react-bootstrap';
import { BibEntry, ItemEntry } from '@prisma/client';

interface CustomEntryFormProps {
  projectId?: number;
  existingEntry?: ItemEntry & { bibEntry: BibEntry };
}

const CustomEntryForm = ({
  projectId,
  existingEntry,
}: CustomEntryFormProps) => {
  const pageHeaderText = existingEntry
    ? `Edit Custom Entry: ${existingEntry.bibEntry.itemTitle}`
    : 'New Custom Entry';

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    console.log('starting handleSubmit');
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log('Form submitted with data:', formData);
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
      location: formData.get('itemLocation') as string,
      pub_date: formData.get('pub_date') as string,
      notes: (formData.get('notes') as string) || '',
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

    const itemsToSubmit: Record<string, FormDataEntryValue> = {
      id: 'unknown',
      description: formData.get('itemDescription') ?? '',
      location: formData.get('itemLocation') ?? '',
      location_name: formData.get('itemLocation') ?? '',
      location_code: '',
      call_number: formData.get('itemCallNumber') ?? '',
      copy_id: formData.get('itemCopy') ?? '',
      bibEntryId: 'unknown',
      barcode: '',
      box: formData.get('itemBox') ?? '',
      folder: formData.get('itemFolder') ?? '',
      ms: formData.get('itemMs') ?? '',
      notes: formData.get('itemNotes') ?? '',
    };

    const safeItemData: {
      description: string | null;
      id: string;
      location: string | null;
      location_name: string | null;
      location_code: string | null;
      call_number: string | null;
      copy_id: string | null;
      bibEntryId: string;
      barcode: string | null;
      box: string | null;
      folder: string | null;
      ms: string | null;
      notes: string | null;
    } = {
      description: (formData.get('itemDescription') as string) ?? null,
      id: 'unknown',
      location: (formData.get('itemLocation') as string) ?? null,
      location_name: (formData.get('itemLocation') as string) ?? null,
      location_code: '',
      call_number: (formData.get('itemCallNumber') as string) ?? null,
      copy_id: (formData.get('itemCopy') as string) ?? null,
      bibEntryId: 'unknown',
      barcode: '',
      box: (formData.get('itemBox') as string) ?? null,
      folder: (formData.get('itemFolder') as string) ?? null,
      ms: (formData.get('itemMs') as string) ?? null,
      notes: (formData.get('itemNotes') as string) ?? null,
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
      // window.location.reload(); // Remove this for better UX
    }
  };

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <>
      {<h1>{pageHeaderText}</h1>}
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
            <InputGroup.Text id="title-note">Title</InputGroup.Text>
            <Form.Control
              type="text"
              id="itemTitle"
              name="itemTitle"
              aria-describedby="title-note"
              placeholder="Title"
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="author-note">Author</InputGroup.Text>
            <Form.Control
              type="text"
              id="author"
              name="author"
              aria-describedby="author-note"
              placeholder="Author"
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="publisher-note">Publisher</InputGroup.Text>
            <Form.Control
              type="text"
              id="publisher"
              name="publisher"
              aria-describedby="publisher-note"
              placeholder="Author"
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="pub-date-note">Pub. Date</InputGroup.Text>
            <Form.Control
              type="text"
              id="pub_date"
              name="pub_date"
              aria-describedby="pub-date-note"
              placeholder="Publication Date"
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="description-note">Description</InputGroup.Text>
            <Form.Control
              type="text"
              id="itemDescription"
              name="itemDescription"
              aria-describedby="description-note"
              placeholder="Description"
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="location-note">Location</InputGroup.Text>
            <Form.Control
              type="text"
              id="itemLocation"
              name="itemLocation"
              aria-describedby="location-note"
              placeholder="Location"
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="call-number-note">Call Number</InputGroup.Text>
            <Form.Control
              type="text"
              id="itemCallNumber"
              name="itemCallNumber"
              aria-describedby="call-number-note"
              placeholder="Item Call Number"
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="copy-note">Copy</InputGroup.Text>
            <Form.Control
              type="text"
              id="itemCopy"
              name="itemCopy"
              aria-describedby="copy-note"
              placeholder="Item Copy"
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="box-note">Box</InputGroup.Text>
            <Form.Control
              type="text"
              id="itemBox"
              name="itemBox"
              aria-describedby="box-note"
              placeholder="Item Box"
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="folder-note">Folder</InputGroup.Text>
            <Form.Control
              type="text"
              id="itemFolder"
              name="itemFolder"
              aria-describedby="folder-note"
              placeholder="Item Folder"
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="ms-note">MS</InputGroup.Text>
            <Form.Control
              type="text"
              id="itemMs"
              name="itemMs"
              aria-describedby="ms-note"
              placeholder="Item MS"
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-2">
          <InputGroup>
            <InputGroup.Text id="notes-note">Notes</InputGroup.Text>
            <Form.Control
              type="text"
              id="itemNotes"
              name="itemNotes"
              aria-describedby="notes-note"
              placeholder="Item Notes"
            />
          </InputGroup>
        </Form.Group>

        <Button
          type="submit"
          className="btn btn-primary"
          onClick={() => {
            console.log('Form submitted');
          }}
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default CustomEntryForm;
