'use client';
import { useParams } from 'next/navigation';

export default function MultiPagePdf() {
  const { id } = useParams();
  return (
    <div style={{ height: '100vh' }}>
      <iframe
        src={`${process.env.NEXT_PUBLIC_APP_BASEPATH ?? ''}/api/demoPdf`}
        title="Data Driven Pdf"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}
