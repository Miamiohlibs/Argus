'use client';
import { useState } from 'react';
import updateUser from '@/app/actions/updateUser';
import { toast } from 'react-toastify';
import { User, Role, UserAffiliation, UserStatus } from '@prisma/client';
import {
  Form,
  FormLabel,
  FormSelect,
  Button,
  InputGroup,
} from 'react-bootstrap';

// import { User } from '@/types/User';
// import { revalidatePath } from 'next/cache';

export default function UserEditForm({ user }: { user: User }) {
  const [role, setRole] = useState(user.role);
  const validRoles = Object.values(Role);
  // type Role = (typeof validRoles)[number];
  const [status, setStatus] = useState(user.status);
  const validStatuses = Object.values(UserStatus);
  const [affiliation, setAffiliation] = useState(user.affiliation);
  const validAffiliations = Object.values(UserAffiliation);
  // type Role = (typeof validRoles)[number];

  const handleChange =
    (targetField: 'role' | 'status' | 'affiliation') =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      // console.log(`changing target: ${targetField}, ${e.target.value}`);
      switch (targetField) {
        case 'role':
          setRole(e.target.value as Role);
          break;
        case 'affiliation':
          setAffiliation(e.target.value as UserAffiliation);
          break;
        case 'status':
          setStatus(e.target.value as UserStatus);
          break;
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = await updateUser(user.id, {
      role: role as Role,
      status: status as UserStatus,
      affiliation: affiliation as UserAffiliation,
    });
    if (updatedUser.error) {
      console.error('Error updating user:', updatedUser.error);
      return;
    }
    toast.success('User role updated successfully');
  };

  let statusPulldown = validStatuses.map((r) => (
    <option key={r} value={r}>
      {r.charAt(0).toUpperCase() + r.slice(1)}
    </option>
  ));
  let affiliationPulldown = validAffiliations.map((r) => (
    <option key={r} value={r}>
      {r.charAt(0).toUpperCase() + r.slice(1)}
    </option>
  ));
  let blankPullDownOption = (
    <option key="none" value="">
      None
    </option>
  );
  // statusPulldown.unshift(
  //   <option key="none" value="">
  //     None
  //   </option>
  // );
  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <FormLabel htmlFor="role">Role</FormLabel>
        <FormSelect
          id="role"
          value={role ?? ''}
          onChange={(e) => handleChange('role')(e)}
        >
          {validRoles.map((r) => (
            <option key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </FormSelect>
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="affiliation">Affiliation</FormLabel>
        <FormSelect
          id="affiliation"
          value={affiliation ?? ''}
          onChange={handleChange('affiliation')}
        >
          {affiliationPulldown.unshift(blankPullDownOption) &&
            affiliationPulldown}
        </FormSelect>
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="status">Status</FormLabel>
        <FormSelect
          id="status"
          value={status ?? ''}
          onChange={handleChange('status')}
        >
          {statusPulldown.unshift(blankPullDownOption) && statusPulldown}
        </FormSelect>
      </InputGroup>
      <Button className="btn btn-primary" type="submit">
        Save Changes
      </Button>
    </Form>
  );
}
