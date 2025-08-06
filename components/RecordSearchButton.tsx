import { Button } from 'react-bootstrap';
import Link from 'next/link';

const RecordSearchButton = () => {
  return (
    <Link href="/searchBibs" className="mb-3">
      <Button variant="primary" size="sm">
        Add an Item
      </Button>
    </Link>
  );
};

export default RecordSearchButton;
