import { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';

const ProjectMetadata = ({ project }: { project: ProjectWithUserAndBib }) => {
  return (
    <>
      <div className="mb-3 text-muted small">
        <span className="fw-bold">{project?.title}</span>
        <span className="badge bg-secondary ms-2">
          Owner: {project?.user.name}
        </span>
      </div>
    </>
  );
};

export default ProjectMetadata;
