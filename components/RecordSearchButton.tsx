import { Button } from 'react-bootstrap';
import Link from 'next/link';

interface RecordSearchButtonProps {
  projectId: string | number;
}

const RecordSearchButton = ({ projectId }: RecordSearchButtonProps) => {
  return (
    <Link
      href={`/searchBibs?projectId=${projectId.toString()}`}
      className="mb-3"
    >
      <Button variant="primary" size="sm">
        Add an Item
      </Button>
    </Link>
  );
};

export default RecordSearchButton;
