import { Alert, AlertHeading } from 'react-bootstrap';
const NonOwnerAlert = () => {
  return (
    <Alert variant="warning">
      <AlertHeading>Warning!</AlertHeading>
      You have admin edit permissions, but you are not the owner of this entry.
    </Alert>
  );
};

export default NonOwnerAlert;
