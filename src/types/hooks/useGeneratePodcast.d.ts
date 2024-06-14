interface IGeneratePodcastProps {
  prompt: string;
  voice: string;
  setAudio: (value: string) => void;
  setAudioStorageId: (value: Id<"_storage">) => void;
}
