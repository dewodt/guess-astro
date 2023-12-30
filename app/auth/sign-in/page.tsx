import SignInForm from "./sign-in-form";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { openGraphTemplate, twitterTemplate } from "@/lib/metadata";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Guess Astro",
  openGraph: {
    ...openGraphTemplate,
    title: "Sign In | Guess Astro",
  },
  twitter: {
    ...twitterTemplate,
    title: "Sign In | Guess Astro",
  },
};

const SignInPage = async () => {
  return (
    <main className="flex flex-auto items-center justify-center p-6 py-12 sm:p-12 lg:p-24">
      <Card className="w-full max-w-sm shadow-lg">
        {/* Title */}
        <CardHeader>
          <h1
            data-cy="sign-in-title"
            className="text-center text-3xl font-bold text-primary"
          >
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
