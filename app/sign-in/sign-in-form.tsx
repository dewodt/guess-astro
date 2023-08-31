"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Google from "@/components/icons/google";
import Discord from "@/components/icons/discord";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const SignInForm = () => {
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col gap-5 xl:gap-6 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 xl:gap-5"
        >
          {/* Email */}
          <FormField
            control={form.control}
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

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button variant="default" className="w-full" size="lg" type="submit">
            Sign In
          </Button>

          {/* Sign Up */}
          <p className="text-center font-inter text-sm font-medium text-secondary-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up">
              <Button variant="link" className="h-fit w-fit p-0">
                Sign Up
              </Button>
            </Link>
          </p>
        </form>
      </Form>

      <Separator />

      {/* OAuth */}
      <div className="flex flex-col gap-4 xl:gap-5">
        {/* Google */}
        <Button
          variant="secondary"
          size="lg"
          className="flex w-full flex-row items-center gap-3"
        >
          <Google size={20} />
          Continue with Google
        </Button>

        {/* Discord */}
        <Button
          variant="secondary"
          size="lg"
          className="flex w-full flex-row items-center gap-3"
        >
          <Discord size={20} />
          Continue with Discord
        </Button>
      </div>
    </div>
  );
};

export default SignInForm;
