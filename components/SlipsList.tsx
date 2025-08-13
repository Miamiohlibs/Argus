import getEntries from '@/app/actions/getEntries';
import Slip from './Slip';

const SlipsList = async ({ id }: { id: string }) => {
  const { data } = await getEntries(id);
  const entries = data?.entries ?? [];

  return (
    <>
      {entries &&
        entries.map((entry) => {
          return <Slip key={entry.id} entry={entry} />;
        })}
    </>
  );
};

export default SlipsList;
