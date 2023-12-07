"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
      <DialogContent className="flex max-w-xs flex-col rounded-lg sm:max-w-sm">
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModalLayout;