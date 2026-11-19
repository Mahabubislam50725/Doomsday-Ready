"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, ListOrdered, Ticket, X } from "lucide-react";

const navItems = [
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/rewatch-plan", label: "Rewatch Plan", icon: ListOrdered },
  { href: "/booking", label: "Cinema Booking", icon: Ticket },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-950 border-r border-zinc-800/60 z-30 flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/60">
          <Link href="/movies" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              ☢
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">Doomsday</p>
              <p className="text-red-500 text-xs font-medium leading-tight">Ready</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-zinc-600 text-xs font-semibold uppercase tracking-widest px-3 mb-3">Navigation</p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href === "/movies" && pathname === "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? "bg-red-600/15 text-red-400 border border-red-600/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-red-400" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                {label}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-800/60">
          <p className="text-zinc-600 text-xs">Avengers: Doomsday</p>
          <p className="text-zinc-700 text-xs">Coming Soon ☢</p>
        </div>
      </aside>
    </>
  );
}
