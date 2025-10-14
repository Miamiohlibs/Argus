import { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import { Badge } from 'react-bootstrap';

const ProjectMetadata = ({ project }: { project: ProjectWithUserAndBib }) => {
  return (
    <>
      <div className="mb-3 text-muted small">
        <span className="fw-bold">{project?.title}</span>
        <Badge bg="secondary" className="ms-2">
          Owner: {project?.user.name}
        </Badge>
        {project.coEditors &&
          project.coEditors.map((ed) => (
            <Badge bg="light" className="ms-2 text-dark" key={ed.id}>
              Co-Editor: {ed.name}
            </Badge>
          ))}
      </div>
    </>
  );
};

export default ProjectMetadata;
