import { Alert } from 'react-bootstrap';
import { ExclamationTriangle } from 'react-bootstrap-icons';
const NonOwnerAlert = () => {
  return (
    <Alert variant="warning">
      <ExclamationTriangle /> You have admin edit permissions, but you are not
      the owner of this entry. With great power comes great responsibility!
    </Alert>
  );
};

export default NonOwnerAlert;
