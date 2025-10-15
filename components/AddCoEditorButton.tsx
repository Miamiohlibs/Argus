'use client';
// import { Project } from '@prisma/client';
import { toast } from 'react-toastify';
// import { deleteProject } from '@/app/actions/projectActions';
import { Button } from 'react-bootstrap';
// import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { addCoEditor } from '@/app/actions/coEditors';

const AddCoEditorButton = ({
  userId,
  projectId,
  onAdded,
}: {
  userId: string;
  projectId: string; // Changed semicolon to comma
  onAdded?: () => void;
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const handleAddCoEditor = async (userId: string, projectId: string) => {
    const { success, error } = await addCoEditor(userId, projectId);
    if (error) {
      toast.error(error);
      return;
    }
    if (success) {
      toast.success('Added Co-Editor');
    } else {
      toast.error('Unable to add Co-Editor');
    }
    // router.refresh(); // Refresh the page to reflect changes
    // router.push(window.location.pathname);
    setIsAdded(true); // Hide the row
    onAdded?.(); // Call the optional callback if provided
  };
  return (
    <Button
      variant="outline-primary"
      size="sm"
      className="ms-1"
      onClick={() => handleAddCoEditor(userId, projectId)}
      disabled={isAdded} // Disable button if already deleted
      style={{ opacity: isAdded ? 0.5 : 1 }}
    >
      {isAdded ? 'Added CoEditor' : 'Add as Co-Editor'}
    </Button>
  );
};

export default AddCoEditorButton;
