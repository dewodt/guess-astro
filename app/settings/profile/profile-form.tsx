"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { objectToFormData } from "@/lib/utils";
import { UserPutResponseJson } from "@/types/api";
import { Loader2, Trash2, User, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { registerOrUpdateUserSchema } from "@/lib/zod";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ProfileLoadingPage from "./profile-loading";

const ProfileForm = () => {
  // Router
  const router = useRouter();

  // Session
  const { data: session, update, status } = useSession();
  const isLoadingSession = status === "loading";

  // Toast initailization
  const { toast } = useToast();

  // Form Hooks
  const form = useForm<z.infer<typeof registerOrUpdateUserSchema>>({
    resolver: zodResolver(registerOrUpdateUserSchema),
  });
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { isSubmitting, isDirty },
  } = form;

  // Set default value after session loaded.
  // Can't use defaultValues in useForm because it is undefined at first.
  useEffect(() => {
    if (!isLoadingSession) {
      reset({
        username: session?.username as string,
        name: session?.name as string,
        image: undefined,
      });
    }
  }, [session, reset, isLoadingSession]);

  // Form Submit Handler (After validated with zod)
  const onSubmit = async (
    values: z.infer<typeof registerOrUpdateUserSchema>
  ) => {
    // Initiate loading toast
    toast({
      variant: "default",
      title: "Loading",
      description: "Please wait...",
      duration: Infinity,
    });

    // Create form data
    const formData = objectToFormData(values);

    // Send request
    const res = await fetch("/api/user/", {
      method: "PUT",
      body: formData,
    });
    const resJSON = (await res.json()) as UserPutResponseJson;

    // Error response
    if (!res.ok) {
      toast({
        variant: "destructive",
        title: "Error",
        description: resJSON.message,
        duration: 5000,
      });

      // Trigger error focus
      resJSON.paths!.forEach((item) => {
        setError(item.path, { message: item.message }, { shouldFocus: true });
      });

      return;
    }

    // Success response
    await update();
    toast({
      variant: "success",
      title: "Success",
      description: resJSON.message,
      duration: 5000,
    });
    router.refresh();
  };

  // Loading skeleton
  if (isLoadingSession) {
    return <ProfileLoadingPage />;
  }

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
                  uploadedAvatar === undefined // Initial state, taken from session
                    ? (session?.image as string)
                    : uploadedAvatar === "DELETE" // File is deleted
                    ? undefined
                    : URL.createObjectURL(uploadedAvatar); // New file is uploaded

                return (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Avatar Preview */}
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={uploadedAvatarUrl}
                          alt="Avatar Upload Preview"
                          className="object-cover object-center"
                        />
                        <AvatarFallback>
                          <UserCircle2 className="h-full w-full stroke-gray-500 stroke-1" />
                        </AvatarFallback>
                      </Avatar>

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
                              className={`${
                                isSubmitting && "pointer-events-none"
                              }`}
                              onChange={(e) => {
                                onChange(e.target.files![0]);
                              }}
                              {...field}
                            />
                          </div>
                        </FormControl>

                        {/* File Delete */}
                        <Button
                          type="reset"
                          variant="destructive"
                          size="icon"
                          className="flex-none"
                          disabled={
                            uploadedAvatar === "DELETE" || // Current avatar / file is deleted
                            (uploadedAvatar === undefined && !session?.image) || // Initial state and there's no image in current session
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
