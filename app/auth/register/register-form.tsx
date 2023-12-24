"use client";

import { useRef } from "react";
import { useSession } from "next-auth/react";
import { type Session } from "next-auth";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
import { UserAction } from "@/actions/user";

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
      image: null,
    },
  });
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { isSubmitting, isSubmitSuccessful }, // isSubmitSuccessful: Onetime submit, no reset.
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

    // Update session
    await update();

    // Show success toast
    toast.success(res.title, { description: res.description });

    // Redirect to home
    router.replace("/?phState=identify");

    // Refresh router
    router.refresh();
  };

  // If not loading
  return (
    <Card className="w-full max-w-md shadow-lg">
      {/* Title */}
      <CardHeader>
        <h1 className="text-center text-3xl font-bold text-primary">
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
                    <div className="flex flex-row items-center gap-4">
                      {/* Avatar Preview */}
                      <div
                        className={`${
                          isSubmitting || isSubmitSuccessful
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <Avatar
                          onClick={() => fileInputRef!.current!.click()}
                          className={`h-20 w-20 ${
                            (isSubmitting || isSubmitSuccessful) &&
                            "pointer-events-none"
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

                      {/* File Upload */}
                      <FormControl>
                        <div
                          className={`${
                            (isSubmitting || isSubmitSuccessful) &&
                            "cursor-not-allowed"
                          }`}
                        >
                          <Input
                            type="file"
                            accept="image/*"
                            readOnly={isSubmitting || isSubmitSuccessful}
                            className={`cursor-pointer ${
                              (isSubmitting || isSubmitSuccessful) &&
                              "pointer-events-none"
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
                          isSubmitting || isSubmitSuccessful
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
                            isSubmitting ||
                            isSubmitSuccessful // Submitting form
                          }
                          onClick={() => setValue("image", "DELETE")}
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

            {/* Username */}
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div
                      className={`${
                        (isSubmitting || isSubmitSuccessful) &&
                        "cursor-not-allowed"
                      }`}
                    >
                      <Input
                        type="text"
                        placeholder="Username"
                        readOnly={isSubmitting || isSubmitSuccessful}
                        className={`${
                          (isSubmitting || isSubmitSuccessful) &&
                          "pointer-events-none"
                        }`}
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
                    <div
                      className={`${
                        (isSubmitting || isSubmitSuccessful) &&
                        "cursor-not-allowed"
                      }`}
                    >
                      <Input
                        type="text"
                        placeholder="Name"
                        readOnly={isSubmitting || isSubmitSuccessful}
                        className={`${
                          (isSubmitting || isSubmitSuccessful) &&
                          "pointer-events-none"
                        }`}
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
              disabled={isSubmitting || isSubmitSuccessful}
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
