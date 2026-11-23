"use client";

import { useEffect, useState } from "react";
import type { Track } from "@/src/entities/track/model/types";

interface MusicResponse {
  tracks: Track[];
  warning?: string;
  error?: string;
}

export function usePopularTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTracks() {
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
        const feedPath = `${basePath}/music.json`;
        const response = await fetch(feedPath, { signal: controller.signal });
        const data = (await response.json()) as MusicResponse;

        if (!response.ok) {
          throw new Error(data.error || "Не удалось загрузить музыкальные подборки.");
        }

        setTracks(data.tracks);
        setError(data.warning ?? "");
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }

        setTracks([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Не удалось загрузить музыкальные подборки.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadTracks();

    return () => controller.abort();
  }, []);

  return { tracks, error, isLoading };
}
