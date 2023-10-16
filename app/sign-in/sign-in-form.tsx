"use client";

import { useRouter } from "next/navigation";
import Google from "@/components/icons/google";
import Discord from "@/components/icons/discord";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const SignInForm = () => {
  // Router
  const router = useRouter();

  // Toast initailization
  const { toast } = useToast();

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
    toast({
      variant: "default",
      title: "Loading",
      description: "Please wait...",
      duration: Infinity,
    });

    // Sign in with email
    // Disable redirect to prevent hard refresh, so we use router.push() & router.refresh()
    const res = await signIn("email", {
      email: values.email,
      callbackUrl: "/",
      redirect: false,
    });

    // Error
    if (!res?.ok) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error sign in with email. Please try again.",
        duration: 5000,
      });
      return;
    }

    // Success
    toast({
      variant: "success",
      title: "Success",
      description: "Email sent. Please check your inbox.",
      duration: 5000,
    });
    router.push("/verify-request");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-5">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Email */}
          <FormField
            control={control}
            name="email"
            disabled={isSubmitting}
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

      <Separator />

      {/* OAuth */}
      {/* Google */}
      <Button
        variant="secondary"
        type="button"
        size="lg"
        className="flex w-full flex-row items-center gap-3"
        disabled={isSubmitting}
        onClick={() => signIn("google", { redirect: true, callbackUrl: "/" })}
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
        onClick={() => signIn("discord", { redirect: true, callbackUrl: "/" })}
      >
        <Discord size={20} />
        Continue with Discord
      </Button>
    </div>
  );
};

export default SignInForm;
