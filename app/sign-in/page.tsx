import { type Metadata } from "next";
import SignInForm from "./sign-in-form";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign In | Guess Astro",
};

const SignInPage = async () => {
  return (
    <main className="flex flex-auto items-center justify-center p-5 sm:p-10">
      <Card className="w-full max-w-sm shadow-lg">
        {/* Title */}
        <CardHeader>
          <h1 className="text-center text-3xl font-bold text-primary">
            Sign In
          </h1>
        </CardHeader>

        {/* Sign in Form & with Google Option */}
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default SignInPage;
