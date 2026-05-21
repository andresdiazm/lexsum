import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LexSum — Gestión de Sumarios Administrativos",
  description: "Plataforma institucional de gestión documental y sumarios administrativos asistida por IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
