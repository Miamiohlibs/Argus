// app/(printable-layout)/slipsRender/quickSlip/page.tsx
import logger from '@/lib/logger';
import { checkUser } from '@/lib/checkUser';
import { isAllowedUserStatus, isAllowedAffiliation } from '@/lib/typeChecker';
import { EntryWithItems } from '@/types/EntryWithItems';
import { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import generateRequestSlipItems from '@/lib/generateRequestSlipItems';
import { ItemEntry } from '@prisma/client';
import { ItemEntry as ItemEntryZod } from '@/zod/ItemEntry';
import { getLocationNameFromCode } from '@/lib/locationCodes';
import { MultiPageHtml } from '@/components/MutliPageHtml';

function createItemFromReq({
  params,
  selectedItemObjects,
}: {
  params: { [key: string]: string | string[] | undefined };
  selectedItemObjects: ItemEntry[];
}) {
  // const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  console.log('createItemFromReq params:', params);

  // const selectedItemObjects = params.selectedItemObjects || [];

  // create some blank/dummy objects to start, with enough data to meet the minimum expectations for a db entry
  const project: ProjectWithUserAndBib = {
    bibEntries: [],
    coEditors: [],
    createdAt: new Date(),
    id: 99999,
    needForDate: new Date(),
    notes: '',
    public: false,
    purpose: 'Quick Slips',
    status: '',
    subjects: [],
    title: 'Quick Slips',
    updatedAt: new Date(),
    user: {
      affiliation: 'Miami',
      clerkUserId: 'quick-slips',
      createdAt: new Date(),
      email: '',
      id: 'quick-slips',
      name: '',
      printSlips: true,
      role: 'user',
      status: 'Other',
      updatedAt: new Date(),
      imageUrl: '',
    },
    userId: 'quick-slips',
  };
  const bib: EntryWithItems = {
    id: 'quick-slips',
    almaId: '',
    almaIdType: '',
    author: '',
    callNumber: '',
    items: selectedItemObjects,
    itemTitle: '',
    location_codes: '',
    location_display: '',
    notes: '',
    projectId: 99999,
    pub_date: '',
    publisher: '',
    totalItems: 0,
    url: '',
    project: {
      id: 99999,
      createdAt: new Date(),
      needForDate: new Date(),
      notes: '',
      public: false,
      purpose: 'Other',
      title: 'Quick Slips',
      status: '',
      subjects: [],
      updatedAt: new Date(),
      userId: 'none',
    },
  };
  const blankItem: ItemEntry = {
    id: 'quickSlip',
    call_number: '',
    barcode: '',
    box: '',
    copy_id: '',
    description: '',
    folder: '',
    location_code: '',
    location_name: '',
    bibEntryId: '',
    ms: '',
  };

  if (params.hasOwnProperty('title') && typeof params.title == 'string') {
    bib.itemTitle = params.title;
  } else if (
    params.hasOwnProperty('itemTitle') &&
    typeof params.itemTitle == 'string'
  ) {
    bib.itemTitle = params.itemTitle;
  }

  if (params.hasOwnProperty('author') && typeof params.author == 'string') {
    bib.author = params.author;
  }

  if (
    params.hasOwnProperty('holdingNote') &&
    typeof params.holdingNote == 'string'
  ) {
    bib.notes = params.holdingNote;
  }

  // Question: we pass location and location_names -- what to use?
  if (params.hasOwnProperty('location') && typeof params.location == 'string') {
    bib.location_codes = params.location;
  }

  if (
    params.hasOwnProperty('location_display') &&
    typeof params.location_display == 'string'
  ) {
    bib.location_display = params.location_display;
  }
  if (
    params.hasOwnProperty('date_of_publication') &&
    typeof params.date_of_publication == 'string'
  ) {
    bib.pub_date = params.date_of_publication;
  } else if (
    params.hasOwnProperty('pub_date') &&
    typeof params.pub_date == 'string'
  ) {
    bib.pub_date = params.pub_date;
  }

  if (
    params.hasOwnProperty('call_number') &&
    typeof params.call_number == 'string'
  ) {
    bib.callNumber = params.call_number;
  } else if (
    params.hasOwnProperty('itemCallNumber') &&
    typeof params.itemCallNumber == 'string'
  ) {
    bib.callNumber = params.itemCallNumber;
  }

  let blankItemFieldsCount = 0;

  if (params.hasOwnProperty('itemCopy') && typeof params.itemCopy == 'string') {
    blankItem.copy_id = params.itemCopy;
    blankItemFieldsCount++;
  }
  if (params.hasOwnProperty('itemBox') && typeof params.itemBox == 'string') {
    blankItem.box = params.itemBox;
    blankItemFieldsCount++;
  }
  if (
    params.hasOwnProperty('itemFolder') &&
    typeof params.itemFolder == 'string'
  ) {
    blankItem.folder = params.itemFolder;
    blankItemFieldsCount++;
  }
  if (params.hasOwnProperty('itemMs') && typeof params.itemMs == 'string') {
    blankItem.ms = params.itemMs;
    blankItemFieldsCount++;
  }
  if (params.hasOwnProperty('itemBox') && typeof params.itemBox == 'string') {
    blankItem.box = params.itemBox;
    blankItemFieldsCount++;
  }
  if (
    params.hasOwnProperty('itemLocation') &&
    typeof params.itemLocation == 'string'
  ) {
    blankItem.location_code = params.itemLocation;
    blankItem.location_name =
      getLocationNameFromCode(params.itemLocation) || '';
    blankItemFieldsCount++;
  }

  // if populated the blank item with any data, add it as an item
  if (blankItemFieldsCount > 0) {
    bib.items.push(blankItem);
  }

  if (
    params.hasOwnProperty('publisher_const') &&
    typeof params.publisher_const == 'string'
  ) {
    bib.publisher = params.publisher_const;
  }

  if (params.hasOwnProperty('userName') && typeof params.userName == 'string') {
    project.user.name = params.userName;
  }

  if (
    params.hasOwnProperty('userStatus') &&
    typeof params.userStatus == 'string' &&
    isAllowedUserStatus(params.userStatus)
  ) {
    project.user.status = params.userStatus;
  }

  if (
    params.hasOwnProperty('userAffiliation') &&
    typeof params.userAffiliation == 'string' &&
    isAllowedAffiliation(params.userAffiliation)
  ) {
    project.user.affiliation = params.userAffiliation;
  }

  if (params.hasOwnProperty('purpose') && typeof params.purpose == 'string') {
    project.purpose = params.purpose;
  }
  return { bib, project };
}

export default async function RenderQuickSlip({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await checkUser();

  // const params = Object.fromEntries(req.nextUrl.searchParams.entries());

  const rawSelected = searchParams['selectedItems[]'];

  // normalize the array
  const selectedArray = Array.isArray(rawSelected)
    ? rawSelected
    : rawSelected
      ? [rawSelected]
      : [];

  const selectedItemObjects = selectedArray.map((item) => {
    const itemObj: any = JSON.parse(item);
    itemObj.id = itemObj.item_id; //.replace('item-', '');
    return ItemEntryZod.parse(itemObj);
  });

  // return <pre>{JSON.stringify(selectedItemObjects, null, 2)}</pre>;
  const { bib, project } = createItemFromReq({
    params: searchParams,
    selectedItemObjects,
  });

  const items = generateRequestSlipItems([bib], project, user);
  // console.log('****** BibEntries:', JSON.stringify(items, null, 2));

  return <MultiPageHtml books={items} />;
  //   const stream = await renderToStream(<MultiPagePdf books={items} />);
  //   const filenameBasis = 'Quick Slip';
  //   //   const filenameBasis = item.title ?? 'Quick Slip';
  //   const filename = filenamify(filenameBasis);

  //   return new NextResponse(stream as any, {
  //     headers: {
  //       'Content-Type': 'application/pdf',
  //       'Content-Disposition': `inline; filename="${filename}.pdf"`,
  //     },
  //   });
}
