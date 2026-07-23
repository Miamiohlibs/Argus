'use client';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import InputGroup, { InputGroupText } from '@/components/ui/InputGroup';
import { useState } from 'react';
import { User, UserAffiliation, UserStatus } from '@prisma/client';
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

export default function QuickSlipProjectInfo({
  currentUser,
}: {
  currentUser?: User | null;
}) {
  const [userStatus, setUserStatus] = useState<UserStatus | undefined>(
    undefined,
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
      <Input type="hidden" name="userName" value={currentUser?.name ?? ''} />
      <Input
        type="hidden"
        name="userAffiliation"
        value={currentUser?.affiliation ?? ''}
      />
      <Input
        type="hidden"
        name="userStatus"
        value={currentUser?.status ?? ''}
      />

      <InputGroup className="mb-4">
        <InputGroupText id="patron-label">Patron Name</InputGroupText>
        <Input
          placeholder="Patron Name"
          aria-labelledby="patron-label"
          name="patronName"
        />
      </InputGroup>

      <InputGroup className="mb-4">
        <InputGroupText id="status-label">Patron Status</InputGroupText>
        <Select
          aria-labelledby="status-label"
          name="patronStatus"
          onChange={handleChange('status')}
        >
          {statusPulldown.unshift(blankPullDownOption) && statusPulldown}
        </Select>
      </InputGroup>

      <InputGroup className="mb-4">
        <InputGroupText id="affil-label">Patron Affiliation</InputGroupText>
        <Select
          aria-labelledby="affil-label"
          name="patronAffiliation"
          onChange={handleChange('affiliation')}
        >
          {affiliationPulldown.unshift(blankPullDownOption) &&
            affiliationPulldown}
        </Select>
      </InputGroup>

      <InputGroup className="mb-4">
        <InputGroupText id="affil-label">Purpose</InputGroupText>
        <Select
          aria-labelledby="affil-label"
          name="purpose"
          onChange={handleChange('purpose')}
        >
          {purposeSelectOptions.unshift(blankPullDownOption) &&
            purposeSelectOptions}
        </Select>
      </InputGroup>
    </>
  );
}
