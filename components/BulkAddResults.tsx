import { Alert } from 'react-bootstrap';
import { XCircle, CheckCircle } from 'react-bootstrap-icons';
interface BulkAddResponse {
  query: string;
  message: string;
  status: 'success' | 'error';
}
const BulkAddResults = ({ entries }: { entries: BulkAddResponse[] }) => {
  return (
    <div>
      <h3>Bulk Add Results</h3>
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
