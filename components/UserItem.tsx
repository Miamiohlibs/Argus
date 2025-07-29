import { User } from '@/types/User';

const UserItem = ({ user }: { user: User }) => {
  return (
    <li>
      {user.name} - {user.email} - {user.role}
    </li>
  );
};

export default UserItem;
