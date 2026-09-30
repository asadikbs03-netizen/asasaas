import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASAD IT ACADEMY — 3D Cyber Campus & Tech Academy",
  description: "Next-generation 3D Interactive Cyber Campus, Fullstack Engineering, AI, and Cybersecurity Academy.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#060913] text-slate-100 antialiased min-h-screen selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
