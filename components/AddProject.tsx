'use client';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import type { User } from '@prisma/client';
import addProject from '@/app/actions/addProject';
import { Form, Button, Card, Alert } from 'react-bootstrap';

type AddProjectProps = {
  user: User | null;
};

export default function AddProject({ user }: AddProjectProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const clientAction = async (formData: FormData) => {
    let title = formData.get('title');
    const { data, error } = await addProject(formData);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Project added');
      formRef.current?.reset();
    }
  };

  if (user === null) {
    return (
      <Alert variant="warning">Unable to load form due to missing user</Alert>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Card.Title className="mb-0">Add Project</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form ref={formRef} action={clientAction}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="Enter project title..."
              required
              size="lg"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="ownerName">
            <Form.Label>Owner</Form.Label>
            <Form.Control
              type="text"
              name="ownerName"
              value={user?.name || 'Unknown user'}
              disabled
              readOnly
              className="bg-light"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="note">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="note"
              placeholder="Enter project notes or description (optional)..."
              className="resize-none"
            />
          </Form.Group>

          <Form.Control type="hidden" name="userId" value={user.clerkUserId} />

          <div className="d-grid">
            <Button variant="primary" type="submit" size="lg">
              Create New Project
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
