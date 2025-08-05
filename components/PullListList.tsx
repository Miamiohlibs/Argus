// import { PullList } from '@/types/PullList';
import type { PullList } from '@prisma/client';
import getPullLists from '@/app/actions/getPullLists';
// import PullListItem from './PullListItem';

const PullListList = async () => {
  const { pullLists, error } = await getPullLists();
  console.log('PullLists:', pullLists);
  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!pullLists || pullLists.length === 0) {
    return <p>No pull lists found. Add a new list to get started!</p>;
  }

  return (
    <>
      <h3>Your Lists</h3>
      <ul className="list">
        {pullLists &&
          pullLists.length > 0 &&
          pullLists.map((pullList: PullList) => (
            <li key={pullList.id}>
              {pullList.title} (ID: {pullList.id})
            </li>
          ))}
      </ul>
    </>
  );
};

export default PullListList;
