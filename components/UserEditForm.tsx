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

// import { User } from '@/types/User';
import { User } from '@prisma/client';
// import { revalidatePath } from 'next/cache';
export default function UserEditForm({ user }: { user: User }) {
  const [role, setRole] = useState(user.role);
  const validRoles = ['user', 'admin', 'superadmin'] as const;
  type Role = (typeof validRoles)[number];

  // const isValidRole = (role: string): role is Role => {
  //   return validRoles.includes(role as Role);
  // };

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as Role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // if (isValidRole(role)) {
    e.preventDefault();
    const updatedUser = await updateUser(user.id, { role: role as Role });
    if (updatedUser.error) {
      console.error('Error updating user:', updatedUser.error);
      return;
    }
    toast.success('User role updated successfully');
    // } else {
    //   console.error('Invalid role: ', role)
    // }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <FormLabel htmlFor="role">Role</FormLabel>
        <FormSelect id="role" value={role} onChange={handleChange}>
          {validRoles.map((r) => (
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
