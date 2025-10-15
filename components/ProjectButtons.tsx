import Link from 'next/link';
import DuplicateProjectButton from './DuplicateProjectButton';

const ProjectButtons = ({
  projectId,
  canEdit = false,
  canPrint = false,
  canAssignCoEditors = false,
  onPage,
  divClass = '',
}: {
  projectId: number;
  canEdit?: boolean;
  canPrint?: boolean;
  canAssignCoEditors?: boolean;
  onPage: string;
  divClass?: string;
}) => {
  const classNames = 'me-2';
  return (
    <div className={divClass}>
      {onPage !== 'project' && (
        <Link
          href={`/project/${projectId}`}
          className={classNames + ' btn btn-outline-secondary btn-sm'}
        >
          Back to Project
        </Link>
      )}
      {canEdit && onPage !== 'searchBibs' && (
        <Link
          href={`/searchBibs?projectId=${projectId.toString()}`}
          className={classNames + ' btn btn-primary btn-sm'}
        >
          Add Alma Item
        </Link>
      )}
      {canEdit && onPage !== 'customEntry' && (
        <Link
          href={`/customEntry/${projectId.toString()}/new`}
          className={classNames + ' btn btn-primary btn-sm'}
        >
          Add Custom Item
        </Link>
      )}
      {canEdit && onPage !== 'bulkAdd' && (
        <Link
          href={`/bulkAdd/${projectId.toString()}`}
          className={classNames + ' btn btn-primary btn-sm'}
        >
          Bulk Add Items
        </Link>
      )}
      {canPrint && (
        <Link
          href={`/slips/${projectId}`}
          className={'me-2 btn btn-outline-primary btn-sm'}
        >
          Print Slips
        </Link>
      )}

      {canEdit && onPage == 'project' && (
        <DuplicateProjectButton id={projectId.toString()} />
      )}

      {canAssignCoEditors &&
        ['project', 'edit-project-details'].includes(onPage) && (
          <Link
            href={`/editProject/${projectId.toString()}/coEditors`}
            className="me-2 btn btn-outline-secondary btn-sm"
          >
            Add/Remove Co-Editors
          </Link>
        )}
    </div>
  );
};

export default ProjectButtons;
