"use client";

import { MatchAction } from "@/actions/match";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MatchAnswerSchema } from "@/lib/zod";
import { GameData } from "@/types/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const PlayForm = ({
  data: { options, question },
  rotateDeg,
}: {
  data: GameData;
  rotateDeg: string;
}) => {
  // Router hooks
  const router = useRouter();

  // Popover hooks
  const [open, setOpen] = useState(false);

  // Game state hooks
  const [isAnswered, setIsAnswered] = useState(false);

  // Initiallly, set image url to question image url. After answered, if answer image url is available, set it to answer image url
  const [imageUrl, setImageUrl] = useState(question.imageQuestionUrl);

  // Form hooks
  const form = useForm<z.infer<typeof MatchAnswerSchema>>({
    resolver: zodResolver(MatchAnswerSchema),
    defaultValues: {
      id: question.id,
      mode: question.mode,
    },
  });
  const {
    formState: { isSubmitting },
    handleSubmit,
    control,
    setValue,
    setError,
  } = form;

  // Submit handler
  const onSubmit = async (data: z.infer<typeof MatchAnswerSchema>) => {
    // Initiate loading toast
    const loadingToast = toast.loading("Loading...", {
      description: "Please wait",
      duration: Infinity,
    });

    // Initialize form data
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("mode", data.mode);
    formData.append("answer", data.answer);

    // Call server action
    const res = await MatchAction(formData);

    // Remove loading toast
    toast.dismiss(loadingToast);

    // Response is error
    if (!res.ok) {
      toast.error(res.title, { description: res.description });

      // If error paths is not available, return
      if (!res.errorPaths) return;

      // Set error to form fields
      res.errorPaths.forEach((item) => {
        setError(
          item.path as keyof z.infer<typeof MatchAnswerSchema>,
          { message: item.description },
          { shouldFocus: true }
        );
      });

      return;
    }

    // Response not error
    // Toasts
    if (res.isCorrect) {
      toast.success(res.title, { description: res.description });
    } else {
      toast.error(res.title, { description: res.description });
    }

    // New game state
    setIsAnswered(true);

    // If answer image url is available, set it to answer image url
    const newImageUrl = res.correctAnswerImageUrl;
    if (!newImageUrl) return;
    setImageUrl(newImageUrl);
  };

  return (
    <section className="flex w-full max-w-[420px] flex-col gap-4 lg:gap-6">
      <div className="flex flex-col gap-2">
        {/* Title */}
        <h1
          data-cy="play-mode-title"
          className="text-2xl font-bold lg:text-3xl"
        >
          Guess the {question.mode} object!
        </h1>

        {/* Short description */}
        <p
          data-cy="play-mode-description"
          className="text-base text-muted-foreground lg:text-lg"
        >
          Select one of the options from the dropdown!
        </p>
      </div>

      {/* Question Image */}
      <div className="aspect-square w-full rounded-full shadow-xl">
        <Image
          data-cy="play-mode-image"
          src={imageUrl}
          className="aspect-square w-full rounded-full object-cover object-center"
          style={{ rotate: rotateDeg }}
          alt="Object (?)"
          width={500}
          height={500}
        />
      </div>

      {/* Question Form */}
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:gap-6"
        >
          <FormField
            control={control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                {/* Label */}
                <FormLabel data-cy="play-mode-popover-label">
                  Your Answer
                </FormLabel>

                {/* Trigger */}
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        data-cy="play-mode-popover-trigger"
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isSubmitting || isAnswered}
                      >
                        {field.value
                          ? options.find(
                              (option) => option.name === field.value
                            )?.name
                          : "Select an answer"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  {/* Popup */}
                  <PopoverContent className="popover-content-width-same-as-its-trigger p-0">
                    <Command>
                      {/* Place holder */}
                      <CommandInput
                        data-cy="play-mode-popover-input"
                        placeholder="Search object..."
                      />

                      {/* Search not found */}
                      <CommandEmpty data-cy="play-mode-popover-not-found">
                        No object found.
                      </CommandEmpty>

                      {/* Options */}
                      <CommandGroup className="max-h-28 overflow-y-auto">
                        {options.map((option) => (
                          <CommandItem
                            data-cy={`play-mode-popover-option-${option.name
                              .replaceAll(" ", "-")
                              .toLowerCase()}`}
                            value={option.name}
                            key={option.name}
                            onSelect={() => {
                              setValue("answer", option.name);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                option.name === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex flex-row gap-4">
            {/* Back to Menu */}
            <Link
              data-cy="play-mode-quit"
              href="/play"
              className={cn(
                "w-1/2",
                isSubmitting ? "pointer-events-none" : "pointer-events-auto"
              )}
            >
              <Button
                tabIndex={-1}
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                Quit
              </Button>
            </Link>

            {/* Submit or Next question */}
            {!isAnswered ? (
              <Button
                data-cy="play-mode-submit"
                className="w-1/2"
                size="lg"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            ) : (
              <Button
                data-cy="play-mode-next"
                className="w-1/2"
                size="lg"
                type="button"
                onClick={() => {
                  // Refresh server component
                  router.refresh();
                  // Refetch new object
                  window.location.reload();
                }}
              >
                Next
              </Button>
            )}
          </div>
        </form>
      </Form>
    </section>
  );
};

export default PlayForm;
