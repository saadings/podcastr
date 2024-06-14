"use client";
import { usePathname } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const AudioContext = createContext<IAudioContext | undefined>(undefined);

const AudioProvider = ({ children }: PropsWithChildren) => {
  const pathName = usePathname();

  const [audio, setAudio] = useState<IAudioProps | undefined>(undefined);

  const value = { audio, setAudio };

  useEffect(() => {
    if (pathName === "/create-podcast") setAudio(undefined);
  }, [pathName]);

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }

  return context;
};

export default AudioProvider;
