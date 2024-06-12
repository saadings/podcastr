"use client";
import { api } from "@/_generated/api";
import { generateUploadUrl } from "@/files";
import { useAction, useMutation } from "convex/react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "@/components/ui/use-toast";

const useGeneratePodcast = ({
  setAudio,
  setAudioStorageId,
  voicePrompt,
  voiceType,
}: any) => {
  const { toast } = useToast();

  const getPodcastAudio = useAction(api.openAi.generateAudioAction);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const { startUpload } = useUploadFiles(generateUploadUrl);

  const generatePodcast = async () => {
    if (!voicePrompt) {
      return;
    }

    try {
      const response = await getPodcastAudio({
        input: voicePrompt,
        voice: voiceType,
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
    }
  };

  return {
    isGenerating: false,
    generatePodcast,
  };
};

export default useGeneratePodcast;
