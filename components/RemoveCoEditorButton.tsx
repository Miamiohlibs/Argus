'use client';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { removeCoEditor } from '@/app/actions/coEditors';

const RemoveCoEditorButton = ({
  userId,
  projectId,
  onRemoved,
}: {
  userId: string;
  projectId: string;
  onRemoved?: () => void;
}) => {
  const [isRemoved, setIsRemoved] = useState(false);
  const handleRemoveCoEditor = async (userId: string, projectId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to remove this co-editor?'
    );
    if (!confirmed) return;
    const { success, error } = await removeCoEditor(userId, projectId);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Co-editor successfully removed');
    setIsRemoved(true); // Hide the row
    onRemoved?.(); // Call the optional callback if provided
  };
  return (
    <Button
      variant="outline-danger"
      size="sm"
      className="ms-1"
      onClick={() => handleRemoveCoEditor(userId, projectId)}
      disabled={isRemoved} // Disable button if already Removed
      style={{ opacity: isRemoved ? 0.5 : 1 }}
    >
      {isRemoved ? 'Removed' : 'Remove'}
    </Button>
  );
};

export default RemoveCoEditorButton;
