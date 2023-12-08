import { Skeleton } from "@/components/ui/skeleton";

const PlayMatchLoadingPage = () => {
  return (
    <main className="flex flex-auto items-center justify-center p-6 py-12 sm:p-12 lg:p-24">
      <section className="flex w-full max-w-[420px] flex-col gap-4 lg:gap-6">
        {/* Title */}
        <div className="flex flex-col gap-2">
          {/* Title */}
          <Skeleton className="h-8 w-72 lg:h-9" />

          {/* Short description */}
          <Skeleton className="h-6 w-80 lg:h-7" />
        </div>

        {/* Question Image */}
        <Skeleton className="aspect-square w-full rounded-full shadow-lg" />

        {/* Question Form */}
        <div className="flex flex-col items-start gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 w-full" />
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-row gap-4">
          <Skeleton className="h-11 w-1/2" />
          <Skeleton className="h-11 w-1/2" />
        </div>
      </section>
    </main>
  );
};

export default PlayMatchLoadingPage;
