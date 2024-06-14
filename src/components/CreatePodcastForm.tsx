"use client";
import { z } from "zod";

import { useState } from "react";
import { api } from "@/_generated/api";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import GeneratePodcast from "@/components/GeneratePodcast";

import { voiceDetails } from "@/constants";
import { cn } from "@/lib/utils";
import { createPodcastFormSchema } from "@/lib/zodSchemas";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const CreatePodcastForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createPodcast = useMutation(api.podcasts.createPodcast);

  const form = useForm<z.infer<typeof createPodcastFormSchema>>({
    resolver: zodResolver(createPodcastFormSchema),
    defaultValues: {
      podcastTitle: "",
      voiceType: "",
      podcastDescription: "",
      voicePrompt: "",
      isAiThumbnail: true,
      imageUrl: "",
      imagePrompt: "",
    },
  });

  const voice = form.watch("voiceType");

  const onSubmit = async (values: z.infer<typeof createPodcastFormSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    setIsSubmitting(true);
    try {
      await createPodcast({
        podcastTitle: values.podcastTitle,
        podcastDescription: values.podcastDescription,

        voiceType: values.voiceType,
        voicePrompt: values.voicePrompt,

        imageUrl: values.imageUrl,
        imagePrompt: values.imagePrompt!,
        imageStorageId: values.imageStorageId!,

        audioUrl: values.audioUrl,
        audioStorageId: values.audioStorageId!,
        audioDuration: values.audioDuration!,

        views: 0,
      });

      toast({
        title: "Podcast Created",
        description: "Your podcast has been created successfully.",
      });

      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description:
          error instanceof Error
            ? error.message
            : "An Unexpected Error Occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-12 flex w-full flex-col"
          >
            <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
              <FormField
                control={form.control}
                name="podcastTitle"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className="text-16 font-bold text-white-1">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="input-class focus-visible:ring-orange-1"
                        placeholder="Saadings Podcast"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-white-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="voiceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-16 font-bold text-white-1">
                      Voice
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            "text-16 w-full border-none bg-black-1 capitalize text-gray-1 focus:ring-orange-1 focus-visible:ring-orange-1",
                          )}
                        >
                          <SelectValue
                            placeholder="Select AI Voice"
                            className="capitalize placeholder:text-gray-1 focus-visible:ring-orange-1"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                        {voiceDetails.map(({ id, name }) => (
                          <SelectItem
                            key={id}
                            value={name}
                            className="capitalize focus:bg-orange-1"
                          >
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>

                      {voice && (
                        <audio
                          src={`/${voice}.mp3`}
                          autoPlay
                          className="hidden"
                        />
                      )}
                    </Select>

                    <FormMessage className="text-white-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="podcastDescription"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5">
                    <FormLabel className="text-16 font-bold text-white-1">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="input-class max-h-52 focus-visible:ring-orange-1"
                        placeholder="Write a short podcast description"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-white-1" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col pt-10">
              <GeneratePodcast form={form} />
              <GenerateThumbnail form={form} />

              <div className="mt-10 w-full">
                <Button
                  type="submit"
                  className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      Publishing
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Publish Podcast"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePodcastForm;
