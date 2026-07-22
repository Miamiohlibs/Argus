'use client';
import { useRef } from 'react';
import entryAction from '@/app/actions/addEntry';
import { toast } from 'react-toastify';
import { EntryWithItems } from '@/types/EntryWithItems';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import InputGroup, { InputGroupText } from '@/components/ui/InputGroup';
import Button from '@/components/ui/Button';
import type { BibDataDraft, ItemDataDraft } from '@/lib/catalogs/types';
import { useState } from 'react';
import { LocationCode, inHouseLocationData } from '@/lib/locationCodes';
import QuickSlipProjectInfo from './QuickSlipProjectInfo';
import { useRouter } from 'next/navigation';

interface CustomEntryFormProps {
  projectId?: number;
  existingEntry?: EntryWithItems;
  editable?: boolean;
  quickSlip?: boolean;
  nonOwnerEditor?: boolean;
  currentUserName: string;
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
  nonOwnerEditor = false,
  currentUserName,
}: CustomEntryFormProps) => {
  const router = useRouter();
  const [locations] = useState<LocationCode[]>(() => inHouseLocationData() ?? []);
  const [selectedLocation, setSelectedLocation] = useState<LocationCode | null>(
    null,
  );

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // console.log(`Selected location: ${e.target.value}`);
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
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const actionType = existingEntry ? 'edit' : 'add';

    const draftBibData: BibDataDraft = {
      itemTitle: (formData.get('itemTitle') as string) ?? '',
      author: (formData.get('author') as string) ?? '',
      catalogId: null,
      catalogIdType: null,
      catalog: 'CUSTOM',
      location_codes: selectedLocation ? selectedLocation.code : null,
      location_display: selectedLocation ? selectedLocation.name : null,
      pub_date: (formData.get('pub_date') as string) || null,
      publisher: null,
      callNumber: (formData.get('itemCallNumber') as string) || null,
      notes: (formData.get('itemNotes') as string) || '',
      totalItems: 1,
      url: null,
    };

    const draftItemData: ItemDataDraft = {
      clientKey: existingEntry?.items?.[0]?.id ?? 'custom-item',
      description: null,
      location_name: selectedLocation?.name ?? null,
      location_code: selectedLocation?.code ?? null,
      call_number: (formData.get('itemCallNumber') as string) || null,
      copy_id: (formData.get('itemCopy') as string) || null,
      barcode: null,
      box: (formData.get('itemBox') as string) || null,
      folder: (formData.get('itemFolder') as string) || null,
      ms: (formData.get('itemMs') as string) || null,
    };

    if (quickSlip) {
      const qs = new URLSearchParams();
      qs.set('bibData', JSON.stringify(draftBibData));
      qs.set('itemData', JSON.stringify([draftItemData]));
      for (const key of [
        'userName',
        'userStatus',
        'userAffiliation',
        'purpose',
      ]) {
        const value = formData.get(key);
        if (value) {
          qs.set(key, value.toString());
        }
      }
      router.push(`/quickSlip/handler?${qs.toString()}`);
      return;
    }

    const { data, error } = await entryAction({
      bibData: draftBibData,
      itemData: [draftItemData],
      projectId: Number(projectId),
      actionType,
      ...(existingEntry?.id && { existingEntryId: existingEntry.id }),
    });

    if (error) {
      toast.error(`Failed to ${actionType === 'add' ? 'add' : 'update'} entry`);
    } else {
      toast.success(
        `Entry ${actionType === 'add' ? 'added' : 'updated'} successfully`,
      );
      console.log('Entry saved:', data);

      if (actionType === 'add') {
        formRef.current?.reset();
      }
      // For edit, don't reload - let the user see the updated state
    }
  };

  let itemData: EntryWithItems['items'][number] | undefined = undefined;
  if (existingEntry && existingEntry.items && existingEntry?.items.length > 0) {
    itemData = existingEntry.items[0];
  }

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="mb-2">
          <InputGroup>
            <InputGroupText id="title-note" className="required">
              <label htmlFor="itemTitle">Title</label>
              <sup>*</sup>
            </InputGroupText>
            <Input
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
        </div>

        <div className="mb-2">
          <InputGroup>
            <InputGroupText id="author-note" className="required">
              <label htmlFor="author">Author</label> <sup>*</sup>
            </InputGroupText>
            <Input
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
        </div>
        <div className="mb-2">
          <InputGroup>
            <InputGroupText id="location-note" className="required">
              <label htmlFor="itemLocation">Location</label> <sup>*</sup>
            </InputGroupText>
            <Select
              id="itemLocation"
              name="itemLocation"
              aria-describedby="location-note"
              disabled={!editable}
              value={selectedLocation?.code || ''}
              onChange={handleLocationChange}
              required={true}
            >
              {locationSelectOptions}
            </Select>
          </InputGroup>
        </div>

        <div className="mb-2">
          <InputGroup>
            <InputGroupText id="pub-date-note">
              <label htmlFor="pub_date">Publication Date</label>
            </InputGroupText>
            <Input
              type="text"
              id="pub_date"
              name="pub_date"
              aria-describedby="pub-date-note"
              placeholder={editable ? 'Publication Date' : ''}
              disabled={!editable}
              defaultValue={existingEntry?.pub_date ?? ''}
            />
          </InputGroup>
        </div>

        <div className="mb-2">
          <InputGroup>
            <InputGroupText id="call-number-note">
              <label htmlFor="itemCallNumber">Call Number</label>
            </InputGroupText>
            <Input
              type="text"
              id="itemCallNumber"
              name="itemCallNumber"
              aria-describedby="call-number-note"
              placeholder={editable ? 'Item Call Number' : ''}
              disabled={!editable}
              defaultValue={itemData?.call_number ?? ''}
            />
          </InputGroup>
        </div>

        <div className="mb-2">
          <InputGroup>
            <InputGroupText id="copy-note">
              <label htmlFor="itemCopy">Copy</label>
            </InputGroupText>
            <Input
              type="text"
              id="itemCopy"
              name="itemCopy"
              aria-describedby="copy-note"
              placeholder={editable ? 'Item Copy' : ''}
              disabled={!editable}
              defaultValue={itemData?.copy_id ?? ''}
            />
          </InputGroup>
        </div>

        <div className="mb-2">
          <InputGroup>
            <InputGroupText id="box-note">
              <label htmlFor="itemBox">Box</label>
            </InputGroupText>
            <Input
              type="text"
              id="itemBox"
              name="itemBox"
              aria-describedby="box-note"
              placeholder={editable ? 'Item Box' : ''}
              defaultValue={itemData?.box ?? ''}
              disabled={!editable}
            />
          </InputGroup>
        </div>

        <div className="mb-2">
          <InputGroup>
            <InputGroupText id="folder-note">
              <label htmlFor="itemFolder">Folder</label>
            </InputGroupText>
            <Input
              type="text"
              id="itemFolder"
              name="itemFolder"
              aria-describedby="folder-note"
              placeholder={editable ? 'Item Folder' : ''}
              disabled={!editable}
              defaultValue={itemData?.folder ?? ''}
            />
          </InputGroup>
        </div>

        <div className="mb-2">
          <InputGroup>
            <InputGroupText id="ms-note">
              <label htmlFor="itemMs">Manuscript</label>
            </InputGroupText>
            <Input
              type="text"
              id="itemMs"
              name="itemMs"
              aria-describedby="ms-note"
              placeholder={editable ? 'Manuscript' : ''}
              disabled={!editable}
              defaultValue={itemData?.ms ?? ''}
            />
          </InputGroup>
        </div>

        <div className="mb-2">
          <InputGroup>
            <InputGroupText id="notes-note">
              <label htmlFor="itemNotes">Notes</label>
            </InputGroupText>
            <Input
              type="text"
              id="itemNotes"
              name="itemNotes"
              aria-describedby="notes-note"
              placeholder={editable ? 'Item Notes' : ''}
              disabled={!editable}
              defaultValue={
                (existingEntry?.notes ?? nonOwnerEditor)
                  ? `added by ${currentUserName} as admin`
                  : ''
              }
            />
          </InputGroup>
        </div>

        {quickSlip && <QuickSlipProjectInfo />}

        {editable && (
          <Button
            type="submit"
            onClick={() => {
              console.log('Form submitted');
            }}
          >
            Submit
          </Button>
        )}
      </form>
    </>
  );
};

export default CustomEntryForm;
