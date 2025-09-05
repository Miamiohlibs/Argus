import BulkAddForm from '@/components/BulkAddForm';
export default function BulkAddPage({ params }: { params: { id: string } }) {
  return (
    <>
      <h1>Bulk Add Page</h1>
      <p>Project ID: {params.id}</p>
      <BulkAddForm projectId={params.id} />
    </>
  );
}
