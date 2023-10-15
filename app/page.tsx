import Image from "next/image";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Guess Astro",
};

const Home = () => {
  return (
    <main className="flex flex-auto items-center justify-center px-6 py-12 sm:p-14 lg:p-20">
      <section className="flex max-w-7xl flex-col-reverse items-center gap-6 sm:flex-row lg:gap-16">
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
              Play now
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
          className="w-3/5 max-w-lg sm:w-1/4 lg:w-1/3"
        />
      </section>
    </main>
  );
};

export default Home;
