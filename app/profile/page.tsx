import { type Metadata } from "next";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ProfileForm from "./profile-form";

export const metadata: Metadata = {
  title: "Profile | Guess Astro",
};

const ProfilePage = () => {
  return (
    <main className="flex flex-auto items-center justify-center bg-muted p-5 sm:p-10">
      <Card className="h-w-full max-w-md">
        <CardHeader>
          <h1 className="text-center text-3xl font-bold text-primary">
            Profile
          </h1>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default ProfilePage;
