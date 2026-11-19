import { Geist } from "next/font/google";
import "./globals.css";
import DashboardShell from "@/components/layout/DashboardShell";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata = {
  title: "Doomsday Ready",
  description: "Plan your MCU rewatch before Avengers: Doomsday",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-zinc-950 text-zinc-100 font-sans antialiased">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
