'use client';
// import { useRef } from 'react';
import type { User } from '@prisma/client';
import { useActionState } from 'react';
import { Form, Button, Card, FormSelect } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation'; // Changed from react-router-dom
import { Project } from '@prisma/client';
import { ProjectData } from '@/types/ProjectData';
import { getProjectPurposes } from '@/lib/utils';
import { getProject } from '@/app/actions/projectActions';

type ProjectActionResult =
  | { success: true; data: ProjectData; error?: never }
  | { success: false; error: string; data?: never };

interface ProjectFormProps {
  user: User | null;
  project?: Project | null;
  basePath: string | null;
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
  basePath,
}: ProjectFormProps) {
  const [state, formAction] = useActionState(action, null);
  const [selectedPurpose, setSelectedPurpose] = useState<string>(
    project?.purpose ?? ''
  );
  const [selectedPublic, setSelectedPublic] = useState<boolean>(
    project?.public ?? false
  );

  if (basePath === null) {
    basePath = '/';
  }

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
        window.location.href = `${basePath}/project/${state.data?.id}`;
      }, 500); // Give time for toast to show
    }
  }, [state, project, basePath]);

  const projectPurposes = getProjectPurposes();

  const purposeSelectOptions = projectPurposes.map((item: string) => (
    <option key={item} value={item}>
      {item}
    </option>
  ));

  const blankPullDownOption = (
    <option key="none" value="">
      --- Please select a project purpose ---
    </option>
  );
  purposeSelectOptions.unshift(blankPullDownOption);

  const handlePurposeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // console.log(`Selected purpose: ${e.target.value}`);
    setSelectedPurpose(e.target.value);
  };

  const handlePublicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Selected public: ${e.target.checked}`);
    setSelectedPublic(e.target.checked);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Card.Title className="mb-0">
          {project == undefined ? 'Add Project' : 'Project Details'}
        </Card.Title>
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

          <Form.Label>Project Purpose</Form.Label>
          <FormSelect
            id="purpose"
            name="purpose"
            // disabled={!editable}
            value={selectedPurpose}
            onChange={handlePurposeChange}
            required={true}
          >
            {purposeSelectOptions}
          </FormSelect>

          <Form.Group className="my-4" controlId="public-switch">
            <Form.Check
              type="checkbox"
              id="public-switch"
              name="public"
              label="Make this project public"
              defaultChecked={project?.public}
              onChange={handlePublicChange}
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
