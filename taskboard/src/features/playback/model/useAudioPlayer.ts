"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import type { Track } from "@/src/entities/track/model/types";

export function useAudioPlayer(tracks: Track[]) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [initialAudioSource] = useState(() => tracks[0]?.src);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState("");

  const currentIndex = useMemo(() => {
    const selectedIndex = tracks.findIndex((track) => track.id === activeTrackId);
    return selectedIndex === -1 && tracks.length > 0 ? 0 : selectedIndex;
  }, [activeTrackId, tracks]);

  const currentTrack = currentIndex >= 0 ? tracks[currentIndex] : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume;
    audio.muted = false;
  }, [volume]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) {
      return;
    }

    try {
      audio.muted = false;
      await audio.play();
      setError("");
    } catch (playbackError) {
      setError(
        playbackError instanceof Error
          ? `Не удалось воспроизвести трек: ${playbackError.message}`
          : "Не удалось воспроизвести этот файл. Попробуйте выбрать другой.",
      );
    }
  }, [currentTrack]);

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) {
      return;
    }

    if (audio.paused) {
      void play();
    } else {
      audio.pause();
    }
  }, [currentTrack, play]);

  const selectTrack = useCallback(
    (trackId: string) => {
      if (trackId === currentTrack?.id) {
        void play();
        return;
      }

      const selectedTrack = tracks.find((track) => track.id === trackId);
      const audio = audioRef.current;
      if (!selectedTrack || !audio) {
        return;
      }

      audio.pause();
      audio.src = selectedTrack.src;
      audio.load();
      audio.muted = false;
      setCurrentTime(0);
      setDuration(0);
      setError("");
      setActiveTrackId(trackId);
      void audio.play().then(
        () => setError(""),
        (playbackError: unknown) => {
          setError(
            playbackError instanceof Error
              ? `Не удалось воспроизвести трек: ${playbackError.message}`
              : "Не удалось воспроизвести этот файл. Попробуйте выбрать другой.",
          );
        },
      );
    },
    [currentTrack, play, tracks],
  );

  const selectRelativeTrack = useCallback(
    (offset: number) => {
      if (tracks.length < 2 || currentIndex < 0) {
        return;
      }

      const nextIndex = (currentIndex + offset + tracks.length) % tracks.length;
      selectTrack(tracks[nextIndex].id);
    },
    [currentIndex, selectTrack, tracks],
  );

  const playNext = useCallback(() => {
    selectRelativeTrack(1);
  }, [selectRelativeTrack]);

  const playPrevious = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    selectRelativeTrack(-1);
  }, [selectRelativeTrack]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handleTimeUpdate = useCallback((event: SyntheticEvent<HTMLAudioElement>) => {
    setCurrentTime(event.currentTarget.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback((event: SyntheticEvent<HTMLAudioElement>) => {
    setDuration(event.currentTarget.duration);
  }, []);

  const handleEnded = useCallback(() => {
    if (currentIndex < tracks.length - 1) {
      selectRelativeTrack(1);
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentIndex, selectRelativeTrack, tracks.length]);

  return {
    audioRef,
    initialAudioSource,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    error,
    setVolume,
    setIsPlaying,
    setError,
    togglePlayback,
    selectTrack,
    playNext,
    playPrevious,
    seek,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
  };
}
