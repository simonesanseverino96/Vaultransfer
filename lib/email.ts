import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'VaultTransfer <noreply@vaultransfer.com>'

// Traduzioni per le email
const emailTranslations: Record<string, {
  downloadSubject: string
  downloadTitle: string
  downloadSubtitle: string
  fileLabel: string
  downloadLabel: string
  limitReached: string
  viewTransfer: string
  downloadFooter: string
  uploadSubject: string
  uploadTitle: string
  uploadSubtitle: string
  linkLabel: string
  filesLabel: string
  expiresLabel: string
  passwordProtected: string
  openLink: string
  uploadFooter: string
  dateLocale: string
}> = {
  en: {
    downloadSubject: 'Your file has been downloaded — VaultTransfer',
    downloadTitle: 'Your file was downloaded! 📥',
    downloadSubtitle: 'Someone downloaded your transfer.',
    fileLabel: 'File',
    downloadLabel: 'Downloads',
    limitReached: '— <strong>Limit reached</strong>',
    viewTransfer: 'View transfer →',
    downloadFooter: 'You received this email because you entered your address during upload.',
    uploadSubject: 'Your transfer is ready — VaultTransfer',
    uploadTitle: 'Transfer ready! 🎉',
    uploadSubtitle: 'Your download link is ready to share.',
    linkLabel: 'Download link',
    filesLabel: 'Files',
    expiresLabel: 'Expires on',
    passwordProtected: '🔑 Password protected',
    openLink: 'Open link →',
    uploadFooter: 'You received this email because you entered your address during upload.',
    dateLocale: 'en-US',
  },
  it: {
    downloadSubject: 'Il tuo file è stato scaricato — VaultTransfer',
    downloadTitle: 'Il tuo file è stato scaricato! 📥',
    downloadSubtitle: 'Qualcuno ha scaricato il tuo trasferimento.',
    fileLabel: 'File',
    downloadLabel: 'Download',
    limitReached: '— <strong>Limite raggiunto</strong>',
    viewTransfer: 'Vedi il trasferimento →',
    downloadFooter: 'Hai ricevuto questa email perché hai inserito il tuo indirizzo durante l\'upload.',
    uploadSubject: 'Il tuo trasferimento è pronto — VaultTransfer',
    uploadTitle: 'Trasferimento pronto! 🎉',
    uploadSubtitle: 'Il tuo link di download è pronto da condividere.',
    linkLabel: 'Link di download',
    filesLabel: 'File',
    expiresLabel: 'Scade il',
    passwordProtected: '🔑 Protetto da password',
    openLink: 'Apri il link →',
    uploadFooter: 'Hai ricevuto questa email perché hai inserito il tuo indirizzo durante l\'upload.',
    dateLocale: 'it-IT',
  },
  de: {
    downloadSubject: 'Ihre Datei wurde heruntergeladen — VaultTransfer',
    downloadTitle: 'Ihre Datei wurde heruntergeladen! 📥',
    downloadSubtitle: 'Jemand hat Ihre Übertragung heruntergeladen.',
    fileLabel: 'Datei',
    downloadLabel: 'Downloads',
    limitReached: '— <strong>Limit erreicht</strong>',
    viewTransfer: 'Übertragung ansehen →',
    downloadFooter: 'Sie haben diese E-Mail erhalten, weil Sie Ihre Adresse beim Upload angegeben haben.',
    uploadSubject: 'Ihre Übertragung ist bereit — VaultTransfer',
    uploadTitle: 'Übertragung bereit! 🎉',
    uploadSubtitle: 'Ihr Download-Link ist bereit zum Teilen.',
    linkLabel: 'Download-Link',
    filesLabel: 'Dateien',
    expiresLabel: 'Läuft ab am',
    passwordProtected: '🔑 Passwortgeschützt',
    openLink: 'Link öffnen →',
    uploadFooter: 'Sie haben diese E-Mail erhalten, weil Sie Ihre Adresse beim Upload angegeben haben.',
    dateLocale: 'de-DE',
  },
  fr: {
    downloadSubject: 'Votre fichier a été téléchargé — VaultTransfer',
    downloadTitle: 'Votre fichier a été téléchargé ! 📥',
    downloadSubtitle: 'Quelqu\'un a téléchargé votre transfert.',
    fileLabel: 'Fichier',
    downloadLabel: 'Téléchargements',
    limitReached: '— <strong>Limite atteinte</strong>',
    viewTransfer: 'Voir le transfert →',
    downloadFooter: 'Vous avez reçu cet e-mail car vous avez saisi votre adresse lors du téléchargement.',
    uploadSubject: 'Votre transfert est prêt — VaultTransfer',
    uploadTitle: 'Transfert prêt ! 🎉',
    uploadSubtitle: 'Votre lien de téléchargement est prêt à être partagé.',
    linkLabel: 'Lien de téléchargement',
    filesLabel: 'Fichiers',
    expiresLabel: 'Expire le',
    passwordProtected: '🔑 Protégé par mot de passe',
    openLink: 'Ouvrir le lien →',
    uploadFooter: 'Vous avez reçu cet e-mail car vous avez saisi votre adresse lors du téléchargement.',
    dateLocale: 'fr-FR',
  },
  es: {
    downloadSubject: 'Tu archivo ha sido descargado — VaultTransfer',
    downloadTitle: '¡Tu archivo fue descargado! 📥',
    downloadSubtitle: 'Alguien descargó tu transferencia.',
    fileLabel: 'Archivo',
    downloadLabel: 'Descargas',
    limitReached: '— <strong>Límite alcanzado</strong>',
    viewTransfer: 'Ver transferencia →',
    downloadFooter: 'Recibiste este correo porque ingresaste tu dirección durante la carga.',
    uploadSubject: 'Tu transferencia está lista — VaultTransfer',
    uploadTitle: '¡Transferencia lista! 🎉',
    uploadSubtitle: 'Tu enlace de descarga está listo para compartir.',
    linkLabel: 'Enlace de descarga',
    filesLabel: 'Archivos',
    expiresLabel: 'Expira el',
    passwordProtected: '🔑 Protegido con contraseña',
    openLink: 'Abrir enlace →',
    uploadFooter: 'Recibiste este correo porque ingresaste tu dirección durante la carga.',
    dateLocale: 'es-ES',
  },
  pt: {
    downloadSubject: 'O seu ficheiro foi descarregado — VaultTransfer',
    downloadTitle: 'O seu ficheiro foi descarregado! 📥',
    downloadSubtitle: 'Alguém descarregou a sua transferência.',
    fileLabel: 'Ficheiro',
    downloadLabel: 'Transferências',
    limitReached: '— <strong>Limite atingido</strong>',
    viewTransfer: 'Ver transferência →',
    downloadFooter: 'Recebeu este e-mail porque inseriu o seu endereço durante o envio.',
    uploadSubject: 'A sua transferência está pronta — VaultTransfer',
    uploadTitle: 'Transferência pronta! 🎉',
    uploadSubtitle: 'O seu link de transferência está pronto para partilhar.',
    linkLabel: 'Link de transferência',
    filesLabel: 'Ficheiros',
    expiresLabel: 'Expira em',
    passwordProtected: '🔑 Protegido por palavra-passe',
    openLink: 'Abrir link →',
    uploadFooter: 'Recebeu este e-mail porque inseriu o seu endereço durante o envio.',
    dateLocale: 'pt-PT',
  },
  ja: {
    downloadSubject: 'ファイルがダウンロードされました — VaultTransfer',
    downloadTitle: 'ファイルがダウンロードされました！ 📥',
    downloadSubtitle: '誰かがあなたの転送をダウンロードしました。',
    fileLabel: 'ファイル',
    downloadLabel: 'ダウンロード',
    limitReached: '— <strong>上限に達しました</strong>',
    viewTransfer: '転送を表示 →',
    downloadFooter: 'アップロード時にメールアドレスを入力したため、このメールが届きました。',
    uploadSubject: '転送の準備ができました — VaultTransfer',
    uploadTitle: '転送準備完了！ 🎉',
    uploadSubtitle: 'ダウンロードリンクを共有する準備ができました。',
    linkLabel: 'ダウンロードリンク',
    filesLabel: 'ファイル',
    expiresLabel: '有効期限',
    passwordProtected: '🔑 パスワード保護あり',
    openLink: 'リンクを開く →',
    uploadFooter: 'アップロード時にメールアドレスを入力したため、このメールが届きました。',
    dateLocale: 'ja-JP',
  },
  zh: {
    downloadSubject: '您的文件已被下载 — VaultTransfer',
    downloadTitle: '您的文件已被下载！ 📥',
    downloadSubtitle: '有人下载了您的传输文件。',
    fileLabel: '文件',
    downloadLabel: '下载次数',
    limitReached: '— <strong>已达上限</strong>',
    viewTransfer: '查看传输 →',
    downloadFooter: '您收到此邮件是因为您在上传时填写了电子邮件地址。',
    uploadSubject: '您的传输已准备就绪 — VaultTransfer',
    uploadTitle: '传输准备就绪！ 🎉',
    uploadSubtitle: '您的下载链接已准备好分享。',
    linkLabel: '下载链接',
    filesLabel: '文件',
    expiresLabel: '到期日',
    passwordProtected: '🔑 密码保护',
    openLink: '打开链接 →',
    uploadFooter: '您收到此邮件是因为您在上传时填写了电子邮件地址。',
    dateLocale: 'zh-CN',
  },
  ar: {
    downloadSubject: 'تم تنزيل ملفك — VaultTransfer',
    downloadTitle: 'تم تنزيل ملفك! 📥',
    downloadSubtitle: 'قام شخص ما بتنزيل ملفك.',
    fileLabel: 'الملف',
    downloadLabel: 'التنزيلات',
    limitReached: '— <strong>تم الوصول إلى الحد الأقصى</strong>',
    viewTransfer: 'عرض النقل →',
    downloadFooter: 'تلقيت هذا البريد الإلكتروني لأنك أدخلت عنوانك أثناء الرفع.',
    uploadSubject: 'نقلك جاهز — VaultTransfer',
    uploadTitle: 'النقل جاهز! 🎉',
    uploadSubtitle: 'رابط التنزيل الخاص بك جاهز للمشاركة.',
    linkLabel: 'رابط التنزيل',
    filesLabel: 'الملفات',
    expiresLabel: 'ينتهي في',
    passwordProtected: '🔑 محمي بكلمة مرور',
    openLink: 'فتح الرابط →',
    uploadFooter: 'تلقيت هذا البريد الإلكتروني لأنك أدخلت عنوانك أثناء الرفع.',
    dateLocale: 'ar-SA',
  },
}

