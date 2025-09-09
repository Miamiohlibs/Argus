'use client';
import { Button } from 'react-bootstrap';
import { duplicateProject } from '@/app/actions/projectActions';
import { toast } from 'react-toastify';

const DuplicateProjectButton = ({ id }: { id: string }) => {
  const duplicateProjectHandler = async (projectId: string) => {
    const result = await duplicateProject(projectId);
    console.log(result);
    if (result.success) {
      toast.success('Project duplicated successfully!');
    } else {
      toast.error('Failed to duplicate project: ' + result.error);
    }
  };

  return (
    <Button
      variant="outline-secondary"
      size="sm"
      className={'me-2'}
      onClick={() => duplicateProjectHandler(id)}
    >
      Duplicate Project
    </Button>
  );
};

export default DuplicateProjectButton;
