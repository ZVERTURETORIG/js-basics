import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = join(projectRoot, "public", "music.json");

async function fetchDeezer(path) {
  const response = await fetch(`https://api.deezer.com${path}`);
  if (!response.ok) {
    throw new Error(`Deezer returned ${response.status} for ${path}`);
  }
  return response.json();
}

const [chartResult, phonkResult] = await Promise.allSettled([
  fetchDeezer("/chart/0/tracks?limit=50"),
  fetchDeezer("/search?q=phonk&limit=25"),
]);
const warnings = [];
let chartTracks = [];
let phonkTracks = [];

if (chartResult.status === "fulfilled") {
  const chart = chartResult.value.data.filter((track) => track.preview);
  const albumIds = [...new Set(chart.map((track) => track.album.id))].slice(0, 35);
  const albumResults = await Promise.allSettled(
    albumIds.map(async (albumId) => ({
      albumId,
      details: await fetchDeezer(`/album/${albumId}`),
    })),
  );
  const releaseDates = new Map();

  for (const result of albumResults) {
    if (result.status === "fulfilled") {
      releaseDates.set(result.value.albumId, result.value.details.release_date);
    }
  }

  if (albumResults.some((result) => result.status === "rejected")) {
    warnings.push("Не для всех хитов удалось проверить год релиза.");
  }

  chartTracks = chart.flatMap((track) => {
    if (!releaseDates.get(track.album.id)?.startsWith("2026")) return [];
    return [{
      id: `chart-${track.id}`,
      title: track.title,
      artist: `${track.artist.name} · 2026`,
      src: track.preview,
      cover: track.album.cover_medium,
      genre: "Хиты 2026",
    }];
  });
} else {
  warnings.push("Популярные релизы сейчас недоступны.");
}

if (phonkResult.status === "fulfilled") {
  phonkTracks = phonkResult.value.data
    .filter((track) => track.preview)
    .slice(0, 15)
    .map((track) => ({
      id: `phonk-${track.id}`,
      title: track.title,
      artist: track.artist.name,
      src: track.preview,
      cover: track.album.cover_medium,
      genre: "Фонк",
    }));
} else {
  warnings.push("Подборка фонка сейчас недоступна.");
}

const tracks = [...chartTracks, ...phonkTracks];
if (tracks.length === 0) {
  throw new Error("Deezer returned no playable tracks; refusing to publish an empty music list.");
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ tracks, warning: warnings.join(" ") }, null, 2)}\n`);
console.log(`Prepared ${tracks.length} playable tracks for static hosting.`);
