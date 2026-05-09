import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key')
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
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background: #f3f4f6; padding: 40px 20px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
              <tr>
                <td style="padding: 40px;">
                  
                  <!-- Header -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <table cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td width="32" height="32" style="border-radius: 8px; text-align: center; vertical-align: middle; overflow: hidden;">
                              <img src="https://vaultransfer.com/icon-192x192.png" alt="VaultTransfer" width="32" height="32" style="display: block; border: 0; outline: none; text-decoration: none;" />
                            </td>
                            <td style="padding-left: 12px;">
                              <span style="font-size: 20px; font-weight: 600; color: #09090b; letter-spacing: -0.02em;">VaultTransfer</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Title Area -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px;">
                    <tr>
                      <td>
                        <h1 style="font-size: 24px; font-weight: 600; color: #09090b; margin: 0; letter-spacing: -0.02em;">${t.downloadTitle}</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top: 8px;">
                        <p style="font-size: 15px; color: #52525b; margin: 0; line-height: 1.6;">${t.downloadSubtitle}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Card Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px; background-color: #fafafa; border: 1px solid #eaeaea; border-radius: 8px;">
                    <tr>
                      <td style="padding: 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td width="50%" valign="top">
                              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em;">${t.fileLabel}</p>
                              <p style="margin: 0; padding-top: 4px; font-size: 15px; color: #09090b; font-weight: 500;">${filename}</p>
                            </td>
                            <td width="50%" valign="top">
                              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em;">${t.downloadLabel}</p>
                              <p style="margin: 0; padding-top: 4px; font-size: 15px; color: #00c78b; font-weight: 500;">
                                ${downloadCount} ${maxDownloads ? `/ ${maxDownloads}` : ''}
                                ${maxDownloads && downloadCount >= maxDownloads ? `<span style="color: #71717a; font-weight: 400; font-size: 13px;">${t.limitReached}</span>` : ''}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px;">
                    <tr>
                      <td>
                        <a href="${appUrl}/download/${token}" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px;">${t.viewTransfer}</a>
                      </td>
                    </tr>
                  </table>

                  <!-- Footer -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 48px;">
                    <tr>
                      <td style="border-top: 1px solid #eaeaea; padding-top: 24px;">
                        <p style="margin: 0; font-size: 13px; color: #71717a; line-height: 1.5;">${t.downloadFooter}</p>
                        <p style="margin: 0; padding-top: 8px; font-size: 13px; color: #71717a;">
                          <a href="https://vaultransfer.com/privacy" style="color: #71717a; text-decoration: underline;">Privacy Policy</a>
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
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
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background: #f3f4f6; padding: 40px 20px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
              <tr>
                <td style="padding: 40px;">
                  
                  <!-- Header -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <table cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td width="32" height="32" style="border-radius: 8px; text-align: center; vertical-align: middle; overflow: hidden;">
                              <img src="https://vaultransfer.com/icon-192x192.png" alt="VaultTransfer" width="32" height="32" style="display: block; border: 0; outline: none; text-decoration: none;" />
                            </td>
                            <td style="padding-left: 12px;">
                              <span style="font-size: 20px; font-weight: 600; color: #09090b; letter-spacing: -0.02em;">VaultTransfer</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Title Area -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px;">
                    <tr>
                      <td>
                        <h1 style="font-size: 24px; font-weight: 600; color: #09090b; margin: 0; letter-spacing: -0.02em;">${t.uploadTitle}</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top: 8px;">
                        <p style="font-size: 15px; color: #52525b; margin: 0; line-height: 1.6;">${t.uploadSubtitle}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Card Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px; background-color: #fafafa; border: 1px solid #eaeaea; border-radius: 8px;">
                    <tr>
                      <td style="padding: 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td>
                              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em;">${t.linkLabel}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-top: 4px;">
                              <p style="margin: 0; font-size: 14px; color: #00c78b; word-break: break-all; font-weight: 500;">${downloadUrl}</p>
                            </td>
                          </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
                          <tr>
                            <td width="50%" valign="top">
                              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em;">${t.filesLabel}</p>
                              <p style="margin: 0; padding-top: 4px; font-size: 15px; color: #09090b; font-weight: 500;">${fileCount} (${sizeMB} MB)</p>
                            </td>
                            <td width="50%" valign="top">
                              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em;">${t.expiresLabel}</p>
                              <p style="margin: 0; padding-top: 4px; font-size: 15px; color: #09090b; font-weight: 500;">${expiryDate}</p>
                            </td>
                          </tr>
                        </table>
                        
                        ${hasPassword ? `
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 16px;">
                          <tr>
                            <td style="border-top: 1px solid #eaeaea; padding-top: 16px;">
                              <p style="margin: 0; font-size: 13px; color: #52525b; font-weight: 500;">${t.passwordProtected}</p>
                            </td>
                          </tr>
                        </table>` : ''}
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px;">
                    <tr>
                      <td>
                        <a href="${downloadUrl}" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px;">${t.openLink}</a>
                      </td>
                    </tr>
                  </table>

                  <!-- Footer -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 48px;">
                    <tr>
                      <td style="border-top: 1px solid #eaeaea; padding-top: 24px;">
                        <p style="margin: 0; font-size: 13px; color: #71717a; line-height: 1.5;">${t.uploadFooter}</p>
                        <p style="margin: 0; padding-top: 8px; font-size: 13px; color: #71717a;">
                          <a href="https://vaultransfer.com/privacy" style="color: #71717a; text-decoration: underline;">Privacy Policy</a>
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `,
  })
}