import { type Metadata } from "next";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Verify Request | Guess Astro",
};
const VerifyRequest = () => {
  return (
    <main className="flex flex-auto items-center justify-center p-5 sm:p-10">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <h1 className="text-center text-3xl font-bold text-primary">
            Verify Request
          </h1>
        </CardHeader>
        <CardContent>
          <p className="text-justify text-base">
            To complete the verification process, please check your email inbox
            for a verification link from us. If you don&apos;t see the email in
            your inbox, please also check your spam folder.
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default VerifyRequest;
