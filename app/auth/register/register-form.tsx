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
import { Loader2, Trash2, UserCircle2 } from "lucide-react";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const RegisterForm = ({ session }: { session: Session }) => {
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
      name: session.name ?? "",
      username: session.username ?? "",
      image: session.image,
    },
  });
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { isSubmitting, isSubmitSuccessful }, // isSubmitSuccessful: Onetime submit, no reset.
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

    // Update session
    await update();

    // Show success toast
    toast.success(res.title, { description: res.description });

    // Redirect to home
    router.replace("/?phState=identify");

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

  // If not loading
  return (
    <Card className="w-full max-w-md shadow-lg">
      {/* Title */}
      <CardHeader>
        <h1
          data-cy="register-title"
          className="text-center text-3xl font-bold text-primary"
        >
          Register
        </h1>
      </CardHeader>

      {/* Register Form */}
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
                    <FormLabel data-cy="register-avatar-label">
                      Avatar
                    </FormLabel>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Avatar Preview */}
                      <Avatar
                        data-cy="register-avatar-preview"
                        onClick={() =>
                          !isSubmitting &&
                          !isUploadingImage &&
                          fileInputRef!.current!.click()
                        }
                        className={`h-20 w-20 ${
                          isSubmitting || isUploadingImage
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
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

                      <div className="flex flex-row gap-4">
                        {/* File Upload */}
                        <FormControl>
                          <Input
                            data-cy="register-avatar-input"
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
                          data-cy="register-avatar-delete"
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
                    <FormMessage data-cy="register-avatar-message" />
                  </FormItem>
                );
              }}
            />

            {/* Readonly Email Input */}
            {/* Don't register it to React Hook Form because we don't want to send to BE */}
            <FormItem>
              <FormLabel data-cy="register-email-label">Email</FormLabel>
              <FormControl>
                <Input
                  data-cy="register-email-input"
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
                  <FormLabel data-cy="register-username-label">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      data-cy="register-username-input"
                      type="text"
                      placeholder="Username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage data-cy="register-username-message" />
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
                  <FormLabel data-cy="register-name-label">Name</FormLabel>
                  <FormControl>
                    <Input
                      data-cy="register-name-input"
                      type="text"
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage data-cy="register-name-message" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              data-cy="register-submit"
              variant="default"
              className="w-full"
              size="lg"
              type="submit"
              disabled={isSubmitting || isUploadingImage}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
