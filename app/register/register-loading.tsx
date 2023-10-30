"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RegisterLoadingPage = () => {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <Skeleton className="h-8 w-40 self-center" />
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-5">
          {/* Profile Picture */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-20" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Avatar Preview */}
              <Skeleton className="h-20 w-20 flex-none rounded-full" />

              <div className="flex w-full flex-row gap-4">
                {/* File Upload */}
                <Skeleton className="h-10 w-full max-w-xs" />

                {/* File Delete */}
                <Skeleton className="h-10 w-10 flex-none" />
              </div>
            </div>
          </div>

          {/* Username */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Submit Button */}
          <Skeleton className="h-11 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterLoadingPage;
