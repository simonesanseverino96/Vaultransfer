const fs = require('fs');
const path = require('path');

const layouts = [
  { path: 'app/faq/layout.tsx', route: '/faq', tTitle: "t('faq.title') + ' ' + t('faq.titleAccent')", tDesc: "t('metadata.description')" },
  { path: 'app/login/layout.tsx', route: '/login', tTitle: "t('login.title')", tDesc: "t('login.subtitle')" },
  { path: 'app/pricing/layout.tsx', route: '/pricing', tTitle: "t('pricing.title')", tDesc: "t('pricing.subtitle')" }
];

const basePath = 'c:/Users/simon/Desktop/wa/vaultransfer';

layouts.forEach(l => {
  const file = path.join(basePath, l.path);
  
  const content = `import { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  const locale = await getLocale()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaultransfer.com'
  
  return {
    title: ${l.tTitle},
    description: ${l.tDesc},
    alternates: {
      canonical: locale === 'en' ? \`\${baseUrl}${l.route}\` : \`\${baseUrl}${l.route}?lang=\${locale}\`,
    }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
`;

  fs.writeFileSync(file, content);
});

console.log('Layouts created');
