interface IAudioProps {
  title: string;
  audioUrl: string;
  author: string;
  imageUrl: string;
  podcastId: string;
}

interface IAudioContext {
  audio: IAudioProps | undefined;
  setAudio: React.Dispatch<React.SetStateAction<IAudioProps | undefined>>;
}
