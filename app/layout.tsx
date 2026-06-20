import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { getUserProfile } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupportHub - Modern Customer Support Platform",
  description: "A modern customer support platform with real-time chat, smart routing, and powerful analytics",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getUserProfile();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider user={user} profile={profile}>
            <Navbar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
