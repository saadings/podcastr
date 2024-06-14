"use client";
import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { api } from "@/_generated/api";

import { useToast } from "@/components/ui/use-toast";

const useGeneratePodcast = ({
  voice,
  prompt,
  setAudio,
  setAudioStorageId,
}: IGeneratePodcastProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const getPodcastAudio = useAction(api.openAi.generateAudioAction);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const { startUpload } = useUploadFiles(generateUploadUrl);

  const generatePodcast = async () => {
    if (!prompt) {
      return;
    }

    setIsGenerating(true);

    try {
      const response = await getPodcastAudio({
        input: prompt,
        voice: voice,
      });

      const blob = new Blob([response], { type: "audio/mpeg" });
      const fileName = `podcast-${window.crypto.randomUUID()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });

      setAudio(audioUrl!);

      toast({
        title: "Podcast Generated",
        description: "Your podcast has been generated successfully",
      });
    } catch (error) {
      console.log("Error generating podcast", error);

      toast({
        variant: "destructive",
        title: "Error Generating Podcast",
        description:
          error instanceof Error
            ? error.message
            : "There was an error generating your podcast",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatePodcast,
  };
};

export default useGeneratePodcast;
