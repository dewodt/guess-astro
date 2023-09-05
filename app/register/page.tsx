import { type Metadata } from "next";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "Register | Guess Astro",
};

const RegisterPage = () => {
  return (
    <main className="flex flex-auto items-center justify-center bg-muted p-5 sm:p-10">
      <Card className="w-full max-w-sm">
        {/* Title */}
        <CardHeader>
          <h1 className="text-center text-3xl font-bold text-primary">
            Register
          </h1>
        </CardHeader>

        {/* Register Form */}
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default RegisterPage;
