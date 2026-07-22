import { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import Badge from '@/components/ui/Badge';
import {
  UnlockFill as Unlocked,
  LockFill as Locked,
} from 'react-bootstrap-icons';

const iconMap = {
  public: Unlocked,
  private: Locked,
};

const ProjectMetadata = ({
  project,
  hideTitle = false,
}: {
  project: ProjectWithUserAndBib;
  hideTitle?: boolean;
}) => {
  let IconComponent = iconMap['private'];
  let publicStatus = 'PRIVATE';

  if (project.public) {
    IconComponent = iconMap['public'];
    publicStatus = 'PUBLIC';
  }
  return (
    <>
      <div className="mb-4 text-sm text-gray-500">
        {!hideTitle && <span className="font-bold">{project?.title}</span>}
        <Badge bg="secondary" className="ms-2">
          Owner: {project?.user.name}
        </Badge>
        {project.coEditors &&
          project.coEditors.map((ed) => (
            <Badge bg="light" className="ms-2 text-dark" key={ed.id}>
              Co-Editor: {ed.name}
            </Badge>
          ))}

        <div className="float-right">
          {project.subjects && project.subjects.length > 0 && (
            <Badge bg="light" className="ms-2 text-dark">
              Subject(s): {project.subjects.join(', ')}
            </Badge>
          )}
          <Badge bg="light" className="ms-2 text-dark">
            <IconComponent className="mx-2 inline" />
            Project is {publicStatus}
          </Badge>
        </div>
      </div>
    </>
  );
};

export default ProjectMetadata;
