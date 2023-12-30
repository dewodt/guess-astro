import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getUserDetailData } from "@/data/user";
import { openGraphTemplate, twitterTemplate } from "@/lib/metadata";
import { getFormattedDate } from "@/lib/utils";
import { UserCircle2 } from "lucide-react";
import { type Metadata } from "next";
import { notFound } from "next/navigation";

// Generate dynamic metadata
export const generateMetadata = async ({
  params: { username },
}: {
  params: { username: string };
}): Promise<Metadata> => {
  // If params is not valid (username is not available)
  const userDetailData = await getUserDetailData(username);
  if (!userDetailData) {
    return notFound();
  }

  return {
    title: `User Detail ${userDetailData.username} | Guess Astro`,
    openGraph: {
      ...openGraphTemplate,
      title: `User Detail ${userDetailData.username} | Guess Astro`,
    },
    twitter: {
      ...twitterTemplate,
      title: `User Detail ${userDetailData.username} | Guess Astro`,
    },
  };
};

// Force dynamic page
export const dynamic = "force-dynamic";

const UserDetailPage = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  // If params is not valid (username is not available)
  const userDetailData = await getUserDetailData(username);
  if (!userDetailData) {
    return notFound();
  }

  return (
    <main className="flex flex-auto items-center justify-center p-6 py-12 sm:p-12 lg:p-24">
      <section className="w-full max-w-xs sm:max-w-sm">
        <Card className="shadow-lg">
          {/* Header */}
          <CardHeader className="gap-3 pb-3">
            {/* Title */}
            <h1 className="text-2xl font-bold leading-none tracking-tight text-primary">
              User Detail
            </h1>

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
          </CardHeader>

          {/* Detail */}
          <CardContent className="flex flex-col items-start gap-2">
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
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default UserDetailPage;
