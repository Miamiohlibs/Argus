'use client';
import RecordSearchForm from '@/components/RecordSearchForm';
import { useSearchParams } from 'next/navigation';
import ProjectButtons from '@/components/ProjectButtons';
import NonOwnerAlert from '@/components/NonOwnerAlert';
import ProjectMetadata from '@/components/ProjectMetadata';
import { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import type { Catalog } from '@prisma/client';
import { CATALOG_DISPLAY_NAMES } from '@/lib/catalogs/displayNames';
import { CATALOG_SEARCH_PLACEHOLDER } from '@/lib/catalogs/displayNames';

interface ClientSearchBibsPageProps {
  projectId?: number;
  catalog?: Catalog;
  userCanEditPage: boolean;
  userCanPrint: boolean;
  nonOwnerAlert: boolean;
  project: ProjectWithUserAndBib;
  nonOwnerEditor: boolean;
  currentUserName: string;
}

const ClientSearchBibsPage = ({
  projectId,
  catalog,
  userCanEditPage,
  userCanPrint = false,
  nonOwnerAlert,
  project,
  nonOwnerEditor,
  currentUserName,
}: ClientSearchBibsPageProps) => {
  // You can still use useSearchParams if needed for other params
  const params = useSearchParams();
  const tempId = projectId || params?.get('projectId') || 'none';
  const resolvedCatalog: Catalog =
    catalog ?? ((params?.get('catalog') as Catalog | null) || 'ALMA');
  let numericId: number;
  if (typeof tempId === 'number') {
    numericId = tempId;
  } else {
    numericId = parseInt(tempId, 10);
  }
  if (tempId == 'none' || isNaN(numericId)) {
    return <>`Invalid project ID: ${tempId}`</>;
  }
  const clientProjectId = numericId;

  // You can also access other query parameters here
  // const otherParam = params?.get('someOtherParam');

  return (
    <>
      {nonOwnerAlert && <NonOwnerAlert />}
      <h1 className="h2">
        Search {CATALOG_DISPLAY_NAMES[resolvedCatalog]} Catalog for Item
      </h1>
      <ProjectMetadata project={project} />
      <ProjectButtons
        projectId={clientProjectId}
        onPage="searchBibs"
        canEdit={userCanEditPage}
        canPrint={userCanPrint}
        divClass={'mb-3'}
      />
      <RecordSearchForm
        projectId={clientProjectId}
        catalog={resolvedCatalog}
        userCanEditPage={userCanEditPage}
        quickSlip={false}
        nonOwnerEditor={nonOwnerEditor}
        currentUserName={currentUserName}
        searchPlaceholder={CATALOG_SEARCH_PLACEHOLDER[resolvedCatalog]}
      />
    </>
  );
};

export default ClientSearchBibsPage;
