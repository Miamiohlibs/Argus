import Link from 'next/link';

export default function About({ className = '' }) {
  const deptName =
    typeof process.env.NEXT_PUBLIC_CONTACT_DEPT == 'string' &&
    process.env.NEXT_PUBLIC_CONTACT_DEPT != ''
      ? process.env.NEXT_PUBLIC_CONTACT_DEPT
      : 'Special Collections';

  const contactArr = [];
  //   typeof process.env.NEXT_PUBLIC_CONTACT_EMAIL == 'string' &&
  //     process.env.NEXT_PUBLIC_CONTACT_EMAIL != '' &&
  //     contactArr.push(
  //       <a href="mailto:{process.env.NEXT_PUBLIC_CONTACT_EMAIL}">
  //         {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
  //       </a>,
  //     );
  //   const contactHow = contactArr.length > 0 ? ` at ${contactArr.join(' ')}` : '';

  const classes = `fs-4 ${className}`;
  return (
    <div className={classes}>
      <p>
        <b>Argus</b> is a project manager for special collections. Researches
        can use it to create projects and add special collections items to the
        project by importing bibliographic records from the library catalog.
      </p>
      <p>
        To get started, contact {deptName} at{' '}
        <span className="text-nowrap">
          <a href="SpecColl@MiamiOH.edu">SpecColl@MiamiOH.edu</a>
        </span>{' '}
        or{' '}
        <span className="text-nowrap">
          <a href="+15135293323">(513) 529-3323</a>
        </span>
        .
      </p>
    </div>
  );
}
