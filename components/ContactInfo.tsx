export function ContactInfo() {
  const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || '';
  const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || '';
  const CONTACT_DEPT = process.env.NEXT_PUBLIC_CONTACT_DEPT?.trim() || '';

  const hasPhone = CONTACT_PHONE.length > 0;
  const hasEmail = CONTACT_EMAIL.length > 0;
  const hasDept = CONTACT_DEPT.length > 0;

  const contactMethods: React.ReactNode[] = [];

  if (hasEmail) {
    contactMethods.push(
      <span key="email" className="text-nowrap">
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </span>,
    );
  }

  if (hasPhone) {
    contactMethods.push(
      <span key="phone" className="text-nowrap">
        <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a>
      </span>,
    );
  }

  if (!hasDept && contactMethods.length === 0) {
    return null; // Nothing to render
  }

  return (
    <p>
      To get started
      {hasDept && <> contact {CONTACT_DEPT}</>}
      {contactMethods.length > 0 && (
        <>
          {hasDept ? ' at ' : ' contact '}
          {joinWithOr(contactMethods)}
        </>
      )}
      .
    </p>
  );
}

function joinWithOr(items: React.ReactNode[]) {
  if (items.length === 0) return null;
  if (items.length === 1) return items[0];

  return items.reduce((prev, curr, index) => {
    if (index === items.length - 1) {
      return (
        <>
          {prev} or {curr}
        </>
      );
    }
    return (
      <>
        {prev}, {curr}
      </>
    );
  });
}
