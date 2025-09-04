'use client';
import RecordSearchForm from '@/components/RecordSearchForm';
import { useSearchParams } from 'next/navigation';
import BackToProjectButton from '@/components/BackToProjectButton';

interface ClientSearchBibsPageProps {
  projectId?: number;
  userCanEditPage: boolean;
}

const ClientSearchBibsPage = ({
  projectId,
  userCanEditPage,
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
      <h1>Search Bibs</h1>
      <BackToProjectButton projectId={clientProjectId} />
      <RecordSearchForm
        projectId={clientProjectId}
        userCanEditPage={userCanEditPage}
      />
    </>
  );
};

export default ClientSearchBibsPage;
