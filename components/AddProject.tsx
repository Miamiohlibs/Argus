'use client';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import type { User } from '@prisma/client';
import addProject from '@/app/actions/addProject';

type AddProjectProps = {
  user: User | null;
};

export default function AddProject({ user }: AddProjectProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const clientAction = async (formData: FormData) => {
    let title = formData.get('title');
    const { data, error } = await addProject(formData);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Project added');
      formRef.current?.reset();
    }
  };

  if (user === null) {
    return <>Unable to load form due to missing user</>;
  }
  return (
    <>
      <h3>Add List</h3>
      <form ref={formRef} action={clientAction}>
        <div className="form-control">
          <label htmlFor="text">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter title..."
          />
        </div>
        <div className="form-control">
          <label htmlFor="ownerName">Owner</label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={user?.name || 'Unknown user'}
            disabled
          />
        </div>
        <div className="form-control">
          <label htmlFor="note">Notes</label>
          <br />
          <textarea id="note" name="note"></textarea>
        </div>
        <input type="hidden" name="userId" value={user.clerkUserId} />

        <button className="btn">Create New List</button>
      </form>
    </>
  );
}
