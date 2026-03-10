import { User } from '@prisma/client';
import getUsers from '@/app/actions/getUsers';
import { Form } from 'react-bootstrap';

interface pageProps {
  users: User[];
  fieldName: string;
  appendNameString: boolean;
}
export default function SelectUserFormElement({
  users,
  fieldName,
  appendNameString = false,
}: pageProps) {
  return (
    <Form.Select name={fieldName}>
      <option value="">---Select a user---</option>
      {users &&
        users.map((u) => (
          // if append name string, pass both id and name delimited by &&&
          <option
            key={u.id}
            value={appendNameString ? `${u.id}&&&${u.name}` : u.id}
          >
            {u.name}
          </option>
        ))}
    </Form.Select>
  );
}
