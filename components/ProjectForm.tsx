'use client';
// import { useRef } from 'react';
import type { User } from '@prisma/client';
import { useActionState } from 'react';
import { Form, Button, Card, FormSelect, FormControl } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation'; // Changed from react-router-dom
import { Project } from '@prisma/client';
import { ProjectData } from '@/types/ProjectData';
import { getProjectPurposes, getSubjects } from '@/lib/utils';
import { Trash } from 'react-bootstrap-icons';

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
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [subjectArray, setSubjectArray] = useState<string[]>(
    project?.subjects ?? []
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
  const projectSubjects = getSubjects();

  const purposeSelectOptions = projectPurposes.map((item: string) => (
    <option key={item} value={item}>
      {item}
    </option>
  ));

  const projectSubjectOptions = projectSubjects.map((item: string) => (
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

  const blankSubjectPullDownOption = (
    <option key="none" value="None">
      Select a Subject to Add
    </option>
  );
  projectSubjectOptions.unshift(blankSubjectPullDownOption);

  const handlePurposeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // console.log(`Selected purpose: ${e.target.value}`);
    setSelectedPurpose(e.target.value);
  };

  const handlePublicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Selected public: ${e.target.checked}`);
    setSelectedPublic(e.target.checked);
  };
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // console.log(`Selected purpose: ${e.target.value}`);
    const newSubjectArray = subjectArray;
    setSelectedSubject(e.target.value);
    newSubjectArray.push(e.target.value);
    const uniqueArray = [...new Set(newSubjectArray)].sort();
    setSubjectArray(uniqueArray);
  };
  const handleRemoveSubject = (e: React.MouseEvent<HTMLButtonElement>) => {
    const subjectToRemove = e.currentTarget.value;
    // alert(e.currentTarget.value);
    const newSubjectArray = subjectArray.filter(
      (item) => item != subjectToRemove
    );
    setSubjectArray(newSubjectArray);
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
          <Form.Group className="mb-3">
            <Form.Label>Project Purpose *</Form.Label>
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
          </Form.Group>

          {subjectArray.length > 0 && (
            <div aria-live="assertive">
              <p className="mt-3">Selected Project Subjects</p>
              <ul>
                {subjectArray.map((item) => (
                  <li key={item}>
                    {item}{' '}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleRemoveSubject}
                      value={item}
                    >
                      <Trash
                        aria-label={
                          'Remove "' + item + '" from project subjects'
                        }
                      />
                    </Button>
                  </li>
                ))}
              </ul>
              <FormControl
                type="hidden"
                name="subjects"
                value={JSON.stringify(subjectArray)}
              />
            </div>
          )}
          <Form.Label>Add a Project Subject</Form.Label>
          <FormSelect
            id="subject"
            name="subject"
            // disabled={!editable}
            value={selectedSubject || ''}
            onChange={handleSubjectChange}
            required={true}
          >
            {projectSubjectOptions}
          </FormSelect>

          <Form.Group className="my-4" controlId="public-switch">
            <Form.Check
              type="switch"
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
