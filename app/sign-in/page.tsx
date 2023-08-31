import { type Metadata } from "next";
import SignInForm from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign In | Guess Astro",
};

const SignIn = () => {
  return (
    <main className="flex flex-auto items-center justify-center p-5 sm:p-10">
      <div className="flex w-full max-w-xs flex-col gap-4 xl:gap-5">
        {/* Title */}
        <h1 className="text-center text-3xl font-bold text-primary xl:text-4xl">
          Sign In
        </h1>

        {/* Sign in Form & with Google Option */}
        <SignInForm />
      </div>
    </main>
  );
};

export default SignIn;
