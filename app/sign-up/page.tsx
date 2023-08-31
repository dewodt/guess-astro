import { type Metadata } from "next";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up | Guess Astro",
};

const SignUp = () => {
  return (
    <main className="flex flex-auto items-center justify-center p-5 sm:p-10">
      <div className="flex w-full max-w-xs flex-col gap-4 xl:gap-5">
        {/* Title */}
        <h1 className="text-center text-3xl font-bold text-primary xl:text-4xl">
          Sign Up
        </h1>

        {/* Sign in Form & with Google Option */}
        <SignUpForm />
      </div>
    </main>
  );
};

export default SignUp;
