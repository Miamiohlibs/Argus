'use client';
import { useParams } from 'next/navigation';

export default function ClientIframe() {
  const { id, specificBibEntry } = useParams();
  // generate different url param based on whether or not a single BibEntry is called for
  const idToPrint = specificBibEntry ? `${id}--${specificBibEntry}` : id;
  return (
    <div style={{ height: '100vh' }}>
      <iframe
        src={`${
          process.env.NEXT_PUBLIC_APP_BASEPATH ?? ''
        }/slipsRender/${idToPrint}`}
        title="Printing Slips"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}
