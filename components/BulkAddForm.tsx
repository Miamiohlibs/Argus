'use client';
import { Form, Button } from 'react-bootstrap';
import bulkAddEntries from '@/app/actions/bulkAdd';

const BulkAddForm = ({ projectId }: { projectId: string }) => {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    console.log('Form submitted with data:', formData.get('entries'));

    const entries = formData.get('entries')?.toString().split('\n') || [];
    console.log('Entries:', entries);
    console.log('Project ID:', projectId);

    const response = await bulkAddEntries(entries, projectId);
    console.log('Bulk add response:', response);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Label>Enter entries (one per line):</Form.Label>
      <Form.Control
        as="textarea"
        id="entries"
        name="entries"
        className="form-control"
        rows={10}
        style={{ width: '80ch' }}
        placeholder="Enter your entries here, one per line."
      />

      <Button type="submit" className="btn btn-primary mt-3">
        Submit
      </Button>
    </Form>
  );
};

export default BulkAddForm;
