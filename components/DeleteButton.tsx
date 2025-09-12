'use client';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
interface DeleteButtonProps {
  label: string;
  onDelete: () => Promise<void> | void;
}

export default function DeleteButton({ label, onDelete }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      await onDelete();
    } catch (err) {
      setError(`Failed to delete ${label}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={loading}
        className="custom-white-bg-outline"
        variant="outline-danger"
        size="sm"
      >
        {loading ? `Deleting...` : `Delete ${label}`}
      </Button>
      {error && <p className="">{error}</p>}
    </>
  );
}
