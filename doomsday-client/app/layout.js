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
        <nav className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur border-b border-zinc-800 px-6 py-3 flex gap-1 items-center">
          <Link href="/" className="font-bold text-red-500 text-lg mr-5">☢ Doomsday Ready</Link>
          <Link href="/" className="text-zinc-400 hover:text-white hover:bg-zinc-800 px-3 py-1.5 rounded-lg text-sm transition-all">
            Movies
          </Link>
          <Link href="/rewatch" className="text-zinc-400 hover:text-white hover:bg-zinc-800 px-3 py-1.5 rounded-lg text-sm transition-all">
            Rewatch Plan
          </Link>
          <Link href="/booking" className="text-zinc-400 hover:text-white hover:bg-zinc-800 px-3 py-1.5 rounded-lg text-sm transition-all">
            Booking
          </Link>
        </nav>
        <main className="flex-1 p-6 max-w-4xl mx-auto w-full">{children}</main>
      </body>
    </html>
  );
}
