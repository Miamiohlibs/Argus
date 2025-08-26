import getEntries from '@/app/actions/getEntries';
import RequestSlip from './RequestSlip';
// import { EntryWithItems } from '@/types/EntryWithItems';
import { getUserByClerkUserId } from '@/app/actions/getUser';

// type EntriesResult = {
//   entries: EntryWithItems[];
//   totalCount: number;
// };

export default async function SlipsList({ id }: { id: string }) {
  const { data } = await getEntries(id);
  const entries = data?.entries ?? [];
  const { user } = await getUserByClerkUserId(entries[0]?.project.userId);

  return (
    <>
      {entries &&
        entries.map((entry) => {
          if (entry !== null)
            return (
              <div key={`wrapper-${entry.id}`}>
                <RequestSlip key={entry.id} entry={entry} user={user} />
              </div>
            );
        })}
    </>
  );
}

// export default SlipsList;
