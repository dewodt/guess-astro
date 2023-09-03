"use client";

import Google from "@/components/icons/google";
import Discord from "@/components/icons/discord";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
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
  // Toast initailization
  const { toast } = useToast();

  // Form Schema Validation
  const formSchema = z.object({
    email: z.string().email(),
  });

  // Form Hooks
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // Form Submit Handler (After validated with zod)
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    await signIn("email", { email: values.email });
  };

  return (
    <div className="flex flex-col gap-5">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Email */}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            variant="default"
            className="flex w-full flex-row items-center gap-2"
            size="lg"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
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
        onClick={() => signIn("google")}
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
        onClick={() => signIn("discord")}
      >
        <Discord size={20} />
        Continue with Discord
      </Button>
    </div>
  );
};

export default SignInForm;
