"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Id } from "@/_generated/dataModel";

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
import GeneratePodcast from "@/components/GeneratePodcast";
import GenerateThumbnail from "@/components/GenerateThumbnail";

import { voiceDetails } from "@/constants";
import { cn } from "@/lib/utils";
import useGeneratePodcast from "@/hooks/useGeneratePodcast";
import { useState } from "react";

const formSchema = z.object({
  podcastTitle: z.string().min(2, {
    message: "Podcast Title must be at least 2 characters.",
  }),
  voice: z.string().min(2, {
    message: "Please Select a Voice.",
  }),
  podcastDescription: z.string().min(10, {
    message: "Podcast Description must be at least 10 characters.",
  }),
  audio: z.string().min(2, {
    message: "Please Generate Podcast Audio.",
  }),
  audioStorageId: z
    .custom<Id<"_storage">>((value) => {
      if (value === "") {
        return "Please Generate Podcast Audio ID.";
      }
      return true;
    })
    .nullable(),
  audioDuration: z.number().min(1, {
    message: "Please Generate Podcast Duration.",
  }),
  voicePrompt: z.string().min(2, {
    message: "Please Generate Podcast Prompt.",
  }),
});

const CreatePodcast = () => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      voice: "",
      podcastDescription: "",
      voicePrompt: "",
    },
  });
  const voice = form.watch("voice");
  const audio = form.watch("audio");
  const voicePrompt = form.watch("voicePrompt");

  const { generatePodcast } = useGeneratePodcast({
    audio,
    setAudio: (value: any) => form.setValue("audio", value),
    setAudioDuration: (value: any) => form.setValue("audioDuration", value),
    setAudioStorageId: (value: any) => form.setValue("audioStorageId", value),
    voicePrompt: form.watch("voicePrompt"),
    setVoicePrompt: (value: any) => form.setValue("voicePrompt", value),
    voiceType: form.watch("voice"),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>
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
                    Podcast Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="input-class focus-visible:ring-orange-1"
                      placeholder="Saadings Pro Podcast"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="voice"
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
                    Podcast Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class max-h-52 focus-visible:ring-orange-1"
                      placeholder="Write a short podcast description."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
            <FormField
              control={form.control}
              name="voicePrompt"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    AI Prompt to Generate Podcast
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class max-h-52 focus-visible:ring-orange-1"
                      placeholder="Provide text to generate audio."
                      rows={5}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <div className="mt-5 w-full max-w-[200px]">
              <Button
                type="button"
                className="text-16 bg-orange-1 py-4 font-extrabold text-white-1"
                onClick={generatePodcast}
                disabled={voice === "" || voicePrompt === ""}
              >
                Generate
              </Button>
            </div>

            {audio && (
              <audio
                src={audio}
                autoPlay
                controls
                className="mt-5"
                onLoadedMetadata={(e) =>
                  form.setValue("audioDuration", e.currentTarget.duration)
                }
              />
            )}

            <GenerateThumbnail />
            <div className="generate_thumbnail">
              <Button
                type="button"
                variant={"plain"}
                className={cn({ "bg-black-6": isAiThumbnail })}
                onClick={() => setIsAiThumbnail(true)}
              >
                Use AI to Generate Thumbnail
              </Button>

              <Button
                type="button"
                variant={"plain"}
                className={cn({ "bg-black-6": !isAiThumbnail })}
                onClick={() => setIsAiThumbnail(false)}
              >
                Upload Custom Image
              </Button>
            </div>

            <div className="mt-10 w-full">
              <Button
                type="submit"
                className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
              >
                Publish Podcast
              </Button>
            </div>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </section>
  );
};

export default CreatePodcast;
