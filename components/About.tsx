import { ContactInfo } from './ContactInfo';

export default function About({ className = '' }) {
  const deptName =
    typeof process.env.NEXT_PUBLIC_CONTACT_DEPT == 'string' &&
    process.env.NEXT_PUBLIC_CONTACT_DEPT != ''
      ? process.env.NEXT_PUBLIC_CONTACT_DEPT
      : 'Special Collections';

  const contactArr = [];

  const classes = `fs-4 ${className}`;
  return (
    <div className={classes}>
      <p>
        <b>Argus</b> is a project manager for special collections. Researches
        can use it to create projects and add special collections items to the
        project by importing bibliographic records from the library catalog.
      </p>
      <ContactInfo />
    </div>
  );
}
