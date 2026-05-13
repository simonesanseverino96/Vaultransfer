const fs = require('fs');
let code = fs.readFileSync('lib/email.ts', 'utf8');

const regex = /const emailTranslations: Record<string, \{([\s\S]*?)\}> = \{([\s\S]*?)\n\}\n\nfunction getT/g;
const match = regex.exec(code);

if (match) {
  let [fullMatch, interfaceContent, valuesContent] = match;

  interfaceContent = interfaceContent + `  expirySubject: string\n  expiryTitle: string\n  expirySubtitle: string\n  storageSubject: string\n  storageTitle: string\n  storageSubtitle: string\n`;

  // Per ogni lingua, aggiungiamo le traduzioni vuote, e per inglese quelle reali
  const langs = ['en', 'it', 'de', 'fr', 'es', 'pt', 'ja', 'zh', 'ar'];

  langs.forEach(lang => {
    const langRegex = new RegExp(`(${lang}: \\{[\\s\\S]*?dateLocale: '[^']*',\\n)(\\s*\\})`, 'g');

    valuesContent = valuesContent.replace(langRegex, (m, content, closing) => {
      let expirySubject, expiryTitle, expirySubtitle, storageSubject, storageTitle, storageSubtitle;

      if (lang === 'en') {
        expirySubject = "'Your transfer has expired — VaultTransfer'";
        expiryTitle = "'Transfer expired ⏳'";
        expirySubtitle = "'Your transfer link has expired and files have been deleted.'";
        storageSubject = "'Storage limit warning — VaultTransfer'";
        storageTitle = "'Storage limit warning ⚠️'";
        storageSubtitle = "'You have used 80% of your total storage limit.'";
      } else {
        expirySubject = "'Your transfer has expired — VaultTransfer'";
        expiryTitle = "'Transfer expired ⏳'";
        expirySubtitle = "'Your transfer link has expired and files have been deleted.'";
        storageSubject = "'Storage limit warning — VaultTransfer'";
        storageTitle = "'Storage limit warning ⚠️'";
        storageSubtitle = "'You have used 80% of your total storage limit.'";
      }

      return `${content}    expirySubject: ${expirySubject},\n    expiryTitle: ${expiryTitle},\n    expirySubtitle: ${expirySubtitle},\n    storageSubject: ${storageSubject},\n    storageTitle: ${storageTitle},\n    storageSubtitle: ${storageSubtitle},\n${closing}`;
    });
  });

  const newCode = code.replace(regex, `const emailTranslations: Record<string, {${interfaceContent}}> = {${valuesContent}\n}\n\nfunction getT`);
  fs.writeFileSync('lib/email.ts', newCode);
  console.log("Updated lib/email.ts successfully");
} else {
  console.log("Regex not matched");
}
