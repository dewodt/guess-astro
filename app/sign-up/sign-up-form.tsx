"use client";

import { useState } from "react";
import Link from "next/link";
import Google from "@/components/icons/google";
import Discord from "@/components/icons/discord";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const SignUpForm = () => {
  // Toast initailization
  const { toast } = useToast();

  // Form Schema Validation
  const formSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(18),
    password: z.string().min(8),
  });

  // Form Hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Form Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Form Submit Handler (After validated with zod)
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
  };

  return (
    <div className="flex flex-col gap-5 xl:gap-6 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 xl:gap-5"
        >
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
          <Button
            variant="default"
            className="flex w-full flex-row items-center gap-2"
            size="lg"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign Up
          </Button>

          {/* Sign In */}
          <p className="text-center font-inter text-sm font-medium text-secondary-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-in">
              <Button variant="link" className="h-fit w-fit p-0">
                Sign In
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

export default SignUpForm;
