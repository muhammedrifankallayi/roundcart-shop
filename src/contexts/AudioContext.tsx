import React, { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';
import rapBeat from "@/assets/music/rap-beat-beats-music-441810.mp3";
import noMercy from "@/assets/music/royalty-free-no-mercy-i-hard-rap-beat-335812.mp3";

interface AudioContextType {
  isPlaying: boolean;
  currentTrack: string | null;
  musicTracks: { name: string; file: string }[];
  handlePlayPause: (trackFile?: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  const musicTracks = [
    { name: "Rap Beat", file: rapBeat },
    { name: "No Mercy Rap Beat", file: noMercy },
  ];

  const handlePlayPause = (trackFile?: string) => {
    if (audioRef.current) {
      // If no track file provided, toggle current track
      const targetTrack = trackFile || currentTrack;
      
      if (!targetTrack) return;
      
      if (currentTrack === targetTrack && isPlaying) {
        // Pause current track
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Play new track or resume
        if (currentTrack !== targetTrack) {
          audioRef.current.src = targetTrack;
          setCurrentTrack(targetTrack);
        }
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    // Initialize audio element only once
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTrack(null);
      });
    }

    // Clean up on app unmount only
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <AudioContext.Provider value={{ isPlaying, currentTrack, musicTracks, handlePlayPause }}>
      {children}
    </AudioContext.Provider>
  );
};

