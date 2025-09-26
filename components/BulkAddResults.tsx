import { Alert } from 'react-bootstrap';
import { XCircle, CheckCircle } from 'react-bootstrap-icons';
interface BulkAddResponse {
  query: string;
  message: string;
  status: 'success' | 'error';
}
const BulkAddResults = ({
  entries,
  totalExpected,
}: {
  entries: BulkAddResponse[];
  totalExpected: number;
}) => {
  // set aria-busy to true if expecting results that haven't arrived yet
  const busyStatus =
    totalExpected == 0 || totalExpected == entries.length ? false : true;
  return (
    <div aria-busy={busyStatus}>
      <div>
        {entries.map((entry, index) => (
          <Alert
            key={index}
            variant={entry.status === 'success' ? 'success' : 'danger'}
          >
            {entry.status === 'success' ? (
              <CheckCircle className="ml-2" />
            ) : (
              <XCircle className="ml-2" />
            )}{' '}
            {entry.query} - {entry.message}
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default BulkAddResults;
