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
        Search items in{' '}
        {isAdmin ? 'all projects' : 'your projects and public projects'}
      </h1>
      <SearchClient userId={user.id} />
    </main>
  );
}
