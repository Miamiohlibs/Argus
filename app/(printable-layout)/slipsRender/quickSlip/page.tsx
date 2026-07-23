// app/(printable-layout)/slipsRender/quickSlip/page.tsx
import * as z from 'zod';
import { checkUser } from '@/lib/checkUser';
import {
  isAllowedUserStatus,
  isAllowedAffiliation,
  isUserAffiliation,
} from '@/lib/typeChecker';
import { EntryWithItems } from '@/types/EntryWithItems';
import { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import generateRequestSlipItems from '@/lib/generateRequestSlipItems';
import { ItemEntry } from '@prisma/client';
import { BibEntryDraft, BibEntryDraftType } from '@/zod/BibEntry';
import { ItemEntry as ItemEntryZod, ItemEntryDraftType } from '@/zod/ItemEntry';
import { MultiPageHtml } from '@/components/RequestSlips/MultiPageHtml';

function createItemFromReq({
  bibData,
  itemData,
  params,
}: {
  bibData: BibEntryDraftType;
  itemData: ItemEntryDraftType[];
  params: { [key: string]: string | string[] | undefined };
}) {
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
    patronName: '',
    patronAffiliation: 'Miami',
    patronStatus: 'Other',
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

  const items: ItemEntry[] = itemData.map((item, index) => ({
    id: item.id ?? `quickSlip-${index}`,
    description: item.description ?? null,
    bibEntryId: item.bibEntryId ?? null,
    call_number: item.call_number ?? null,
    copy_id: item.copy_id ?? null,
    barcode: item.barcode ?? null,
    location_code: item.location_code ?? null,
    location_name: item.location_name ?? null,
    box: item.box ?? null,
    folder: item.folder ?? null,
    ms: item.ms ?? null,
  }));

  const bib: EntryWithItems = {
    id: 'quick-slips',
    catalogId: bibData.catalogId ?? null,
    catalogIdType: bibData.catalogIdType ?? null,
    catalog: bibData.catalog ?? 'ALMA',
    author: bibData.author ?? '',
    callNumber: bibData.callNumber ?? null,
    items,
    itemTitle: bibData.itemTitle ?? '',
    location_codes: bibData.location_codes ?? null,
    location_display: bibData.location_display ?? null,
    notes: bibData.notes ?? null,
    projectId: 99999,
    pub_date: bibData.pub_date ?? null,
    publisher: bibData.publisher ?? null,
    totalItems: bibData.totalItems ?? items.length,
    url: bibData.url ?? null,
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
      patronAffiliation: project.patronAffiliation ?? 'Miami',
      patronStatus: project.patronStatus ?? 'Other',
      patronName: '',
    },
  };

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

  if (
    params.hasOwnProperty('patronName') &&
    typeof params.patronName == 'string'
  ) {
    project.patronName = params.patronName;
  }

  if (
    params.hasOwnProperty('patronAffiliation') &&
    isUserAffiliation(params.patronAffiliation)
  ) {
    project.patronAffiliation = params.patronAffiliation;
  }

  if (
    params.hasOwnProperty('patronStatus') &&
    typeof params.patronStatus == 'string' &&
    isAllowedUserStatus(params.patronStatus)
  ) {
    project.patronStatus = params.patronStatus;
  }

  if (params.hasOwnProperty('purpose') && typeof params.purpose == 'string') {
    project.purpose = params.purpose;
  }

  return { bib, project };
}

export default async function RenderQuickSlip({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await checkUser();
  const searchParamsResolved = await searchParams;

  const bibDataRaw = searchParamsResolved.bibData;
  const itemDataRaw = searchParamsResolved.itemData;

  const bibData = BibEntryDraft.parse(
    typeof bibDataRaw === 'string' ? JSON.parse(bibDataRaw) : {},
  );
  const itemData = z
    .array(ItemEntryZod)
    .parse(typeof itemDataRaw === 'string' ? JSON.parse(itemDataRaw) : []);

  const { bib, project } = createItemFromReq({
    bibData,
    itemData,
    params: searchParamsResolved,
  });

  const items = generateRequestSlipItems([bib], project, user);

  return <MultiPageHtml books={items} />;
}
