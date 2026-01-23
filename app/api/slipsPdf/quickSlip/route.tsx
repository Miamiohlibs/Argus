// app/api/slipsPdf/[...slug]/route.tsx
import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { RequestSlipProps } from '@/types/RequestSlipProps';
import { MultiPagePdf } from '@/components/MultipagePdf';
import getEntries from '@/app/actions/getEntries';
import { getProject } from '@/app/actions/projectActions';
import filenamify from 'filenamify';
import { checkUser } from '@/lib/checkUser';
import { isAllowedUserStatus, isAllowedAffiliation } from '@/lib/typeChecker';
import { EntryWithItems } from '@/types/EntryWithItems';
import { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import generateRequestSlipItems from '@/lib/generateRequestSlipItems';
import { ItemEntry } from '@prisma/client';
import { getLocationNameFromCode } from '@/lib/locationCodes';

function createItemFromReq(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  // console.log('createItemFromReq params:', params);

  const selectedItems =
    req.nextUrl.searchParams.getAll('selectedItems[]') || [];
  const selectedItemObjects = selectedItems.map((json) => JSON.parse(json));

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

  if (
    params.hasOwnProperty('itemCopy') ||
    params.hasOwnProperty('itemBox') ||
    params.hasOwnProperty('itemFolder') ||
    params.hasOwnProperty('itemMs') ||
    params.hasOwnProperty('itemBox') ||
    params.hasOwnProperty('itemLocation')
  ) {
    if (params.hasOwnProperty('itemCopy')) {
      blankItem.copy_id = params.itemCopy;
    }
    if (params.hasOwnProperty('itemBox')) {
      blankItem.box = params.itemBox;
    }
    if (params.hasOwnProperty('itemFolder')) {
      blankItem.folder = params.itemFolder;
    }
    if (params.hasOwnProperty('itemMs')) {
      blankItem.ms = params.itemMs;
    }
    if (params.hasOwnProperty('itemBox')) {
      blankItem.box = params.itemBox;
    }
    if (params.hasOwnProperty('itemLocation')) {
      blankItem.location_code = params.itemLocation;
      blankItem.location_name =
        getLocationNameFromCode(params.itemLocation) || '';
    }
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

export async function GET(req: NextRequest) {
  const user = await checkUser();
  const { bib, project } = createItemFromReq(req);

  const items = generateRequestSlipItems([bib], project, user);

  //   console.log('****** BibEntries:', JSON.stringify(items, null, 2));

  const stream = await renderToStream(<MultiPagePdf books={items} />);
  const filenameBasis = 'Quick Slip';
  //   const filenameBasis = item.title ?? 'Quick Slip';
  const filename = filenamify(filenameBasis);

  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}.pdf"`,
    },
  });
}
