import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { getUserDetailData } from "@/lib/get-data";
import { getFormattedDate } from "@/lib/utils";
import { UserCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    metadataBase: new URL("https://astro.dewodt.com"),
    generator: "Next.js",
    applicationName: "Guess Astro",
    keywords: ["Guess Astro", "Astronomy", "Game"],
    colorScheme: "normal",
    category: "education",
    themeColor: "#2563EB",
    openGraph: {
      title: `User Detail ${userDetailData.username} | Guess Astro`,
      description:
        "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
      url: "https://astro.dewodt.com/",
      siteName: "Guess Astro",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `User Detail ${userDetailData.username} | Guess Astro`,
      description:
        "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
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
    <main className="flex flex-auto items-center justify-center p-6 sm:p-12 lg:p-24">
      <section className="w-full max-w-xs sm:max-w-sm">
        <Card className="shadow-lg">
          {/* Header */}
          <CardHeader className="gap-3 pb-3">
            {/* Title */}
            <CardTitle className="font-bold text-primary">
              User Detail
            </CardTitle>

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