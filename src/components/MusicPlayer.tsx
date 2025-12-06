import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAudio } from '@/contexts/AudioContext';

interface MusicPlayerProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export const MusicPlayer = ({ className = '', variant = 'default' }: MusicPlayerProps) => {
  const { isPlaying, currentTrack, musicTracks, handlePlayPause } = useAudio();
  const [isMusicMenuOpen, setIsMusicMenuOpen] = useState(false);

  const handleMainButtonClick = () => {
    if (currentTrack) {
      handlePlayPause();
    }
  };

  if (variant === 'compact') {
    return (
      <DropdownMenu open={isMusicMenuOpen} onOpenChange={setIsMusicMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            onClick={(e) => {
              if (currentTrack && !isMusicMenuOpen) {
                e.preventDefault();
                handleMainButtonClick();
              }
            }}
            className={`p-1 hover:bg-secondary rounded-lg transition-colors ${className}`}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-foreground" />
            ) : (
              <Play className="w-5 h-5 text-foreground" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-popover border-border" align="end">
          <DropdownMenuLabel>Music</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {musicTracks.map((track, index) => (
            <DropdownMenuItem
              key={index}
              className="cursor-pointer"
              onClick={() => {
                handlePlayPause(track.file);
                setIsMusicMenuOpen(false);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  {currentTrack === track.file && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span>{track.name}</span>
                </span>
                {currentTrack === track.file && isPlaying && (
                  <span className="text-xs text-muted-foreground">Playing...</span>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isMusicMenuOpen} onOpenChange={setIsMusicMenuOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          onClick={(e) => {
            if (currentTrack && !isMusicMenuOpen) {
              e.preventDefault();
              handleMainButtonClick();
            }
          }}
          className={`border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 hover-trigger flex items-center justify-center ${className}`}
          data-cursor="hover"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#0a0a0a] border-white/10 text-white" align="end">
        <DropdownMenuLabel className="text-white">Music</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        {musicTracks.map((track, index) => (
          <DropdownMenuItem
            key={index}
            className="text-white focus:bg-white/10 focus:text-white cursor-pointer"
            onClick={() => {
              handlePlayPause(track.file);
              setIsMusicMenuOpen(false);
            }}
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-2">
                {currentTrack === track.file && isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{track.name}</span>
              </span>
              {currentTrack === track.file && isPlaying && (
                <span className="text-xs text-gray-400">Playing...</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

