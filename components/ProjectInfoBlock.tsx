import { getProject } from '@/app/actions/projectActions';
import { Row, Col, Card, CardBody } from 'react-bootstrap';
const ProjectInfoBlock = async ({ id }: { id: string }) => {
  const { project } = await getProject({ id });
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

export default ProjectInfoBlock;
