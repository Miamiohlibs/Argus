import { User } from '@prisma/client';
import getUsers from '@/app/actions/getUsers';
import { Form } from 'react-bootstrap';

interface pageProps {
  users: User[];
}
export default function SelectUserFormElement({ users }: pageProps) {
  return (
    <Form.Select name="newOwnerId">
      <option value="">---Select a user---</option>
      {users &&
        users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
    </Form.Select>
  );
}
