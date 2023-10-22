import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const UserDetailModalLoadingPage = () => {
  return (
    <DialogContent className="flex max-w-xs flex-col rounded-lg sm:max-w-sm">
      {/* Header */}
      <DialogHeader className="flex flex-col items-center gap-2">
        {/* Title */}
        <Skeleton className="h-8 w-32 self-start" />

        {/* Profile Picture */}
        <Skeleton className="h-60 w-60 rounded-full sm:h-72 sm:w-72" />
      </DialogHeader>

      {/* Data */}
      <div className="flex flex-col items-start gap-2">
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
      </div>
    </DialogContent>
  );
};

export default UserDetailModalLoadingPage;
