import Link from 'next/link';
import { Button } from 'react-bootstrap';
import DuplicateProjectButton from './DuplicateProjectButton';

const ProjectButtons = ({
  projectId,
  canEdit = false,
  onPage,
  divClass = '',
}: {
  projectId: number;
  canEdit: boolean;
  onPage: string;
  divClass?: string;
}) => {
  const classNames = 'me-2';
  return (
    <div className={divClass}>
      {onPage !== 'project' && (
        <Link href={`/project/${projectId}`} className={classNames}>
          <Button variant="outline-secondary" size="sm">
            Back to Project
          </Button>
        </Link>
      )}
      {canEdit && onPage !== 'searchBibs' && (
        <Link
          href={`/searchBibs?projectId=${projectId.toString()}`}
          className={classNames}
        >
          <Button variant="primary" size="sm">
            Add Alma Item
          </Button>
        </Link>
      )}
      {canEdit && onPage !== 'customEntry' && (
        <Link
          href={`/customEntry/${projectId.toString()}/new`}
          className={classNames}
        >
          <Button variant="primary" size="sm">
            Add Custom Item
          </Button>
        </Link>
      )}
      {canEdit && onPage !== 'bulkAdd' && (
        <Link href={`/bulkAdd/${projectId.toString()}`} className={classNames}>
          <Button variant="primary" size="sm">
            Bulk Add Items
          </Button>
        </Link>
      )}
      <Link href={`/slips/${projectId}`}>
        <Button variant="outline-primary" size="sm" className={'me-2'}>
          Print Slips
        </Button>
      </Link>

      {canEdit && onPage == 'project' && (
        <DuplicateProjectButton id={projectId.toString()} />
      )}
    </div>
  );
};

export default ProjectButtons;
