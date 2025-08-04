'use client';
import { useRef } from 'react';
// import addTransaction from '@/app/actions/addTransaction';
import { toast } from 'react-toastify';
import { User } from '@/types/User';

type AddPullListProps = {
  user: User;
};

export default function AddPullList({ user }: AddPullListProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const clientAction = async (formData: FormData) => {
    // // console.log(formData.get('text'), formData.get('amount'));
    // const { data, error } = await addTransaction(formData);
    // if (error) {
    //   toast.error(error);
    // } else {
    //   toast.success('List added');
    //   formRef.current?.reset();
    // }
  };

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
            value={user.name}
            disabled
          />
        </div>
        <div className="form-control">
          <label htmlFor="note">Notes</label>
          <br />
          <textarea id="note" name="note"></textarea>
        </div>
        <input type="hidden" name="userId" value={user.id} />

        <button className="btn">Create New List</button>
      </form>
    </>
  );
}

// export default AddPullList;
