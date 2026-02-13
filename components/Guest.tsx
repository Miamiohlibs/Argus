import { SignInButton } from '@clerk/nextjs';
import About from '@/components/About';
const Guest = () => {
  return (
    <div className="guest container">
      <h1 className="mb-3">Welcome</h1>
      {/* <p>Please sign in to view projects.</p> */}
      <SignInButton>
        <div className="btn btn-primary">Sign in</div>
      </SignInButton>
      <About className="mt-5" />
    </div>
  );
};

export default Guest;
