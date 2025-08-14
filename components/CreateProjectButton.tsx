import Link from 'next/link';
import { Button } from 'react-bootstrap';

const CreateProjectButton = () => {
  return (
    <Link href="/createProject" className="mb-3">
      <Button variant="primary">Create a New Project</Button>
    </Link>
  );
};

export default CreateProjectButton;
