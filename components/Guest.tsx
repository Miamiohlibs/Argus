import { SignInButton } from '@clerk/nextjs';
import About from '@/components/About';
import { buttonClasses } from '@/components/ui/Button';
const Guest = () => {
  return (
    <div className="guest mx-auto max-w-screen-xl px-4">
      <h1 className="mb-4">Welcome</h1>
      {/* <p>Please sign in to view projects.</p> */}
      <SignInButton>
        <div className={buttonClasses({ variant: 'primary' })}>Sign in</div>
      </SignInButton>
      <About className="mt-12" />
    </div>
  );
};

export default Guest;
