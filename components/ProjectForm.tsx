'use client';
// import { useRef } from 'react';
import type { User } from '@prisma/client';
import { useActionState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // Changed from react-router-dom
import { Project } from '@prisma/client';

type ProjectActionResult =
  | { success: true; data: unknown; error?: never }
  | { success: false; error: string; data?: never };

interface ProjectFormProps {
  user: User | null;
  project?: Project | null;
  action: (
    prevState: unknown,
    formData: FormData
  ) => Promise<ProjectActionResult>;

  // onSubmit: (formData: FormData) => Promise<void>;
  // submitButtonText?: string;
}

export default function ProjectForm({
  user,
  project = undefined,
  action,
}: ProjectFormProps) {
  const [state, formAction] = useActionState(action, null);

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
      }, 1500); // Give time for toast to show
    }
  }, [state, project]);

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

          <Form.Group className="mb-4" controlId="notes">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="notes"
              defaultValue={project?.notes || ''}
              placeholder="Enter project notes or description (optional)..."
              className="resize-none"
            />
          </Form.Group>

          <Form.Control type="hidden" name="userId" value={user?.clerkUserId} />

          {project && (
            <Form.Control type="hidden" name="projectId" value={project.id} />
          )}

          <div className="d-grid">
            <Button variant="primary" type="submit" size="lg">
              {project ? 'Update Project' : 'Create New Project'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
