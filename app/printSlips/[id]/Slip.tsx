import { EntryWithItems } from '@/types/EntryWithItems';
import { Card, CardBody } from 'react-bootstrap';
import SlipItemsInfo from './SlipItemsInfo';

const Slip = ({ entry }: { entry: EntryWithItems }) => {
  console.log('Slip printing entry');
  return (
    <div className="mb-2">
      <Card>
        <CardBody>
          <p>Author: {entry.author}</p>
          <p>Title: {entry.itemTitle}</p>
          <p>Location: {entry.location}</p>
          <p>Call #: {entry.callNumber}</p>
          <p>Notes: {entry.notes}</p>
          <p>Volumes:</p>
          <ul>
            {entry.items &&
              entry.items?.map((item, index) => {
                return <SlipItemsInfo key={index} item={item} />;
              })}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};

export default Slip;
