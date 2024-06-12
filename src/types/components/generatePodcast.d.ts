interface IGeneratePodcastProps {
  audio: string;
  setAudio: (value: string) => void;
  setAudioDuration: (value: number) => void;
  setAudioStorageId: (value: Id<"_storage">) => void;
  voiceType: string;
  voicePrompt: string;
  setVoicePrompt: (value: string) => void;
}
