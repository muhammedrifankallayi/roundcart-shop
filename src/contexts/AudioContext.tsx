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
  const autoplayedRef = useRef(false); // ensure we only autoplay once

  const musicTracks = [
    { name: "Rap Beat", file: rapBeat },
    { name: "No Mercy Rap Beat", file: noMercy },
  ];

  const handlePlayPause = (trackFile?: string) => {
    if (audioRef.current) {
      const targetTrack = trackFile || currentTrack;
      if (!targetTrack) return;

      if (currentTrack === targetTrack && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
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
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.5;

      // Auto-advance to next track when current ends
      audioRef.current.addEventListener('ended', () => {
        const currentIndex = musicTracks.findIndex(t => t.file === audioRef.current?.src);
        const nextTrack = musicTracks[(currentIndex + 1) % musicTracks.length];
        if (audioRef.current && nextTrack) {
          audioRef.current.src = nextTrack.file;
          setCurrentTrack(nextTrack.file);
          audioRef.current.play().catch(() => { });
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
          setCurrentTrack(null);
        }
      });

      // Pre-load the first track
      audioRef.current.src = musicTracks[0].file;
      setCurrentTrack(musicTracks[0].file);
    }

    // Autoplay on first user interaction (bypasses browser autoplay policy)
    const tryAutoplay = () => {
      if (autoplayedRef.current) return;
      autoplayedRef.current = true;

      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Browser still blocked — user will use the player button
          });
      }

      // Remove listeners after first interaction
      window.removeEventListener('click', tryAutoplay);
      window.removeEventListener('touchstart', tryAutoplay);
      window.removeEventListener('keydown', tryAutoplay);
    };

    window.addEventListener('click', tryAutoplay);
    window.addEventListener('touchstart', tryAutoplay);
    window.addEventListener('keydown', tryAutoplay);

    return () => {
      window.removeEventListener('click', tryAutoplay);
      window.removeEventListener('touchstart', tryAutoplay);
      window.removeEventListener('keydown', tryAutoplay);
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
