import { SignIn as SignInClerk } from "@clerk/nextjs";

const SignIn = () => {
  return (
    <div className="flex-center glassmorphism-auth h-screen w-full">
      <SignInClerk />
    </div>
  );
};

export default SignIn;
