'use client';
import RecordSearchForm from '@/components/RecordSearchForm';
import { useSearchParams } from 'next/navigation';
import ProjectButtons from '@/components/ProjectButtons';
import NonOwnerAlert from '@/components/NonOwnerAlert';

interface ClientSearchBibsPageProps {
  projectId?: number;
  userCanEditPage: boolean;
  nonOwnerAlert: boolean;
}

const ClientSearchBibsPage = ({
  projectId,
  userCanEditPage,
  nonOwnerAlert,
}: ClientSearchBibsPageProps) => {
  // You can still use useSearchParams if needed for other params
  const params = useSearchParams();
  const tempId = projectId || params?.get('projectId') || 'none';
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
      <h1 className="h2">Search Alma Catalog for Item</h1>
      <ProjectButtons
        projectId={clientProjectId}
        onPage="searchBibs"
        canEdit={userCanEditPage}
        divClass={'mb-3'}
      />
      <RecordSearchForm
        projectId={clientProjectId}
        userCanEditPage={userCanEditPage}
      />
    </>
  );
};

export default ClientSearchBibsPage;
