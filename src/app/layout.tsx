'use client';
import type { Metadata } from "next";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { UISettingsProvider } from "@/contexts/UISettingsContext";
import { ThreadProvider } from "@/contexts/ThreadContext";
import "./globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  }
});

export const metadata: Metadata = {
  title: "NextJS Agent RAG",
  description: "A Agent RAG application using NextJS, React, TailwindCSS, LangGraph",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        {/* QueryClient Context */}
        <QueryClientProvider client={queryClient}>
          {/* UI Setting Context */}
          <UISettingsProvider>
            {/* Thread Context */}
            <ThreadProvider>
              {children}
            </ThreadProvider>
          </UISettingsProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
