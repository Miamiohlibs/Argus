import Alert from '@/components/ui/Alert';
import { ExclamationTriangle } from 'react-bootstrap-icons';
const NonOwnerAlert = () => {
  return (
    <Alert variant="warning">
      <ExclamationTriangle className="inline" /> You have admin edit
      permissions, but you are not the owner or co-editor of this project. With
      great power comes great responsibility!
    </Alert>
  );
};

export default NonOwnerAlert;
