'use client';
import { Button } from 'react-bootstrap';
import { duplicateProject } from '@/app/actions/projectActions';

const DuplicateProjectButton = ({ id }: { id: string }) => {
  const duplicateProjectHandler = async (projectId: string) => {
    const result = await duplicateProject(projectId);
    console.log(result);
    // if (result.success) {
    //     // Handle successful duplication (e.g., show a success message)
    // } else {
    //     // Handle error (e.g., show an error message)
    // }
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
