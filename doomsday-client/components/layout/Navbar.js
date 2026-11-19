"use client";
import { usePathname } from "next/navigation";
import { Menu, User } from "lucide-react";

const titles = {
  "/movies": "My Movies",
  "/rewatch-plan": "Rewatch Plan",
  "/booking": "Cinemas & Booking",
  "/": "My Movies",
};

const subtitles = {
  "/movies": "Manage your MCU collection",
  "/rewatch-plan": "Plan your ultimate rewatch",
  "/booking": "Manage cinemas and book your watch party",
  "/": "Manage your MCU collection",
};

export default function Navbar({ onMenuClick }) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Doomsday Ready";
  const subtitle = subtitles[pathname] ?? "";

  return (
    <header className="h-16 bg-zinc-950/80 backdrop-blur border-b border-zinc-800/60 flex items-center px-6 gap-4 sticky top-0 z-10">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-zinc-400 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-white font-bold text-base leading-tight truncate">{title}</h1>
        <p className="text-zinc-500 text-xs leading-tight hidden sm:block">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <User className="w-4 h-4 text-zinc-400" />
        </div>
      </div>
    </header>
  );
}
