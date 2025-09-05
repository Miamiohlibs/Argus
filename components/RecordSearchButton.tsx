import { Button } from 'react-bootstrap';
import Link from 'next/link';

interface RecordSearchButtonProps {
  projectId: string | number;
  className?: string;
}

const RecordSearchButton = ({
  projectId,
  className,
}: RecordSearchButtonProps) => {
  return (
    <>
      <Link
        href={`/searchBibs?projectId=${projectId.toString()}`}
        className={className}
      >
        <Button variant="primary" size="sm">
          Add Alma Item
        </Button>
      </Link>
      <Link
        href={`/customEntry/${projectId.toString()}/new`}
        className={className}
      >
        <Button variant="primary" size="sm">
          Add Custom Item
        </Button>
      </Link>
    </>
  );
};

export default RecordSearchButton;
