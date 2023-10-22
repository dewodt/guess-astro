"use client";

import { Dialog } from "@/components/ui/dialog";
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
      {children}
    </Dialog>
  );
};

export default UserDetailModalLayout;
