import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZVERTURET — музыкальный плеер",
  description: "Слушайте свою музыку в ZVERTURET.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
