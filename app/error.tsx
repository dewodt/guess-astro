"use client";

// Error components must be Client Components
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
    <main className="flex flex-auto items-center justify-center p-6 py-12 sm:p-12 lg:p-24">
      <section className="max-w-xl">
        <Card className="flex flex-col gap-2 p-8 shadow-lg lg:gap-5 lg:p-10">
          <CardHeader className="p-0">
            <h1 className="text-center text-2xl font-bold leading-none tracking-tight lg:text-4xl lg:leading-none">
              Error 500: Server Error
            </h1>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5 p-0">
            <p className="text-center text-base lg:text-xl">
              Something went wrong while you&apos;re requesting this page.
              Please try again!
            </p>
            <Button
              size="lg"
              onClick={() => {
                window.location.reload();
                reset();
              }}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default ErrorPage;