function getT(locale?: string) {
  return emailTranslations[locale ?? 'en'] ?? emailTranslations['en']
}

// Email: notifica download al mittente
export async function sendDownloadNotification({
  senderEmail,
  filename,
  downloadCount,
  maxDownloads,
  token,
  locale,
}: {
  senderEmail: string
  filename: string
  downloadCount: number
  maxDownloads: number | null
  token: string
  locale?: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaultransfer.com'
  const t = getT(locale)

  await resend.emails.send({
    from: FROM,
    to: senderEmail,
    subject: t.downloadSubject,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: monospace; background: #0a0a0f; color: #f4f1eb; padding: 40px 20px; margin: 0;">
          <div style="max-width: 480px; margin: 0 auto;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 32px;">
              <div style="width: 32px; height: 32px; background: #00e5a0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="color: #0a0a0f; font-size: 16px;">↓</span>
              </div>
              <span style="font-size: 18px; font-weight: 700; color: #f4f1eb;">VaultTransfer</span>
            </div>

            <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px 0; color: #f4f1eb;">
              ${t.downloadTitle}
            </h1>
            <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 14px; line-height: 1.6;">
              ${t.downloadSubtitle}
            </p>

            <div style="background: #12121a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em;">${t.fileLabel}</p>
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #f4f1eb;">${filename}</p>

              <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em;">${t.downloadLabel}</p>
              <p style="margin: 0; font-size: 15px; color: #00e5a0;">
                ${downloadCount} ${maxDownloads ? `/ ${maxDownloads}` : ''}
                ${maxDownloads && downloadCount >= maxDownloads ? t.limitReached : ''}
              </p>
            </div>

            <a href="${appUrl}/download/${token}"
               style="display: inline-block; background: #00e5a0; color: #0a0a0f; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; margin-bottom: 32px;">
              ${t.viewTransfer}
            </a>

            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0 0 24px 0;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              ${t.downloadFooter}<br>
              <a href="${appUrl}" style="color: #00e5a0;">vaultransfer.com</a>
            </p>
          </div>
        </body>
      </html>
    `,
  })
}

// Email: conferma upload al mittente
export async function sendUploadConfirmation({
  senderEmail,
  fileCount,
  totalSize,
  expiresAt,
  token,
  hasPassword,
  locale,
}: {
  senderEmail: string
  fileCount: number
  totalSize: number
  expiresAt: string
  token: string
  hasPassword: boolean
  locale?: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaultransfer.com'
  const t = getT(locale)
  const downloadUrl = `${appUrl}/download/${token}`
  const expiryDate = new Date(expiresAt).toLocaleDateString(t.dateLocale, {
    day: 'numeric', month: 'long', year: 'numeric'
  })
  const sizeMB = (totalSize / (1024 * 1024)).toFixed(1)

  await resend.emails.send({
    from: FROM,
    to: senderEmail,
    subject: t.uploadSubject,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: monospace; background: #0a0a0f; color: #f4f1eb; padding: 40px 20px; margin: 0;">
          <div style="max-width: 480px; margin: 0 auto;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 32px;">
              <div style="width: 32px; height: 32px; background: #00e5a0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="color: #0a0a0f; font-size: 16px;">↓</span>
              </div>
              <span style="font-size: 18px; font-weight: 700; color: #f4f1eb;">VaultTransfer</span>
            </div>

            <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px 0; color: #f4f1eb;">
              ${t.uploadTitle}
            </h1>
            <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 14px; line-height: 1.6;">
              ${t.uploadSubtitle}
            </p>

            <div style="background: #12121a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em;">${t.linkLabel}</p>
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #00e5a0; word-break: break-all;">${downloadUrl}</p>

              <div style="display: flex; gap: 24px;">
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em;">${t.filesLabel}</p>
                  <p style="margin: 0; font-size: 14px; color: #f4f1eb;">${fileCount} (${sizeMB} MB)</p>
                </div>
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em;">${t.expiresLabel}</p>
                  <p style="margin: 0; font-size: 14px; color: #f4f1eb;">${expiryDate}</p>
                </div>
              </div>

              ${hasPassword ? `
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
                <p style="margin: 0; font-size: 13px; color: #00e5a0;">${t.passwordProtected}</p>
              </div>` : ''}
            </div>

            <a href="${downloadUrl}"
               style="display: inline-block; background: #00e5a0; color: #0a0a0f; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; margin-bottom: 32px;">
              ${t.openLink}
            </a>

            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0 0 24px 0;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              ${t.uploadFooter}<br>
              <a href="${appUrl}" style="color: #00e5a0;">vaultransfer.com</a>
            </p>
          </div>
        </body>
      </html>
    `,
  })
}