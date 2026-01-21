import RecordSearchForm from '@/components/RecordSearchForm';

export default function quickSlipAlmaPage() {
  return (
    <>
      <h1>Lookup item for Quick Slip</h1>
      <RecordSearchForm quickSlip={true} />
    </>
  );
}
