'use client';

interface ClientQuickPagesProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ClientQuickPages({
  searchParams,
}: ClientQuickPagesProps) {
  const queryString = new URLSearchParams(
    Object.entries(searchParams).flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map((v) => [key, v])
        : value !== undefined
          ? [[key, value]]
          : [],
    ),
  ).toString();

  // console.log(`***** Query string in ClientPdf: ${queryString}`);

  return (
    <div style={{ height: '100vh' }}>
      <iframe
        src={`${
          process.env.NEXT_PUBLIC_APP_BASEPATH ?? ''
        }/slipsRender/quickSlip?${queryString}`}
        title="Quick Slip"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}
