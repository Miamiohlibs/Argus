import { EntryWithItems } from '@/types/EntryWithItems';
import getEntries from '@/app/actions/getEntries';
import getProject from '@/app/actions/getProject';
import Slip from './Slip';

const SlipsList = async ({ id }: { id: string }) => {
  const { project, error } = await getProject({ id });
  //   console.log(`Project ${id}: ${JSON.stringify(project?.title)}`);
  const { data } = await getEntries(id);
  const entries = data?.entries ?? [];
  //   console.log(`Entries: ${JSON.stringify(entries)}`);
  return (
    <>
      {entries &&
        entries.map((entry) => {
          //   console.log(`invoking entry in SlipsList: ${JSON.stringify(entry)}`);
          return <Slip key={entry.id} entry={entry} />;
        })}
    </>
  );
};

export default SlipsList;
