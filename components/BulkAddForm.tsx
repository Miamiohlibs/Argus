'use client';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';
import { LookupAndAddSingleEntry } from '@/app/actions/bulkAdd';
import { useState, useMemo } from 'react';
import BulkAddResults from './BulkAddResults';
import { useRef } from 'react';
interface BulkAddResponse {
  query: string;
  message: string;
  status: 'success' | 'error';
}

const BulkAddForm = ({
  projectId,
  currentUserName,
  nonOwnerEditor,
}: {
  projectId: string;
  currentUserName: string;
  nonOwnerEditor: boolean;
}) => {
  const [results, setResults] = useState<BulkAddResponse[]>([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setResults([]);
    setTotalSubmissions(0);
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const allEntries = formData.get('entries')?.toString().split('\n') || [];
    const entries = allEntries.filter((item) => item.trim() !== '');
    setTotalSubmissions(entries.length);
    entries.forEach(async (entry) => {
      const { status, message } = await LookupAndAddSingleEntry(
        entry.trim(),
        projectId,
        currentUserName,
        nonOwnerEditor,
      );

      setResults((prev) => [
        ...(prev || []),
        { query: entry, message, status },
      ]);
    });
  };

  const finalNotice = useMemo(() => {
    if (totalSubmissions === 0 || results.length < totalSubmissions) {
      return null;
    }
    const totalSuccess = results.filter((r) => r.status === 'success').length;
    const totalErrors = results.filter((r) => r.status === 'error').length;
    return `Total submissions: ${totalSubmissions}, Successful: ${totalSuccess}, Errors: ${totalErrors}`;
  }, [results, totalSubmissions]);

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <>
      {totalSubmissions > 0 && finalNotice == null && (
        <Alert variant="info" className="mt-4">
          <Spinner size="sm" className="me-2" />
          Submitting {totalSubmissions} entries...
        </Alert>
      )}
      <BulkAddResults entries={results} totalExpected={totalSubmissions} />

      {totalSubmissions > 0 && finalNotice !== null && (
        <Alert variant="info" className="mt-4">
          {finalNotice}
        </Alert>
      )}
      <form onSubmit={handleSubmit} ref={formRef}>
        <Label htmlFor="entries" className="mb-4">
          Enter entries (one per line). Add items by Call #, Barcode, Alma
          MMS_ID, or Alma Permalink Url.
        </Label>
        <Input
          as="textarea"
          id="entries"
          name="entries"
          rows={10}
          style={{ width: '80ch' }}
          placeholder="Enter your entries here, one per line."
        />

        <Button type="submit" className="mt-4">
          Submit
        </Button>
        <Button
          type="button"
          variant="outline-secondary"
          className="ms-2 mt-4"
          onClick={() => {
            // clear form contents
            formRef.current?.reset();
          }}
        >
          Clear Form
        </Button>
      </form>
    </>
  );
};

export default BulkAddForm;
