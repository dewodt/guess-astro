"use client";

import Discord from "@/components/icons/discord";
import Google from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const SignInForm = () => {
  // Router
  const router = useRouter();

  // Form Hooks
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // Form Submit Handler (After validated with zod)
  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    // Initiate loading toast
    const loadingToast = toast.loading("Loading...", {
      description: "Please wait",
      duration: Infinity,
    });

    // Sign in with email
    // Disable redirect to prevent hard refresh, so we use router.push() & router.refresh()
    const res = await signIn("email", {
      email: values.email,
      callbackUrl: "/?phState=identify",
      redirect: false,
    });

    // Remove loading toast
    toast.dismiss(loadingToast);

    // Error
    if (!res?.ok) {
      toast.error("Error", {
        description: "Error sign in with email. Please try again.",
      });

      return;
    }

    // Success
    toast.success("Success", {
      description: "Email sent. Please check your inbox.",
    });

    // Redirect to verify request page
    router.push("/auth/verify-request");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-5">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Email */}
          <FormField
            control={control}
            disabled={isSubmitting}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            variant="default"
            className="w-full"
            size="lg"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue with Email
          </Button>
        </form>
      </Form>

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* OAuth */}
      {/* Google */}
      <Button
        variant="secondary"
        type="button"
        size="lg"
        className="flex w-full flex-row items-center gap-3"
        disabled={isSubmitting}
        onClick={() =>
          signIn("google", {
            redirect: true,
            callbackUrl: "/?phState=identify",
          })
        }
      >
        <Google size={20} />
        Continue with Google
      </Button>

      {/* Discord */}
      <Button
        variant="secondary"
        type="button"
        size="lg"
        className="flex w-full flex-row items-center gap-3"
        disabled={isSubmitting}
        onClick={() =>
          signIn("discord", {
            redirect: true,
            callbackUrl: "/?phState=identify",
          })
        }
      >
        <Discord size={20} />
        Continue with Discord
      </Button>
    </div>
  );
};

export default SignInForm;
