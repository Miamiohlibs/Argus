'use client';
import { useState } from 'react';
import updateUser from '@/app/actions/updateUser';
import { toast } from 'react-toastify';

import {
  Form,
  FormLabel,
  FormSelect,
  Button,
  InputGroup,
} from 'react-bootstrap';

import { User } from '@/types/User';
import { revalidatePath } from 'next/cache';
export default function UserEditForm({ user }: { user: User }) {
  const [role, setRole] = useState(user.role);
  const possibleRoles = ['user', 'admin'];

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedUser = await updateUser(user.id, { role });
    if (updatedUser.error) {
      console.error('Error updating user:', updatedUser.error);
      return;
    }
    toast.success('User role updated successfully');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <FormLabel htmlFor="role">Role</FormLabel>
        <FormSelect id="role" value={role} onChange={handleChange}>
          {possibleRoles.map((r) => (
            <option key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </FormSelect>
      </InputGroup>
      <Button className="btn btn-primary" type="submit">
        Save Changes
      </Button>
    </Form>
  );
}
