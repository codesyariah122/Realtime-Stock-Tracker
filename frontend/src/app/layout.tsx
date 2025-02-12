"use client";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body>
          {children}

          <footer className="w-full bg-gray-900 text-white text-center py-4 mt-10">
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <a href="https://codesyariah-webdev.vercel.app">
                Codesyariah Webdevelopment
              </a>
              . Made with❤️ by{" "}
              <a href="https://github.com/codesyariah122">Codesyariah122</a>.
            </p>
          </footer>
          <ReactQueryDevtools initialIsOpen={false} />
        </body>
      </html>
    </QueryClientProvider>
  );
}
