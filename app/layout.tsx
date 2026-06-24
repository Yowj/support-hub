import type { Metadata } from "next";
import { Inter, Instrument_Serif, Fragment_Mono } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import { getUserProfile } from "@/lib/auth";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SupportHub - Modern Customer Support Platform",
  description: "A modern customer support platform with real-time chat, smart routing, and powerful analytics",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getUserProfile();

  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${instrumentSerif.variable} ${fragmentMono.variable}`}
    >
      <body className="font-sans antialiased">
        <AuthProvider user={user} profile={profile}>
          <div className="h-screen flex flex-col">
            <ConditionalNavbar />
            <main className="flex-1 min-h-0">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
