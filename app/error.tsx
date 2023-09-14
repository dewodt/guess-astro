"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <main className="flex flex-auto items-center justify-center bg-muted p-5 sm:p-10">
      <Card className="w-full max-w-lg">
        <CardHeader className="px-9 pt-9">
          <h1 className="text-center text-3xl font-bold text-primary">
            Error 500: Server Error
          </h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-5 px-9 pb-9">
          <p className="text-center text-lg text-foreground">
            Something went wrong while you&apos;re requesting this page. Please
            try again!
          </p>
          <Button size="lg" onClick={() => reset()}>
            Try again
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default ErrorPage;
