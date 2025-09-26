'use client';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { LookupAndAddSingleEntry } from '@/app/actions/bulkAdd';
import { useState, useEffect } from 'react';
import BulkAddResults from './BulkAddResults';
import { useRef } from 'react';
interface BulkAddResponse {
  query: string;
  message: string;
  status: 'success' | 'error';
}

const BulkAddForm = ({ projectId }: { projectId: string }) => {
  const [results, setResults] = useState<BulkAddResponse[]>([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [finalNotice, setFinalNotice] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setResults([]);
    setTotalSubmissions(0);
    setFinalNotice(null);
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const allEntries = formData.get('entries')?.toString().split('\n') || [];
    const entries = allEntries.filter((item) => item.trim() !== '');
    setTotalSubmissions(entries.length);
    entries.forEach(async (entry) => {
      const { status, message } = await LookupAndAddSingleEntry(
        entry.trim(),
        projectId
      );

      setResults((prev) => [
        ...(prev || []),
        { query: entry, message, status },
      ]);
    });
  };

  useEffect(() => {
    if (totalSubmissions === 0) return;
    if (results.length < totalSubmissions) {
      return;
    }
    if (results.length == totalSubmissions && totalSubmissions > 0) {
      const totalSuccess = results.filter((r) => r.status === 'success').length;
      const totalErrors = results.filter((r) => r.status === 'error').length;
      setFinalNotice(
        `Total submissions: ${totalSubmissions}, Successful: ${totalSuccess}, Errors: ${totalErrors}`
      );
    }
  }, [results, totalSubmissions]);

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <>
      {totalSubmissions > 0 && finalNotice == null && (
        <Alert variant="info" className="mt-3">
          <Spinner animation="border" size="sm" className="me-2" />
          Submitting {totalSubmissions} entries...
        </Alert>
      )}
      <BulkAddResults entries={results} totalExpected={totalSubmissions} />

      {totalSubmissions > 0 && finalNotice !== null && (
        <Alert variant="info" className="mt-3">
          {finalNotice}
        </Alert>
      )}
      <Form onSubmit={handleSubmit} ref={formRef}>
        <Form.Label htmlFor="entries" className="mb-3">
          Enter entries (one per line). Add items by Call #, Barcode, Alma
          MMS_ID, or Alma Permalink Url.
        </Form.Label>
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
        <Button
          type="button"
          variant="outline-secondary"
          className="ms-2 mt-3"
          onClick={() => {
            // clear form contents
            formRef.current?.reset();
          }}
        >
          Clear Form
        </Button>
      </Form>
    </>
  );
};

export default BulkAddForm;
