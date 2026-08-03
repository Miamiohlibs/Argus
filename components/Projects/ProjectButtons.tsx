import Link from 'next/link';
import DuplicateProjectButton from './DuplicateProjectButton';
import UnarchiveProjectButton from './UnarchiveProjectButton';
import { activeCatalogs } from '@/lib/catalogs/displayNames';
import { buttonClasses } from '@/components/ui/Button';

const ProjectButtons = ({
  projectId,
  canEdit = false,
  canPrint = false,
  canAssignCoEditors = false,
  isAdmin = false,
  onPage,
  divClass = '',
  showUnarchive = false,
}: {
  projectId: number;
  canEdit?: boolean;
  canPrint?: boolean;
  canAssignCoEditors?: boolean;
  isAdmin?: boolean;
  onPage: string;
  divClass?: string;
  showUnarchive?: boolean;
}) => {
  const includeAlma =
    activeCatalogs.filter((item) => item.slug == 'ALMA').length > 0;
  const includeAspace =
    activeCatalogs.filter((item) => item.slug == 'ASPACE').length > 0;
  const classNames = 'me-2';
  return (
    <div className={divClass}>
      {onPage !== 'project' && (
        <Link
          href={`/project/${projectId}`}
          className={buttonClasses({
            variant: 'outline-secondary',
            size: 'sm',
            className: classNames,
          })}
        >
          Back to Project
        </Link>
      )}
      {includeAlma && canEdit && onPage !== 'searchBibs-ALMA' && (
        <Link
          href={`/searchBibs?projectId=${projectId.toString()}`}
          className={buttonClasses({
            variant: 'primary',
            size: 'sm',
            className: classNames,
          })}
        >
          Add Alma Item
        </Link>
      )}
      {includeAspace && canEdit && onPage !== 'searchBibs-ASPACE' && (
        <Link
          href={`/searchBibs?catalog=ASPACE&projectId=${projectId.toString()}`}
          className={buttonClasses({
            variant: 'primary',
            size: 'sm',
            className: classNames,
          })}
        >
          Add ArchivesSpace Item
        </Link>
      )}
      {canEdit && onPage !== 'customEntry' && (
        <Link
          href={`/customEntry/${projectId.toString()}/new`}
          className={buttonClasses({
            variant: 'primary',
            size: 'sm',
            className: classNames,
          })}
        >
          Add Custom Item
        </Link>
      )}
      {canEdit && onPage !== 'bulkAdd' && (
        <Link
          href={`/bulkAdd/${projectId.toString()}`}
          className={buttonClasses({
            variant: 'primary',
            size: 'sm',
            className: classNames,
          })}
        >
          Bulk Add Items
        </Link>
      )}
      {canPrint && (
        <Link
          href={`/slips/${projectId}`}
          className={buttonClasses({
            variant: 'outline-primary',
            size: 'sm',
            className: 'me-2',
          })}
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
            className={buttonClasses({
              variant: 'outline-secondary',
              size: 'sm',
              className: 'me-2',
            })}
          >
            Add/Remove Co-Editors
          </Link>
        )}
      {showUnarchive && (
        <UnarchiveProjectButton projectId={projectId} classNames={classNames} />
      )}
      {isAdmin && (
        <Link
          href={`/admin/reassignProject/${projectId.toString()}`}
          className={buttonClasses({
            variant: 'outline-secondary',
            size: 'sm',
            className: 'me-2',
          })}
        >
          Reassign Ownership
        </Link>
      )}
    </div>
  );
};

export default ProjectButtons;
