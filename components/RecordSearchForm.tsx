'use client';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'; // Changed from react-router-dom
import { bibById } from '@/app/actions/almaSearch';
import { useState } from 'react';

const RecordSearchForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter(); // Changed from useNavigate
  const [results, setresults] = useState<any>(null); // State to hold search results

  const handleSubmit = async (formData: FormData) => {
    let mms_id = formData.get('mms-id');
    const { data, error } = await bibById({ mms_id: mms_id?.toString() || '' });
    // console.log('Data from bibById:', data);
    if (error) {
      toast.error('Lookup failed');
      //   router.push('/'); // Redirect to home on error
    } else {
      // toast.success('Lookup successful');
      setresults(data); // Set the results state with the fetched data
      // Optionally, you can redirect or perform other actions with the results
      // router.push('/'); // Uncomment if you want to redirect after successful search
    }
  };

  return (
    <>
      <Form ref={formRef} action={handleSubmit}>
        <Form.Group controlId="mmsIdSearch">
          <InputGroup className="mb-3">
            <InputGroup.Text id="mms-id">MMS ID</InputGroup.Text>
            <Form.Control
              name="mms-id"
              placeholder="Enter MMS ID"
              aria-label="MMS ID"
              aria-describedby="mms-id"
            />
            <Button type="submit" variant="primary">
              Search
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>

      <div>
        {results ? (
          <>
            <ul>
              <li>MMS ID: {results.bib[0].mms_id}</li>
              <li>Title: {results.bib[0].title}</li>
              <li>Author: {results.bib[0].author}</li>
              <li>Publication Year: {results.bib[0].date_of_publication}</li>
            </ul>
            <pre>{JSON.stringify(results.bib, null, 2)}</pre>
          </>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </>
  );
};

export default RecordSearchForm;
