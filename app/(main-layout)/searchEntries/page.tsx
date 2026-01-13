import getUserInfo from '@/lib/getUserInfo';
import SearchClient from './SearchClient';

export default async function SearchPage() {
  const {
    user,
    permissions: { isAdmin },
  } = await getUserInfo();

  if (user == undefined) {
    return 'Must be logged in to search';
  }

  return (
    <main>
      <h1>
        Search items across {isAdmin ? 'all projects' : 'all of your projects'}
      </h1>
      <SearchClient userId={user.id} />
    </main>
  );
}
