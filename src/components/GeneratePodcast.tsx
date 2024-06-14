"use client";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import useGeneratePodcast from "@/hooks/useGeneratePodcast";
import { createPodcastFormSchema } from "@/lib/zodSchemas";

const GeneratePodcast = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof createPodcastFormSchema>>;
}) => {
  const voice = form.watch("voiceType");
  const audio = form.watch("audioUrl");
  const prompt = form.watch("voicePrompt");

  const { generatePodcast, isGenerating } = useGeneratePodcast({
    voice,
    prompt,
    setAudio: (value) => form.setValue("audioUrl", value),
    setAudioStorageId: (value) => form.setValue("audioStorageId", value),
  });

  return (
    <>
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
                placeholder="Provide text to generate audio"
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
          disabled={
            voice === "" || prompt === "" || prompt.length < 10 || isGenerating
          }
        >
          {isGenerating ? (
            <>
              Generating
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Generate"
          )}
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
    </>
  );
};

export default GeneratePodcast;
