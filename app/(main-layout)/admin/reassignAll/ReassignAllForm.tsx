'use client';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { ReassignAllResult } from '@/app/actions/reassignAll';
import SelectUserFormElement from '@/components/SelectUserFormElement';
import { useActionState, startTransition, useEffect } from 'react';
import { User } from '@prisma/client';
import { toast } from 'react-toastify';

interface FormProps {
  users: User[];
  action: (
    prevState: ReassignAllResult | null,
    formData: FormData,
  ) => Promise<ReassignAllResult>;
}

export default function ReassignAllForm({ action, users }: FormProps) {
  const [state, formAction, isPending] = useActionState<
    ReassignAllResult | null,
    FormData
  >(action, null);

  useEffect(() => {
    if (!state) return;

    if (state.error) {
      toast.error(state.error || 'Unable to reassign ownership.');
    }

    if (state.success) {
      toast.success('Ownerships successfully reassigned.');
    }
  }, [state]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const oldUserData = formData.get('oldUser')?.toString();
    const newUserData = formData.get('newUser')?.toString();
    let oldUserId, oldUserName, newUserId, newUserName;
    let gotOldUser = false;
    let gotNewUser = false;
    if (oldUserData?.includes('&&&')) {
      let [oldUserTempId, oldUserTempName] = oldUserData.split('&&&');
      console.log(oldUserData.split('&&&'));
      oldUserId = oldUserTempId;
      oldUserName = oldUserTempName;
      formData.append('oldUserId', oldUserId);
      gotOldUser = true;
    }
    if (newUserData?.includes('&&&')) {
      const [newUserTempId, newUserTempName] = newUserData.split('&&&');
      newUserName = newUserTempName;
      newUserId = newUserTempId;
      formData.append('newUserId', newUserId);
      gotNewUser = true;
    }

    if (gotNewUser && gotOldUser) {
      if (
        window.confirm(
          `Are you sure you want to transfer all of ${oldUserName}'s projects to ${newUserName}?`,
        )
      ) {
        startTransition(() => {
          formAction(formData);
        });
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-3">
      <InputGroup className="bg-danger-subtle mb-3 p-1">
        <Form.Label className="d-flex align-items-center mx-2">
          Reassign From Owner
        </Form.Label>
        <SelectUserFormElement
          users={users}
          fieldName="oldUser"
          appendNameString={true}
        />
      </InputGroup>
      <InputGroup className="bg-success-subtle mb-3 p-1">
        <Form.Label className="d-flex align-items-center mx-2">
          New Projects Owner
        </Form.Label>
        <SelectUserFormElement
          users={users}
          fieldName="newUser"
          appendNameString={true}
        />
      </InputGroup>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Reassigning…' : 'Reassign All Projects'}
      </Button>
    </form>
  );
}
