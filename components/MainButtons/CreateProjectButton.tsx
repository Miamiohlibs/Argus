import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';

const CreateProjectButton = () => {
  return (
    <Link href="/createProject" className={buttonClasses({ variant: 'primary' })}>
      Create a New Project
    </Link>
  );
};

export default CreateProjectButton;
