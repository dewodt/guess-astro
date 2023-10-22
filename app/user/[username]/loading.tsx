import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const UserDetailLoadingPage = () => {
  return (
    <main className="flex flex-auto items-center justify-center p-6 sm:p-12 lg:p-24">
      <section className="w-full max-w-xs sm:max-w-sm">
        <Card className="shadow-lg">
          {/* Header */}
          <CardHeader className="gap-3 pb-3">
            {/* Title */}
            <Skeleton className="h-8 w-32" />

            {/* Profile Picture */}
            <Skeleton className="h-60 w-60 self-center rounded-full sm:h-72 sm:w-72" />
          </CardHeader>

          {/* Detail */}
          <CardContent className="flex flex-col items-start gap-2">
            <div className="flex flex-col items-start gap-1">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default UserDetailLoadingPage;
