import { z } from "zod";
import Image from "next/image";
import { api } from "@/_generated/api";
import { useRef, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { UseFormReturn } from "react-hook-form";
import { useUploadFiles } from "@xixixao/uploadstuff/react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

import { Loader2 } from "lucide-react";
import { createPodcastFormSchema } from "@/lib/zodSchemas";
import { cn } from "@/lib/utils";

const GenerateThumbnail = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof createPodcastFormSchema>>;
}) => {
  const { toast } = useToast();
  const imageRef = useRef<HTMLInputElement>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.podcasts.getUrl);

  const handleGenerateThumbnail = useAction(api.openAi.generateThumbnailAction);

  const isAiThumbnail = form.watch("isAiThumbnail");
  const image = form.watch("imageUrl");
  const imagePrompt = form.watch("imagePrompt");

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    form.setValue("imageUrl", "");

    try {
      const file = new File([blob], fileName, { type: "image/png" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      form.setValue("imageStorageId", storageId);

      const imageUrl = await getImageUrl({ storageId });
      form.setValue("imageUrl", imageUrl!);

      toast({
        title: "Image Uploaded Successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Uploading Image",
        description:
          error instanceof Error ? error.message : "An Unknown Error Occurred.",
      });
    } finally {
      setIsImageLoading(false);
    }
  };
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;

      if (!files || files.length === 0) {
        return;
      }

      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

      handleImage(blob, file.name);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error Uploading Image",
        description:
          error instanceof Error ? error.message : "An Unknown Error Occurred.",
      });
    }
  };
  const generateImage = async () => {
    setIsImageLoading(true);
    try {
      const response = await handleGenerateThumbnail({
        prompt: imagePrompt!,
      });
      const blob = new Blob([response], { type: "image/png" });
      handleImage(blob, `thumbnail-${window.crypto.randomUUID()}.png`);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error Generating Thumbnail",
        description:
          error instanceof Error ? error.message : "An Unknown Error Occurred.",
      });
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <div>
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant={"plain"}
          className={cn({ "bg-black-6": isAiThumbnail })}
          onClick={() => form.setValue("isAiThumbnail", true)}
        >
          Use AI to Generate Thumbnail
        </Button>

        <Button
          type="button"
          variant={"plain"}
          className={cn({ "bg-black-6": !isAiThumbnail })}
          onClick={() => form.setValue("isAiThumbnail", false)}
        >
          Upload Custom Image
        </Button>
      </div>

      {isAiThumbnail ? (
        <div className="mt-5">
          <FormField
            control={form.control}
            name="imagePrompt"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">
                  AI Prompt to Generate Thumbnail
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="input-class max-h-52 focus-visible:ring-orange-1"
                    placeholder="Provide text to generate thumbnail"
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
              onClick={generateImage}
              disabled={imagePrompt === "" || isImageLoading}
            >
              {isImageLoading ? (
                <>
                  Generating
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="image_div" onClick={() => imageRef.current?.click()}>
          {isImageLoading ? (
            <>
              <Loader2 size={40} className="animate-spin text-orange-1" />
            </>
          ) : (
            <>
              <Input
                type="file"
                className="hidden"
                ref={imageRef}
                onChange={(e) => uploadImage(e)}
              />
              <Image
                src={"/icons/upload-image.svg"}
                width={40}
                height={40}
                alt="upload image"
              />
              <div className="ml-3 flex flex-col items-center">
                <h2 className="text-12 font-bold text-orange-1">
                  Click to Upload
                </h2>
                <p className="text-12 font-normal text-gray-1">
                  SVG, PNG, JPG, or GIF (max. 1024 * 1024 px)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {image && (
        <div className="flex-center w-full">
          <Image
            src={image}
            width={200}
            height={200}
            alt="thumbnail"
            className="mt-5"
          />
        </div>
      )}
    </div>
  );
};

export default GenerateThumbnail;
