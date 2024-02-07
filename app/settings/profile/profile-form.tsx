"use client";

import { uploadAvatar } from "@/actions/upload-avatar";
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
import { avatarSchema, registerOrUpdateUserSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2, User, UserCircle2 } from "lucide-react";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
      image: session.image,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    clearErrors,
    formState: { isSubmitting, isDirty },
  } = form;

  // Image Upload Loading State
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form Submit Handler (After validated with zod)
  const onSubmit = async (
    values: z.infer<typeof registerOrUpdateUserSchema>
  ) => {
    // Initiate loading toast
    const loadingToast = toast.loading("Loading...", {
      description: "Updating profile",
      duration: Infinity,
    });

    // Create form data
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("name", values.name);
    values.image && formData.append("image", values.image);

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
      image: values.image,
    });

    // Update PostHog identity
    router.replace("/settings/profile?phState=identify");

    // Refresh router
    router.refresh();
  };

  const onUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset previous errors
    clearErrors("image");

    // If no files, return
    const file = e.target.files![0];
    if (!file) return;

    // Validate image
    const zodResult = avatarSchema.safeParse(file);
    if (!zodResult.success) {
      // Set error to first error message
      setError("image", { message: zodResult.error.errors[0].message });
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append("file", file);

    // Set loading state
    setIsUploadingImage(true);
    const loadingToast = toast.loading("Loading...", {
      description: "Uploading image",
      duration: Infinity,
    });

    // Upload file
    const imageUrl = await uploadAvatar(formData);

    // Reset loading state
    toast.dismiss(loadingToast);
    setIsUploadingImage(false);

    // If upload fails
    if (!imageUrl) {
      toast.error("Error", { description: "Failed to upload image" });
      return;
    }

    // Upload succeeded
    toast.success("Success", { description: "Image uploaded successfully" });
    setValue("image", imageUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // Finished loading
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-row items-center gap-2">
          <User className="h-6 w-6 stroke-primary" />
          <h2
            data-cy="settings-profile-title"
            className="text-2xl font-bold text-primary"
          >
            Profile
          </h2>
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
                const uploadedAvatarUrl = form.getValues("image") ?? "";

                return (
                  <FormItem>
                    <FormLabel data-cy="settings-profile-avatar-label">
                      Avatar
                    </FormLabel>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Avatar Preview */}
                      <button
                        type="button"
                        disabled={isSubmitting || isUploadingImage}
                        onClick={() =>
                          !isSubmitting &&
                          !isUploadingImage &&
                          fileInputRef!.current!.click()
                        }
                      >
                        <Avatar
                          data-cy="settings-profile-avatar-preview"
                          className="h-20 w-20"
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
                      </button>

                      <div className="flex flex-row gap-4">
                        {/* File Upload */}
                        <FormControl>
                          <Input
                            data-cy="settings-profile-avatar-input"
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            disabled={isSubmitting || isUploadingImage}
                            onChange={onUploadAvatar}
                            {...field}
                          />
                        </FormControl>

                        {/* File Delete */}
                        <Button
                          data-cy="settings-profile-avatar-delete"
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="flex-none"
                          disabled={
                            isSubmitting ||
                            isUploadingImage ||
                            !uploadedAvatarUrl
                          }
                          onClick={() =>
                            setValue("image", null, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <FormMessage data-cy="settings-profile-avatar-message" />
                  </FormItem>
                );
              }}
            />

            {/* Readonly Email Input */}
            {/* Don't register it to React Hook Form because we don't want to send to BE */}
            <FormItem>
              <FormLabel data-cy="settings-profile-email-label">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  data-cy="settings-profile-email-input"
                  type="text"
                  placeholder="Email"
                  value={session.email}
                  disabled={true}
                />
              </FormControl>
            </FormItem>

            {/* Username */}
            <FormField
              control={control}
              disabled={isSubmitting}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-cy="settings-profile-username-label">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      data-cy="settings-profile-username-input"
                      type="text"
                      placeholder="Username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage data-cy="settings-profile-username-message" />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={control}
              disabled={isSubmitting}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-cy="settings-profile-name-label">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      data-cy="settings-profile-name-input"
                      type="text"
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage data-cy="settings-profile-name-message" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              data-cy="settings-profile-submit"
              variant="default"
              className="w-full"
              size="lg"
              type="submit"
              disabled={isSubmitting || isUploadingImage || !isDirty}
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
