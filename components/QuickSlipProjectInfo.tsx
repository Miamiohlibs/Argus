'use client';
import { Form, FormControl, FormLabel, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { UserAffiliation, UserStatus } from '@prisma/client';
import { getProjectPurposes } from '@/lib/utils';
import {
  validStatuses,
  validAffiliations,
  //   statusOptions,
  //   blankPullDownOption,
  //   affiliationOptions,
} from '@/lib/pulldowns';

// Note - Ken: the pulldown menus here (userStatus, userAffiliation, etc) recycle code from UserEditForm;
// we tried to move those functions to something reusable but failed. Try again?
// also, some of this relies on hard-coding type that may vary with different institutions
// what can we do to make these more flexible? It doesn't look like we can devise types on the fly
// like in a .env

export default function QuickSlipProjectInfo() {
  const [userStatus, setUserStatus] = useState<UserStatus | undefined>(
    undefined
  );
  const [userAffiliation, setUserAffiliation] = useState<
    UserAffiliation | undefined
  >(undefined);
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');

  const handleChange =
    (targetField: 'status' | 'affiliation' | 'purpose') =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      // console.log(`changing target: ${targetField}, ${e.target.value}`);
      switch (targetField) {
        case 'affiliation':
          setUserAffiliation(e.target.value as UserAffiliation);
          break;
        case 'status':
          setUserStatus(e.target.value as UserStatus);
          break;
        case 'purpose':
          setSelectedPurpose(e.target.value);
          break;
      }
    };

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

  const projectPurposes = getProjectPurposes();

  const purposeSelectOptions = projectPurposes.map((item: string) => (
    <option key={item} value={item}>
      {item}
    </option>
  ));

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
          onChange={handleChange('status')}
        >
          {statusPulldown.unshift(blankPullDownOption) && statusPulldown}
        </Form.Select>
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text id="affil-label">User Affiliation</InputGroup.Text>
        <Form.Select
          aria-labelledby="affil-label"
          name="userAffiliation"
          onChange={handleChange('affiliation')}
        >
          {affiliationPulldown.unshift(blankPullDownOption) &&
            affiliationPulldown}
        </Form.Select>
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text id="affil-label">Purpose</InputGroup.Text>
        <Form.Select
          aria-labelledby="affil-label"
          name="purpose"
          onChange={handleChange('purpose')}
        >
          {purposeSelectOptions.unshift(blankPullDownOption) &&
            purposeSelectOptions}
        </Form.Select>
      </InputGroup>
    </>
  );
}
