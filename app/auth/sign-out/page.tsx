import { SignOutButton } from "./sign-out-button";
import { openGraphTemplate, twitterTemplate } from "@/app/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Out | Guess Astro",
  openGraph: {
    ...openGraphTemplate,
    title: "Sign Out | Guess Astro",
  },
  twitter: {
    ...twitterTemplate,
    title: "Sign Out | Guess Astro",
  },
};

const AuthErrorPage = () => {
  return (
    <main className="flex flex-auto items-center justify-center p-6 py-12 sm:p-12 lg:p-24">
      <section className="max-w-xl">
        <Card className="flex flex-col gap-2 p-8 shadow-lg lg:gap-5 lg:p-10">
          <CardHeader className="p-0">
            <h1 className="text-center text-2xl font-bold leading-none tracking-tight lg:text-4xl lg:leading-none">
              Sign Out
            </h1>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5 p-0">
            <p className="text-center text-base lg:text-xl">
              Are you certain that you want to sign out from Guess Astro?
            </p>
            <SignOutButton />
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default AuthErrorPage;
