import getUsers from '@/app/actions/getUsers';
// import { User } from '@/types/User';
import { User } from '@prisma/client';
import UserItem from './UserItem';

const UserList = async () => {
  const { users, error } = await getUsers();
  return (
    <>
      <h1>User List</h1>
      <ul>
        {users && users.map((user) => <UserItem key={user.id} user={user} />)}
      </ul>
    </>
  );
};

export default UserList;
