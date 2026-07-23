'use client';
// import { useRef } from 'react';
import type { User } from '@prisma/client';
import { useActionState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Label from '@/components/ui/Label';
import Checkbox from '@/components/ui/Checkbox';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation'; // Changed from react-router-dom
import { Project } from '@prisma/client';
import { getProjectPurposes, getSubjects } from '@/lib/utils';
import { UserAffiliation, UserStatus } from '@prisma/client';

type ProjectActionResult =
  | { success: true; data: Project; error?: never }
  | { success: false; error: string; data?: never };

interface ProjectFormProps {
  user: User | null;
  project?: Project | null;
  basePath: string | null;
  isAdmin: boolean;
  action: (
    prevState: unknown,
    formData: FormData,
  ) => Promise<ProjectActionResult>;

  // onSubmit: (formData: FormData) => Promise<void>;
  // submitButtonText?: string;
}

export default function ProjectForm({
  user,
  project = undefined,
  action,
  basePath,
  isAdmin,
}: ProjectFormProps) {
  const [state, formAction] = useActionState(action, null);
  const [selectedPurpose, setSelectedPurpose] = useState<string>(
    project?.purpose ?? '',
  );
  const [selectedPublic, setSelectedPublic] = useState<boolean>(
    project?.public ?? false,
  );
  const [selectedSubject, setSelectedSubject] = useState<string>(
    project?.subjects[0] ?? 'None',
  );
  const [selectedPatronAffiliation, setSelectedPatronAffiliation] = useState(
    project?.patronAffiliation ?? null,
  );
  const [selectedPatronStatus, setSelectedPatronStatus] = useState(
    project?.patronStatus ?? null,
  );

  const resolvedBasePath = basePath ?? '/';

  // Handle notifications
  useEffect(() => {
    if (state?.error) {
      toast.error(
        project ? 'Project update failed' : 'Project creation failed',
      );
    } else if (state?.data) {
      toast.success(
        project
          ? 'Project updated successfully'
          : 'Project created successfully',
      );
      // Client-side redirect after showing toast
      setTimeout(() => {
        window.location.href = `${resolvedBasePath}/project/${state.data?.id}`;
      }, 500); // Give time for toast to show
    }
  }, [state, project, resolvedBasePath]);

  const projectPurposes = getProjectPurposes();
  const projectSubjects = getSubjects();
  const patronAffiliations = Object.values(UserAffiliation);
  const patronStatuses = Object.values(UserStatus);

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
  const patronAffiliationOptions = patronAffiliations.map((item: string) => (
    <option key={item} value={item}>
      {item}
    </option>
  ));
  const patronStatusOptions = patronStatuses.map((item: string) => (
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
      No Subject Selected
    </option>
  );
  projectSubjectOptions.unshift(blankSubjectPullDownOption);

  const blankAffliationOption = (
    <option key="none" value="">
      No Patron Affliation Selected
    </option>
  );
  patronAffiliationOptions.unshift(blankAffliationOption);

  const blankPatronStatusOption = (
    <option key="none" value="">
      No Patron Status Selected
    </option>
  );
  patronStatusOptions.unshift(blankPatronStatusOption);

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
    setSelectedSubject(e.target.value);
  };
  const handlePatronAffiliationChange = (
    e: React.ChangeEvent<HTMLSelectElement | null>,
  ) => {
    if (patronAffiliations.includes(e.target.value as UserAffiliation)) {
      setSelectedPatronAffiliation(e.target.value as UserAffiliation);
    }
  };
  const handlePatronStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement | null>,
  ) => {
    if (patronStatuses.includes(e.target.value as UserStatus)) {
      setSelectedPatronStatus(e.target.value as UserStatus);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Card.Title className="mb-0">
          {project == undefined ? 'Add Project' : 'Project Details'}
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <form action={formAction}>
          <div className="mb-4">
            <Label>Title *</Label>
            <Input
              type="text"
              name="title"
              defaultValue={project?.title || ''}
              placeholder="Enter project title..."
              required
              className="py-2 text-lg"
            />
          </div>
          <div className="mb-4">
            <Label>Project Purpose *</Label>
            <Select
              id="purpose"
              name="purpose"
              // disabled={!editable}
              value={selectedPurpose}
              onChange={handlePurposeChange}
              required={true}
            >
              {purposeSelectOptions}
            </Select>
          </div>
          <Label>Project Subject</Label>
          <Select
            id="subjects"
            name="subjects"
            // disabled={!editable}
            value={selectedSubject || ''}
            onChange={handleSubjectChange}
            required={true}
          >
            {projectSubjectOptions}
          </Select>
          <div className="my-6">
            <Checkbox
              switch
              id="public-switch"
              name="public"
              label="Make this project public"
              defaultChecked={project?.public}
              onChange={handlePublicChange}
            />
          </div>
          {/* only allow admins to create project on behalf of a patron */}
          {isAdmin && (
            <Card className="mb-5">
              <Card.Header className="bg-green-100">
                Patron Info (only if creating project for a non-Argus user)
              </Card.Header>
              <Card.Body className="bg-green-50">
                <div className="mb-4">
                  <Label>Patron Name</Label>
                  <Input
                    type="text"
                    name="patronName"
                    defaultValue={project?.patronName || ''}
                    placeholder="Enter patron name..."
                    required
                    className="py-2"
                  />
                </div>
                <div className="mb-4">
                  <Label>Patron Affiliation</Label>
                  <Select
                    id="patronAffiliation"
                    name="patronAffiliation"
                    // disabled={!editable}
                    value={selectedPatronAffiliation ?? ''}
                    onChange={handlePatronAffiliationChange}
                    required={true}
                  >
                    {patronAffiliationOptions}
                  </Select>
                </div>
                <div className="mb-4">
                  <Label>Patron Status</Label>
                  <Select
                    id="patronStatus"
                    name="patronStatus"
                    // disabled={!editable}
                    value={selectedPatronStatus ?? ''}
                    onChange={handlePatronStatusChange}
                    required={true}
                  >
                    {patronStatusOptions}
                  </Select>
                </div>
              </Card.Body>
            </Card>
          )}
          <div className="mb-6">
            <Label>Notes</Label>
            <Input
              as="textarea"
              rows={4}
              name="notes"
              defaultValue={project?.notes || ''}
              placeholder="Enter project notes or description (optional)..."
              className="resize-none"
            />
          </div>
          <input type="hidden" name="userId" value={user?.clerkUserId} />
          {project && (
            <input type="hidden" name="projectId" value={project.id} />
          )}
          <div className="grid">
            <Button
              variant="primary"
              type="submit"
              size="lg"
              className="w-full"
            >
              {project ? 'Update Project' : 'Create New Project'}
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
}
