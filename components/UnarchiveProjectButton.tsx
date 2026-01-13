'use client';
import { updateProjectStatus } from '@/app/actions/projectActions';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function UnarchiveProjectButton({
  projectId,
}: {
  projectId: number;
}) {
  const router = useRouter();
  const handleUnarchiveProject = async (projectId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to Unarchive this project?'
    );
    if (!confirmed) return;
    const { success, error } = await updateProjectStatus({
      projectId,
      status: '',
    });
    if (error) {
      toast.error(error);
      return;
    }

    router.refresh();
  };

  return (
    <Button
      onClick={() => handleUnarchiveProject(projectId)}
      size="sm"
      variant="outline-secondary"
    >
      Unarchive
    </Button>
  );
}
