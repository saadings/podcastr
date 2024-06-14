"use client";

import { z } from "zod";
import { Id } from "@/_generated/dataModel";

export const createPodcastFormSchema = z.object({
  podcastTitle: z.string().min(2, {
    message: "Podcast Title must be at least 2 characters.",
  }),
  voiceType: z.string().min(2, {
    message: "Please Select a Voice.",
  }),
  podcastDescription: z.string().min(10, {
    message: "Podcast Description must be at least 10 characters.",
  }),
  voicePrompt: z
    .string()
    .min(2, {
      message: "Please Generate Podcast Prompt.",
    })
    .max(2000, {
      message: "Podcast Prompt must be less than 500 characters.",
    }),
  audioUrl: z.string().min(2, {
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
  isAiThumbnail: z.boolean(),
  imageUrl: z.string().min(2, {
    message: "Please Generate Podcast Image.",
  }),
  imageStorageId: z
    .custom<Id<"_storage">>((value) => {
      if (value === "") {
        return "Please Generate Podcast Image ID.";
      }
      return true;
    })
    .nullable(),
  imagePrompt: z.string().optional(),
});
