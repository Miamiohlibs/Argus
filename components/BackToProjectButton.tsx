import Link from 'next/link';
import { Button } from 'react-bootstrap';

const BackToProjectButton = ({ projectId }: { projectId: number }) => {
  return (
    <Link href={`/project/${projectId}`}>
      <Button variant="outline-secondary" className="mb-3">
        Back to Project
      </Button>
    </Link>
  );
};

export default BackToProjectButton;
