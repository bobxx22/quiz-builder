import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

interface LayoutProps {
  title: string;
  children: ReactNode;
}

export function Layout({ title, children }: LayoutProps) {
  const { pathname } = useRouter();

  return (
    <>
      <Head>
        <title>{`${title} - Quiz Builder`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/quizzes"
            className="shrink-0 text-lg font-bold tracking-tight whitespace-nowrap"
          >
            Quiz Builder
          </Link>
          <nav aria-label="Main" className="flex items-center gap-2">
            <Link
              href="/quizzes"
              aria-current={pathname.startsWith('/quizzes') ? 'page' : undefined}
              className="btn hover:bg-canvas aria-[current=page]:bg-canvas"
            >
              All quizzes
            </Link>
            <Link href="/create" className="btn btn-primary px-3 sm:px-4">
              New quiz
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </>
  );
}
