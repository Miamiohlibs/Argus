'use client';
// import { useRef } from 'react';
import type { User } from '@prisma/client';
import { useActionState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // Changed from react-router-dom
import { Project } from '@prisma/client';

interface ProjectFormProps {
  user: User | null;
  project?: Project;
  action: (prevState: any, formData: FormData) => Promise<any>;
  // onSubmit: (formData: FormData) => Promise<void>;
  submitButtonText?: string;
}

export default function ProjectForm({
  user,
  project = undefined,
  action,
  submitButtonText = project ? 'Update Project' : 'Create Project',
}: ProjectFormProps) {
  const [state, formAction] = useActionState(action, {
    data: null,
    error: null,
  });

  // Handle notifications
  useEffect(() => {
    if (state?.error) {
      toast.error(
        project ? 'Project update failed' : 'Project creation failed'
      );
    } else if (state?.data) {
      toast.success(
        project
          ? 'Project updated successfully'
          : 'Project created successfully'
      );
      // Client-side redirect after showing toast
      setTimeout(() => {
        window.location.href = '/';
      }, 2000); // Give time for toast to show
    }
  }, [state]);

  // if (user === null) {
  //   return (
  //     <Alert variant="warning">Unable to load form due to missing user</Alert>
  //   );
  // }

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Card.Title className="mb-0">Add Project</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form action={formAction}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              defaultValue={project?.title || ''}
              placeholder="Enter project title..."
              required
              size="lg"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="note">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="note"
              defaultValue={project?.notes || ''}
              placeholder="Enter project notes or description (optional)..."
              className="resize-none"
            />
          </Form.Group>

          <Form.Control type="hidden" name="userId" value={user?.clerkUserId} />

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
