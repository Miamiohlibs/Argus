import getUser from '@/app/actions/getUser';
import {
  Form,
  FormControl,
  FormLabel,
  Button,
  InputGroup,
} from 'react-bootstrap';

const UserEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { user } = await getUser(id);
  const possibleRoles = ['user', 'admin'];

  if (!user) {
    return <p>User not found</p>;
  }
  return (
    <>
      <h1>Edit User Permissions</h1>
      <div
        style={{
          alignItems: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Current Role: {user.role}</p>
        <Form>
          <InputGroup>
            <FormLabel htmlFor="role">Role</FormLabel>
            <FormControl as="select" id="role" name="role">
              {possibleRoles.map((role) => (
                <option key={role} value={role} selected={user.role === role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </FormControl>
          </InputGroup>

          <Button type="submit">Save Changes</Button>
        </Form>
      </div>
    </>
  );
};

export default UserEditPage;
