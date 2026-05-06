const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'app/dashboard/page.tsx', ns: 'dashboard', tTitle: "t('header.dashboard')", tDesc: "t('metadata.description')" },
  { path: 'app/faq/page.tsx', ns: 'faq', tTitle: "t('faq.title') + ' ' + t('faq.titleAccent')", tDesc: "t('metadata.description')" },
  { path: 'app/login/page.tsx', ns: 'login', tTitle: "t('login.title')", tDesc: "t('login.subtitle')" },
  { path: 'app/pricing/page.tsx', ns: 'pricing', tTitle: "t('pricing.title')", tDesc: "t('pricing.subtitle')" },
  { path: 'app/privacy/page.tsx', ns: 'footer', tTitle: "t('footer.links.privacy')", tDesc: "t('metadata.description')" },
  { path: 'app/terms/page.tsx', ns: 'footer', tTitle: "t('footer.links.terms')", tDesc: "t('metadata.description')" }
];

const basePath = 'c:/Users/simon/Desktop/wa/vaultransfer';

pages.forEach(p => {
  const file = path.join(basePath, p.path);
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('generateMetadata')) return;

  const importRegex = /import .* from ['"]next-intl['"]/g;
  const serverImportRegex = /import .* from ['"]next-intl\/server['"]/g;
  
  let imports = `import { Metadata } from 'next'\nimport { getTranslations, getLocale } from 'next-intl/server'\n`;
  
  // if next-intl/server already imported, don't duplicate it. Just add Metadata
  if (serverImportRegex.test(content)) {
    // skip injecting server imports if they exist, but we still need Metadata
    // actually, we can just prepend if they don't exist
  }
  
  const generateMetadataStr = `
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  const locale = await getLocale()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaultransfer.com'
  const route = '/${p.path.split('/')[1] === 'page.tsx' ? '' : p.path.split('/')[1]}'
  
  return {
    title: ${p.tTitle},
    description: ${p.tDesc},
    alternates: {
      canonical: locale === 'en' ? \`\${baseUrl}\${route}\` : \`\${baseUrl}\${route}?lang=\${locale}\`,
    }
  }
}

`;

  // Find the first line after imports
  let lines = content.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) {
      lastImportIdx = i;
    }
  }
  
  lines.splice(lastImportIdx + 1, 0, '\n' + imports + generateMetadataStr);
  
  fs.writeFileSync(file, lines.join('\n'));
});

// For download/[token]/page.tsx
const downloadPath = path.join(basePath, 'app/download/[token]/page.tsx');
let dlContent = fs.readFileSync(downloadPath, 'utf8');
if (!dlContent.includes('alternates:')) {
  dlContent = dlContent.replace(/return \{\n\s*title: 'Download — VaultTransfer',\n\s*description: t\('description'\),\n\s*\}/, `const locale = await getLocale()\n  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaultransfer.com'\n  return {\n    title: 'Download — VaultTransfer',\n    description: t('description'),\n    alternates: {\n      canonical: locale === 'en' ? \`\${baseUrl}/download/token\` : \`\${baseUrl}/download/token?lang=\${locale}\`\n    }\n  }`);
  dlContent = dlContent.replace(/import { getTranslations } from 'next-intl\/server'/, `import { getTranslations, getLocale } from 'next-intl/server'`);
  fs.writeFileSync(downloadPath, dlContent);
}

console.log('Script completed');
