'use client';
import { ReassignAllResult } from '@/app/actions/reassignAll';
import ReassignAllForm from './ReassignAllForm';
import { User } from '@prisma/client';

export interface FormProps {
  users: User[];
  action: (
    prevState: ReassignAllResult | null,
    formData: FormData,
  ) => Promise<ReassignAllResult>;
}

export default function ClientWrapper({ action, users }: FormProps) {
  const clickHandler: Promise<ReassignAllResult> = async (
    prevState,
    formData,
  ) => {
    const response = await action(prevState, formData);
  };
  return (
    <>
      <h1>Reassign All Projects of User</h1>
      <ReassignAllForm action={clickHandler} users={users} />
    </>
  );
}
