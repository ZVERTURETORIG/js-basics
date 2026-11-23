"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { DEFAULT_COVER } from "@/src/entities/track/lib/covers";
import { formatTime } from "@/src/entities/track/lib/formatTime";
import { STARTER_TRACKS } from "@/src/entities/track/model/starterTracks";
import type { Track, TrackGenre } from "@/src/entities/track/model/types";
import { usePopularTracks } from "@/src/features/charts/model/usePopularTracks";
import { useAudioPlayer } from "@/src/features/playback/model/useAudioPlayer";

type IconName =
  | "library"
  | "music"
  | "next"
  | "pause"
  | "play"
  | "previous"
  | "premium"
  | "volume";

function Icon({
  name,
  size = 18,
}: {
  name: IconName;
  size?: number;
}) {
  const paths: Record<IconName, ReactNode> = {
    library: (
      <>
        <path d="M4 19V5m5 14V5m5 14V5m5 14V5" />
        <path d="M2 19h20M2 5h20" />
      </>
    ),
    music: <path d="M9 18V5l12-2v13M9 18a3 2 0 1 1-3-2 3 2 0 0 1 3 2Zm12-2a3 2 0 1 1-3-2 3 2 0 0 1 3 2Z" />,
    next: (
      <>
        <path d="m5 5 10 7-10 7V5Z" fill="currentColor" stroke="none" />
        <path d="M19 5v14" />
      </>
    ),
    pause: (
      <>
        <path d="M8 5h3v14H8zM15 5h3v14h-3z" fill="currentColor" stroke="none" />
      </>
    ),
    play: <path d="m8 5 12 7-12 7V5Z" fill="currentColor" stroke="none" />,
    previous: (
      <>
        <path d="m19 5-10 7 10 7V5Z" fill="currentColor" stroke="none" />
        <path d="M5 5v14" />
      </>
    ),
    premium: (
      <>
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
      </>
    ),
    volume: (
      <>
        <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
        <path d="M17 9a5 5 0 0 1 0 6m2-9a9 9 0 0 1 0 12" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function CoverArt({ cover, isPlaying }: { cover: string; isPlaying: boolean }) {
  return (
    <div
      className={`album-art${isPlaying ? " is-playing" : ""}`}
      style={{ backgroundImage: `linear-gradient(180deg, transparent 55%, rgb(0 0 0 / 36%)), url("${cover}")` }}
      aria-hidden="true"
    >
      <span className="cover-caption">ZVERTURET<br />SESSIONS</span>
      <span className="cover-status">{isPlaying ? "ИГРАЕТ" : "ВАША МУЗЫКА"}</span>
    </div>
  );
}

function TrackRow({
  track,
  index,
  isSelected,
  isPlaying,
  onSelect,
}: {
  track: Track;
  index: number;
  isSelected: boolean;
  isPlaying: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`track-row${isSelected ? " is-selected" : ""}`}
      type="button"
      aria-current={isSelected ? "true" : undefined}
      onClick={onSelect}
    >
      <span
        className="track-cover"
        style={{ backgroundImage: `url("${track.cover}")` }}
        aria-hidden="true"
      />
      <span className="track-details">
        <span className="track-name">{track.title}</span>
        <span className="track-subtitle">{track.artist} · {track.genre}</span>
      </span>
      <span className="track-number">
        {isSelected && isPlaying ? <Icon name="volume" size={15} /> : `${index + 1}`.padStart(2, "0")}
      </span>
    </button>
  );
}

export default function MusicPlayer() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<TrackGenre | "Все">("Все");
  const popular = usePopularTracks();
  const tracks = useMemo(
    () => [...STARTER_TRACKS, ...popular.tracks],
    [popular.tracks],
  );
  const { audioRef, ...player } = useAudioPlayer(tracks);

  const filteredTracks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return tracks.filter((track) => {
      const matchesSearch = `${track.title} ${track.artist} ${track.genre}`
        .toLocaleLowerCase()
        .includes(query);
      const matchesGenre = selectedGenre === "Все" || track.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [search, selectedGenre, tracks]);

  const currentTrack = player.currentTrack;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const ambienceStyle: CSSProperties & { "--ambience-intensity": number } = {
    "--ambience-intensity": player.isPlaying ? 0.24 + player.volume * 0.35 : 0.14,
  };

  return (
    <main className="player-shell">
      <div
        className={`audio-ambience${player.isPlaying ? " is-playing" : ""}`}
        style={ambienceStyle}
        aria-hidden="true"
      >
        <span className="ambience-orb ambience-orb-one" />
        <span className="ambience-orb ambience-orb-two" />
        <span className="ambience-orb ambience-orb-three" />
      </div>
      <aside className="sidebar">
        <div className="brand">
          <Image
            className="brand-mark"
            src={`${basePath}/zverturet-logo.svg`}
            alt=""
            width={38}
            height={38}
            priority
          />
          <span>ZVERTURET</span>
        </div>

        <p className="side-label">Меню</p>
        <Link className="side-link is-active" href="/" aria-current="page">
          <Icon name="library" />
          <span>Моя библиотека</span>
        </Link>
        <Link className="side-link" href="#library">
          <Icon name="music" />
          <span>Хиты 2026</span>
        </Link>
        <Link className="side-link" href="/plans">
          <Icon name="premium" />
          <span>Подписки</span>
        </Link>

        <div className="library-heading">
          <p className="side-label">Треки</p>
          <span className="count-badge">{tracks.length}</span>
        </div>

        <div className="sidebar-spacer" />
        <div className="local-note">
          <strong>Музыка без лишнего</strong>
          Демо, хиты 2026 года и подборка фонка.
        </div>
      </aside>

      <section className="main-panel" aria-label="Музыкальный плеер">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="online-indicator" />
            ЛИЧНАЯ КОЛЛЕКЦИЯ
          </div>
        </header>

        <div className="content-grid">
          <section className="now-playing" aria-label="Сейчас играет">
            <div className="section-heading">
              <p className="section-eyebrow">В моменте</p>
              <span className="section-index">01 / 01</span>
            </div>
            <CoverArt cover={currentTrack?.cover ?? DEFAULT_COVER} isPlaying={player.isPlaying} />
            <div className="now-playing-meta">
              <div>
                <h1 className="track-title">{currentTrack?.title ?? "Твоя музыка"}</h1>
                <p className="track-artist">
                  {currentTrack
                    ? `${currentTrack.artist} · ${currentTrack.genre}`
                    : "Подборка загружается"}
                </p>
              </div>
              <span className="sound-wave" aria-hidden="true">
                <i /><i /><i /><i /><i />
              </span>
            </div>
          </section>

          <section className="playlist-panel" id="library" aria-labelledby="playlist-title">
            <div className="playlist-header">
              <div>
                <p className="section-eyebrow">Твоя коллекция</p>
                <h2 id="playlist-title">Библиотека<span className="title-dot">.</span></h2>
                <p className="playlist-count">{tracks.length} {tracks.length === 1 ? "трек" : "треков"}</p>
              </div>
              <label className="sr-only" htmlFor="track-search">
                Поиск по трекам
              </label>
              <input
                className="search-field"
                id="track-search"
                type="search"
                placeholder="Найти трек..."
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
              />
            </div>

            <p className="library-hint">
              {popular.isLoading
                ? "Загружаем свежие релизы и фонк..."
                : "Демо и короткие MP3-превью из чарта 2026 года и подборки фонка."}
            </p>

            <div className="genre-filters" role="group" aria-label="Фильтр по жанру">
              {(["Все", "Хиты 2026", "Фонк", "Электроника", "Техно"] as const).map((genre) => (
                <button
                  key={genre}
                  className={`genre-filter${selectedGenre === genre ? " is-active" : ""}`}
                  type="button"
                  aria-pressed={selectedGenre === genre}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>

            {popular.error ? <p className="notice">{popular.error}</p> : null}

            {filteredTracks.length > 0 ? (
              <div className="track-list" aria-label="Список треков">
                {filteredTracks.map((track) => {
                  const index = tracks.findIndex((item) => item.id === track.id);

                  return (
                    <TrackRow
                      key={track.id}
                      track={track}
                      index={index}
                      isSelected={track.id === currentTrack?.id}
                      isPlaying={player.isPlaying}
                      onSelect={() => player.selectTrack(track.id)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="empty-playlist">
                {popular.isLoading
                  ? "Загружаем музыку..."
                  : selectedGenre === "Фонк" || selectedGenre === "Хиты 2026"
                    ? "Не удалось найти треки в этой подборке. Попробуй обновить страницу."
                    : "Ничего не нашлось. Попробуй изменить запрос или жанр."}
              </div>
            )}
          </section>
        </div>

        <footer className="player-controls">
          <div className="progress-row">
            <span>{formatTime(player.currentTime)}</span>
            <label className="sr-only" htmlFor="track-progress">
              Позиция воспроизведения
            </label>
            <input
              className="range-input"
              id="track-progress"
              type="range"
              min="0"
              max={player.duration || 0}
              step="0.1"
              value={Math.min(player.currentTime, player.duration || 0)}
              disabled={!currentTrack || !player.duration}
              onChange={(event) => player.seek(Number(event.currentTarget.value))}
            />
            <span>{formatTime(player.duration)}</span>
          </div>

          <div className="control-row">
            <span className="volume-control">
              <Icon name="volume" size={17} />
              <label className="sr-only" htmlFor="volume-control">
                Громкость
              </label>
              <input
                className="range-input"
                id="volume-control"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={player.volume}
                onChange={(event) => player.setVolume(Number(event.currentTarget.value))}
              />
            </span>
            <button
              className="transport-button"
              type="button"
              aria-label="Предыдущий трек"
              disabled={!currentTrack}
              onClick={player.playPrevious}
            >
              <Icon name="previous" size={21} />
            </button>
            <button
              className="play-button"
              type="button"
              aria-label={player.isPlaying ? "Пауза" : "Воспроизвести"}
              disabled={!currentTrack}
              onClick={player.togglePlayback}
            >
              <Icon name={player.isPlaying ? "pause" : "play"} size={21} />
            </button>
            <button
              className="transport-button"
              type="button"
              aria-label="Следующий трек"
              disabled={!currentTrack}
              onClick={player.playNext}
            >
              <Icon name="next" size={21} />
            </button>
          </div>
          {player.error ? <p className="notice">{player.error}</p> : null}
        </footer>

        <audio
          ref={audioRef}
          src={player.initialAudioSource}
          preload="metadata"
          onPlay={() => {
            player.setIsPlaying(true);
            player.setError("");
          }}
          onPause={() => player.setIsPlaying(false)}
          onError={() => {
            if (currentTrack) {
              player.setError("Не удалось загрузить этот аудиофайл.");
            }
          }}
          onTimeUpdate={player.handleTimeUpdate}
          onLoadedMetadata={player.handleLoadedMetadata}
          onEnded={player.handleEnded}
        />
      </section>

    </main>
  );
}
