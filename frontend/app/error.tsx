"use client";

import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="h-screen px-4 flex items-center justify-center">
            <div className="w-full max-w-3xl grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-4 lg:gap-6 items-center">
            <div className="relative rounded-2xl overflow-hidden">
                <img
                    src="/error.png"
                    alt="Error"
                    className="h-36 w-36 object-contain"
                />
            </div>
            <div className="text-center lg:text-left">
                <h1 className="text-6xl font-bold mb-4">Server Error</h1>
                <p className="text-xl text-gray-600 mb-8">
                    We're sorry, something went wrong on our end.
                </p>
                <Link
              href="/"
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
            </div>
            </div>
        </div>
  );
}