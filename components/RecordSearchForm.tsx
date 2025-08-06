'use client';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'; // Changed from react-router-dom

const RecordSearchForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter(); // Changed from useNavigate

  const handleSubmit = async (formData: FormData) => {
    let title = formData.get('mms-id');
    // const { data, error } = await addProject(formData);
    alert(title);
    // if (error) {
    //   toast.error('Project creation failed');
    //   router.push('/'); // Redirect to home on error
    // } else {
    //   toast.success('Project created successfully');
    //   router.push('/'); //
    //   formRef.current?.reset();
    // }
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
    </>
  );
};

export default RecordSearchForm;
