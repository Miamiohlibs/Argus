import { cookies } from 'next/headers';

const COOKIE_NAME = 'argus-selected-entries';

type SelectedEntries = {
  projectId: string;
  entryIds: string[];
};

// Short-lived handoff between the "Print Selected Items" submit and the
// /slips/selected + /slipsRender/selected pages, so the entry id list never
// has to travel through the URL (and away from its size limits).
export async function setSelectedEntriesCookie(data: SelectedEntries) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, JSON.stringify(data), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 300,
    path: '/',
  });
}

export async function getSelectedEntriesCookie(): Promise<SelectedEntries | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SelectedEntries;
  } catch {
    return null;
  }
}
