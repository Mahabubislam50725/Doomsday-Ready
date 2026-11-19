import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata = {
  title: "Doomsday Ready",
  description: "Plan your MCU rewatch before Avengers: Doomsday",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans antialiased">
        <nav className="border-b border-zinc-800 px-6 py-4 flex gap-6 items-center">
          <span className="font-bold text-red-500 text-lg mr-4">☢ Doomsday Ready</span>
          <Link href="/" className="text-zinc-300 hover:text-white transition-colors">Movies</Link>
          <Link href="/rewatch" className="text-zinc-300 hover:text-white transition-colors">Rewatch Plan</Link>
          <Link href="/booking" className="text-zinc-300 hover:text-white transition-colors">Booking</Link>
        </nav>
        <main className="flex-1 p-6 max-w-4xl mx-auto w-full">{children}</main>
      </body>
    </html>
  );
}
