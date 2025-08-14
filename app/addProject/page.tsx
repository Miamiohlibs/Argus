import ProjectForm from '@/components/ProjectForm';
import { checkUser } from '@/lib/checkUser';
// import { User } from '@/types/User';
// import type { User } from '@prisma/client';
import { toast } from 'react-toastify';
import addProject from '@/app/actions/addProject';

export default async function AddProjectPage() {
  const currentUser = await checkUser();
  // const currentUser: User | null = await checkUser();

  const handleSubmit = async (formData: FormData) => {
    // let title = formData.get('title');
    const { data, error } = await addProject(formData);
    if (error) {
      toast.error('Project creation failed');
      // router.push('/'); // Redirect to home on error
    } else {
      toast.success('Project created successfully');
      console.log(data);
      // router.push('/'); //
      // formRef.current?.reset();
    }
  };

  console.log(currentUser);
  return (
    <>
      <ProjectForm user={currentUser} onSubmit={handleSubmit} />
    </>
  );
}
