import Link from 'next/link';

const CreateProjectButton = () => {
  return (
    <Link href="/createProject" className="btn btn-primary">
      Create a New Project
    </Link>
  );
};

export default CreateProjectButton;
