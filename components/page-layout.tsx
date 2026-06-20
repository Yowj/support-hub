import { ReactNode } from "react";
import { Headset } from "lucide-react";

interface PageLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function PageLayout({ title, subtitle, children }: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 sticky top-0 z-10 shadow-sm border-b border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4 max-w-7xl py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <Headset className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
                  SupportHub
                </span>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-600 hidden sm:block" />
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{title}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-6xl py-6">
        {children}
      </div>
    </main>
  );
}
