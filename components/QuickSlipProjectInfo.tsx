'use client';
import { Form, FormControl, FormLabel, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { UserStatus } from '@prisma/client';
import { isAllowedUserStatus } from '@/lib/typeChecker';

export default function QuickSlipProjectInfo() {
  const [userStatus, setUserStatus] = useState<UserStatus | undefined>(
    undefined
  );

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    isAllowedUserStatus(e.target.value) && setUserStatus(e.target.value);
  };

  const validStatuses = Object.values(UserStatus);
  const statusPulldown = validStatuses.map((r) => (
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
    <>
      <InputGroup className="mb-3">
        <InputGroup.Text id="patron-label">Patron Name</InputGroup.Text>
        <FormControl
          placeholder="Patron Name"
          aria-labelledby="patron-label"
          name="userName"
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text id="status-label">User Status</InputGroup.Text>
        <Form.Select
          aria-labelledby="status-label"
          name="userStatus"
          onChange={handleChange}
        >
          {statusPulldown.unshift(blankPullDownOption) && statusPulldown}
        </Form.Select>
      </InputGroup>
    </>
  );
}
