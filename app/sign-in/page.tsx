import { type Metadata } from "next";
import SignInForm from "./sign-in-form";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In | Guess Astro",
};

const SignInPage = async () => {
  // Temporary fix: middleware doesnt work in sign in page
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }

  return (
    <main className="flex flex-auto items-center justify-center bg-muted p-5 sm:p-10">
      <Card className="w-full max-w-sm">
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
