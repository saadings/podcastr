import { SignUp as SignUpClerk } from "@clerk/nextjs";

const SignUp = () => {
  return (
    <div className="flex-center glassmorphism-auth h-screen w-full">
      <SignUpClerk />
    </div>
  );
};

export default SignUp;
