import AuthButton from "@/components/auth-button";
import { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function PageLayout({ title, subtitle, children }: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{subtitle}</p>
            </div>
            <AuthButton />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-6xl">
        {children}
      </div>
    </main>
  );
}
