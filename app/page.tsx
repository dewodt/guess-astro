import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] flex-auto items-center justify-center px-6 py-12 sm:p-10 lg:min-h-[calc(100vh-90px)] lg:p-20">
      <section className="flex max-w-7xl flex-col-reverse items-center gap-4 sm:flex-row sm:gap-0">
        {/* Hero Texts */}
        <div className="flex flex-col gap-3 lg:gap-6">
          <h1 className="text-3xl font-bold lg:text-6xl">
            Memorize Astronomical Object Easily.
          </h1>
          <p className="text-base font-normal text-muted-foreground lg:text-xl">
            Here at Guess Astro we help you memorize astronomical objects to
            prepare for Astronomy National Science Olympiad!
          </p>
          <Link href="/play">
            <Button size="lg">
              Try now
              <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <Image
          src="/orion.svg"
          alt="Image"
          width={400}
          height={400}
          className="w-4/5 max-w-lg sm:w-2/5"
        />
      </section>
    </main>
  );
};

export default Home;
