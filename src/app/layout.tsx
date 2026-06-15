import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Terreno 3D — Sauce, Corrientes',
  description: 'Visualizacion 3D del terreno (40 x 13 m).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
