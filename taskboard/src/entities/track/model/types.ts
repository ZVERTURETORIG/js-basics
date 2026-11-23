export type TrackGenre =
  | "Электроника"
  | "Техно"
  | "Фонк"
  | "Хиты 2026";

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
  genre: TrackGenre;
}
