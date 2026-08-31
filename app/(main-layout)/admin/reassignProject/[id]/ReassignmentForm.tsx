'use client';
import InputGroup from '@/components/ui/InputGroup';
import Label from '@/components/ui/Label';
import Button from '@/components/ui/Button';
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
    formData: FormData,
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
    <form action={formAction} className="mt-4">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="thisUserId" value={actorId} />
      <InputGroup className="mb-4">
        <Label className="mx-2 flex items-center">New Project Owner</Label>
        <SelectUserFormElement users={users} fieldName="newOwnerId" />
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
