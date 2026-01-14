'use client';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useActionState } from 'react';
import SelectUserFormElement from '@/components/SelectUserFormElement';
import type { UpdateProjectOwnerResult } from '@/app/actions/projectActions';
import type { User } from '@prisma/client';

interface FormProps {
  projectId: number;
  users: User[];
  actorId: string;
  action: (
    prevState: UpdateProjectOwnerResult | null,
    formData: FormData
  ) => Promise<UpdateProjectOwnerResult>;
}

export default function ReassignmentForm({
  projectId,
  action,
  users,
  actorId,
}: FormProps) {
  const [state, formAction, isPending] = useActionState<
    UpdateProjectOwnerResult | null,
    FormData
  >(action, null);

  return (
    <form action={formAction} className="mt-3">
      <Form.Control type="hidden" name="projectId" value={projectId} />
      <Form.Control type="hidden" name="thisUserId" value={actorId} />
      <InputGroup className="mb-3">
        <Form.Label className="d-flex align-items-center mx-2">
          New Project Owner
        </Form.Label>
        <SelectUserFormElement users={users} />
      </InputGroup>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Reassigning…' : 'Reassign Project'}
      </Button>

      {state?.error && (
        <p role="alert" className="text-danger mt-2">
          {state.error}
        </p>
      )}
    </form>
  );
}
