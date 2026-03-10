'use client';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useActionState } from 'react';
import { ReassignAllResult } from '@/app/actions/reassignAll';
import SelectUserFormElement from '@/components/SelectUserFormElement';
import type { User } from '@prisma/client';

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

  return (
    <form action={formAction} className="mt-3">
      <InputGroup className="bg-danger-subtle mb-3 p-1">
        <Form.Label className="d-flex align-items-center mx-2">
          Reassign From Owner
        </Form.Label>
        <SelectUserFormElement users={users} fieldName="oldUser" />
      </InputGroup>
      <InputGroup className="bg-success-subtle mb-3 p-1">
        <Form.Label className="d-flex align-items-center mx-2">
          New Projects Owner
        </Form.Label>
        <SelectUserFormElement users={users} fieldName="newUser" />
      </InputGroup>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Reassigning…' : 'Reassign All Projects'}
      </Button>

      {state?.error && (
        <p role="alert" className="text-danger mt-2">
          {state.error}
        </p>
      )}
    </form>
  );
}
