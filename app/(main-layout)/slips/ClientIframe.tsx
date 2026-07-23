export default function ClientIframe({ src }: { src: string }) {
  return (
    <div style={{ height: '100vh' }}>
      <iframe
        src={`${process.env.NEXT_PUBLIC_APP_BASEPATH ?? ''}${src}`}
        title="Printing Slips"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}
