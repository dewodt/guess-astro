"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const UserDetailModalLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent
        data-cy="leaderboard-modal"
        className="flex max-h-[85vh] max-w-xs flex-col overflow-y-auto rounded-lg sm:max-w-sm"
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModalLayout;
