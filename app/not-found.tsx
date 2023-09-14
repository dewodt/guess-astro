import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Error 404 | Guess Astro",
};

const NotFoundPage = () => {
  return (
    <main className="flex flex-auto items-center justify-center bg-muted p-5 sm:p-10">
      <Card className="w-full max-w-lg">
        <CardHeader className="px-9 pt-9">
          <h1 className="text-center text-3xl font-bold text-primary">
            Error 404: Page Not Found
          </h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-5 px-9 pb-9">
          <p className="text-center text-lg text-foreground">
            The page you are looking for does&apos;t exists. Click the button
            bellow to go to the home page!
          </p>
          <Link href="/">
            <Button size="lg">Home</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
};

export default NotFoundPage;
