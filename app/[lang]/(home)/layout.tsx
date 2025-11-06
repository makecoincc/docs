import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { GithubInfo } from 'fumadocs-ui/components/github-info';
import type { ReactNode } from 'react';

// function docsOptions(): DocsLayoutProps {
//   return {
//     ...baseOptions(),
//     tree: source.pageTree,
//     links: [
//       {
//         type: 'custom',
//         children: (
//           <GithubInfo owner="makecoincc" repo="makecoin" className="lg:-mx-2" />
//         ),
//       },
//     ],
//   };
// }

// export default function Layout({ children }: { children: React.ReactNode }) {
//   return <DocsLayout {...docsOptions()}>{children}</DocsLayout>;
// }

// import type { ReactNode } from 'react';
// import { source } from '@/lib/source';
// import { DocsLayout } from 'fumadocs-ui/layouts/docs';
// import { baseOptions } from '@/lib/layout.shared';

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;

  return (
    <DocsLayout {...baseOptions(lang)} tree={source.pageTree[lang]}>
      {children}
    </DocsLayout>
  );
}