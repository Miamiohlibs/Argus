import Link from 'next/link';
import { Button } from 'react-bootstrap';

const CreateProjectButton = () => {
  return (
    <Link href="/createProject" className="mb-3 btn btn-primary">
      Create a New Project
    </Link>
  );
};

export default CreateProjectButton;
