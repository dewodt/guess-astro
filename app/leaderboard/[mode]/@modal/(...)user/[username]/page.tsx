import { getUserDetailData } from "@/lib/get-data";
import { notFound } from "next/navigation";
import { getFormattedDate } from "@/lib/utils";
import { UserCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UserDetailModalPage = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  // Get user detail data
  const userDetailData = await getUserDetailData(username);

  // If params is not valid (username is not available)
  if (!userDetailData) {
    return notFound();
  }

  // Valid
  return (
    <DialogContent className="flex max-w-xs flex-col rounded-lg sm:max-w-sm">
      {/* Header */}
      <DialogHeader className="flex flex-col items-center gap-2">
        {/* Title */}
        <DialogTitle className="self-start text-2xl font-bold text-primary">
          User Detail
        </DialogTitle>

        {/* Profile Picture */}
        <Avatar className="h-60 w-60 self-center sm:h-72 sm:w-72">
          <AvatarImage
            src={userDetailData.image!}
            alt={`${userDetailData.username} Profile Picture`}
            className="object-cover object-center"
          />
          <AvatarFallback>
            <UserCircle2 className="h-full w-full stroke-gray-500 stroke-1" />
          </AvatarFallback>
        </Avatar>
      </DialogHeader>

      {/* Data */}
      <div className="flex flex-col items-start gap-2">
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-base font-semibold">Username</h3>
          <h4 className="text-sm text-muted-foreground">
            {userDetailData.username}
          </h4>
        </div>
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-base font-semibold">Name</h3>
          <h4 className="text-sm text-muted-foreground">
            {userDetailData.name}
          </h4>
        </div>
        <div className="flex flex-col items-start gap-1">
          <h3 className="text-base font-semibold">Signed up at</h3>
          <h4 className="text-sm text-muted-foreground">
            {getFormattedDate(userDetailData.createdAt!)}
          </h4>
        </div>
      </div>
    </DialogContent>
  );
};

export default UserDetailModalPage;
