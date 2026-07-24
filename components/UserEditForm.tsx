'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import updateUser from '@/app/actions/updateUser';
import { toast } from 'react-toastify';
import { User, Role, UserStatus } from '@prisma/client';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Label from '@/components/ui/Label';
import Button from '@/components/ui/Button';
import { getUserAffiliations } from '@/lib/utils';

interface pageProps {
  user: User;
  actorIsSuperAdmin: boolean;
}
export default function UserEditForm({ user, actorIsSuperAdmin }: pageProps) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const validRoles = Object.values(Role);
  // type Role = (typeof validRoles)[number];
  const [status, setStatus] = useState(user.status);
  const validStatuses = Object.values(UserStatus);
  const [affiliation, setAffiliation] = useState(user.affiliation);
  const validAffiliations = getUserAffiliations();
  const [printSlips, setPrintSlips] = useState(user.printSlips);
  // type Role = (typeof validRoles)[number];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChange =
    (targetField: 'role' | 'status' | 'affiliation' | 'printSlips') =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      // console.log(`changing target: ${targetField}, ${e.target.value}`);
      switch (targetField) {
        case 'role':
          setRole(e.target.value as Role);
          ['admin', 'superadmin'].includes(e.target.value) &&
            setPrintSlips(true);
          break;
        case 'affiliation':
          setAffiliation(e.target.value);
          break;
        case 'status':
          setStatus(e.target.value as UserStatus);
          break;
        case 'printSlips':
          setPrintSlips((e.target.value.toLowerCase() === 'true') as boolean);
          break;
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = await updateUser(user.id, {
      name: name,
      role: role as Role,
      status: status as UserStatus,
      affiliation: affiliation,
      printSlips: (printSlips ||
        role == 'admin' ||
        role == 'superadmin') as boolean,
    });
    if (updatedUser.error) {
      console.error('Error updating user:', updatedUser.error);
      return;
    }
    toast.success('User updated successfully');
  };

  const roleDescriptions = [
    {
      role: 'user',
      description: 'Very limited permissions; can only view public projects.',
    },
    {
      role: 'editor',
      description:
        'Most typical role; can create own projects and contribute as a co-editor.',
    },
    {
      role: 'admin',
      description: "Can create/edit users, and can edit other user's projects.",
    },
    {
      role: 'superadmin',
      description: 'Rare. Can only be edited or removed by another superadmin.',
    },
  ];

  const statusPulldown = validStatuses.map((r) => (
    <option key={r} value={r}>
      {r.charAt(0).toUpperCase() + r.slice(1)}
    </option>
  ));
  const affiliationPulldown = validAffiliations.map((r) => (
    <option key={r} value={r}>
      {r.charAt(0).toUpperCase() + r.slice(1)}
    </option>
  ));
  const blankPullDownOption = (
    <option key="none" value="">
      None
    </option>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2 flex items-center">
        <Label htmlFor="name" className="me-2">
          Name
        </Label>
        <Input
          type="text"
          id="name"
          defaultValue={name}
          onChange={(e) =>
            handleNameChange(e as React.ChangeEvent<HTMLInputElement>)
          }
        />
      </div>
      <div className="mb-2 flex items-center">
        <Label htmlFor="role" className="me-2">
          Role
        </Label>
        <Select
          id="role"
          value={role ?? ''}
          onChange={(e) => handleChange('role')(e)}
        >
          {validRoles.map((r) => {
            const description = roleDescriptions.find((roleArray) => {
              return roleArray.role === r;
            })?.description;
            return (
              (actorIsSuperAdmin || r != 'superadmin') && (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)} &nbsp;&nbsp;&nbsp;(
                  {description})
                </option>
              )
            );
          })}
        </Select>
      </div>
      <div className="mb-2 flex items-center">
        <Label htmlFor="affiliation" className="me-2">
          Affiliation
        </Label>
        <Select
          id="affiliation"
          value={affiliation ?? ''}
          onChange={handleChange('affiliation')}
        >
          {affiliationPulldown.unshift(blankPullDownOption) &&
            affiliationPulldown}
        </Select>
      </div>
      <div className="mb-2 flex items-center">
        <Label htmlFor="status" className="me-2">
          Status
        </Label>
        <Select
          id="status"
          value={status ?? ''}
          onChange={handleChange('status')}
        >
          {statusPulldown.unshift(blankPullDownOption) && statusPulldown}
        </Select>
      </div>
      <div className="mb-2 flex items-center">
        <Label htmlFor="printSlips" className="me-2">
          Print Slips permissions
        </Label>
        <Select
          id="printSlips"
          value={printSlips.toString() ?? 'false'}
          onChange={handleChange('printSlips')}
        >
          <option value="false">False</option>
          <option value="true">True</option>
        </Select>
      </div>
      <Button className="mt-6" type="submit">
        Save Changes
      </Button>
    </form>
  );
}
