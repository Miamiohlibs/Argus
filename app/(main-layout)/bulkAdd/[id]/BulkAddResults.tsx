import Card, { CardBody } from '@/components/ui/Card';
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
    <div aria-busy={busyStatus} aria-live="polite">
      <div>
        {entries.map((entry, index) => (
          <Card
            key={index}
            aria-atomic={true}
            className="w-full mb-2"
            style={{
              backgroundColor:
                entry.status === 'success'
                  ? 'rgba(25, 135, 84, 0.2)'
                  : 'rgba(220, 53, 69, 0.2)',
            }}
          >
            <CardBody>
              {entry.status === 'success' ? (
                <CheckCircle className="ml-2 inline" aria-hidden="true" />
              ) : (
                <XCircle className="ml-2 inline" aria-hidden="true" />
              )}{' '}
              {entry.query} - {entry.message}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BulkAddResults;
