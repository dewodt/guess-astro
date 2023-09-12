import { type Metadata } from "next";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ProfileForm from "./profile-form";
import { User } from "lucide-react";

export const metadata: Metadata = {
  title: "Profile | Guess Astro",
};

const ProfilePage = () => {
  return (
    <main className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center gap-2">
            <User className="h-6 w-6 stroke-primary" />
            <h2 className="text-2xl font-bold text-primary">Profile</h2>
          </div>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default ProfilePage;
