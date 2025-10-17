import { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import { Badge } from 'react-bootstrap';

const ProjectMetadata = ({
  project,
  hideTitle = false,
}: {
  project: ProjectWithUserAndBib;
  hideTitle?: boolean;
}) => {
  return (
    <>
      <div className="mb-3 text-muted small">
        {!hideTitle && <span className="fw-bold">{project?.title}</span>}
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
