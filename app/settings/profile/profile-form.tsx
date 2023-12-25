"use client";

import { UserAction } from "@/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerOrUpdateUserSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2, User, UserCircle2 } from "lucide-react";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const ProfileForm = ({ session }: { session: Session }) => {
  // Router
  const router = useRouter();

  // Session
  const { update } = useSession();

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Hooks
  const form = useForm<z.infer<typeof registerOrUpdateUserSchema>>({
    resolver: zodResolver(registerOrUpdateUserSchema),
    defaultValues: {
      name: session.name!,
      username: session.username!,
      image: null,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { isSubmitting, isDirty },
  } = form;

  // Form Submit Handler (After validated with zod)
  const onSubmit = async (
    values: z.infer<typeof registerOrUpdateUserSchema>
  ) => {
    // Initiate loading toast
    const loadingToast = toast.loading("Loading...", {
      description: "Please wait",
      duration: Infinity,
    });

    // Create form data
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("name", values.name);
    values.image && formData.append("image", values.image as File | "DELETE");

    // Send request
    const res = await UserAction(formData);

    // Remove loading toast
    toast.dismiss(loadingToast);

    // Error response
    if (!res.ok) {
      toast.error(res.title, { description: res.description });

      // Return if there's no error paths
      if (!res.errorPaths) return;

      // Trigger error focus
      res.errorPaths.forEach((item) => {
        setError(
          item.path as keyof z.infer<typeof registerOrUpdateUserSchema>,
          { message: item.description },
          { shouldFocus: true }
        );
      });

      return;
    }

    // Success response

    // Show success toast
    toast.success(res.title, { description: res.description });

    // Update session
    await update();

    // Reset form
    reset({
      name: values.name,
      username: values.username,
      image: null,
    });

    // Update PostHog identity
    router.replace("/settings/profile?phState=identify");

    // Refresh router
    router.refresh();
  };

  // Finished loading
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-row items-center gap-2">
          <User className="h-6 w-6 stroke-primary" />
          <h2 className="text-2xl font-bold text-primary">Profile</h2>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Profile Picture */}
            <FormField
              control={control}
              name="image"
              render={({ field: { onChange }, ...field }) => {
                const uploadedAvatar = form.getValues("image");
                const uploadedAvatarUrl =
                  uploadedAvatar === null // Initial state, taken from session
                    ? (session?.image as string)
                    : uploadedAvatar === "DELETE" // File is deleted
                    ? ""
                    : URL.createObjectURL(uploadedAvatar); // New file is uploaded

                return (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Avatar Preview */}
                      <div
                        className={`${
                          isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        <Avatar
                          onClick={() => fileInputRef!.current!.click()}
                          className={`h-20 w-20 ${
                            isSubmitting && "pointer-events-none"
                          }`}
                        >
                          <AvatarImage
                            src={uploadedAvatarUrl}
                            alt="Avatar Upload Preview"
                            className="object-cover object-center"
                          />
                          <AvatarFallback>
                            <UserCircle2 className="h-full w-full stroke-gray-500 stroke-1" />
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex flex-row gap-4">
                        {/* File Upload */}
                        <FormControl>
                          <div
                            className={`${
                              isSubmitting && "cursor-not-allowed"
                            }`}
                          >
                            <Input
                              type="file"
                              accept="image/*"
                              readOnly={isSubmitting}
                              className={`cursor-pointer ${
                                isSubmitting && "pointer-events-none"
                              }`}
                              onChange={(e) => {
                                onChange(e.target.files![0] ?? null);
                              }}
                              ref={fileInputRef}
                              {...field}
                            />
                          </div>
                        </FormControl>

                        {/* File Delete */}
                        <div
                          className={`${
                            isSubmitting
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <Button
                            type="reset"
                            variant="destructive"
                            size="icon"
                            className="flex-none"
                            disabled={
                              uploadedAvatar === "DELETE" || // Current avatar / file is deleted
                              (uploadedAvatar === null && !session?.image) || // Initial state and there's no image in current session
                              isSubmitting // Submitting form
                            }
                            onClick={() =>
                              // Should dirty must be true to trigger form changes.
                              setValue("image", "DELETE", { shouldDirty: true })
                            }
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Readonly Email Input */}
            {/* Don't register it to React Hook Form because we don't want to send to BE */}
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Email"
                  value={session?.email}
                  disabled={true}
                />
              </FormControl>
            </FormItem>

            {/* Username */}
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className={`${isSubmitting && "cursor-not-allowed"}`}>
                      <Input
                        type="text"
                        placeholder="Username"
                        readOnly={isSubmitting}
                        className={`${isSubmitting && "pointer-events-none"}`}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className={`${isSubmitting && "cursor-not-allowed"}`}>
                      <Input
                        type="text"
                        placeholder="Name"
                        readOnly={isSubmitting}
                        className={`${isSubmitting && "pointer-events-none"}`}
                        {...field}
                      />
                    </div>
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
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
