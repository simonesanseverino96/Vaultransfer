import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'VaultTransfer <noreply@vaultransfer.com>'

// Email: notifica download al mittente
export async function sendDownloadNotification({
  senderEmail,
  filename,
  downloadCount,
  maxDownloads,
  token,
}: {
  senderEmail: string
  filename: string
  downloadCount: number
  maxDownloads: number | null
  token: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaultransfer.com'

  await resend.emails.send({
    from: FROM,
    to: senderEmail,
    subject: `Il tuo file è stato scaricato — VaultTransfer`,
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
              Il tuo file è stato scaricato! 📥
            </h1>
            <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 14px; line-height: 1.6;">
              Qualcuno ha scaricato il tuo trasferimento.
            </p>

            <div style="background: #12121a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em;">File</p>
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #f4f1eb;">${filename}</p>

              <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em;">Download</p>
              <p style="margin: 0; font-size: 15px; color: #00e5a0;">
                ${downloadCount} ${maxDownloads ? `/ ${maxDownloads}` : ''}
                ${maxDownloads && downloadCount >= maxDownloads ? '— <strong>Limite raggiunto</strong>' : ''}
              </p>
            </div>

            <a href="${appUrl}/download/${token}"
               style="display: inline-block; background: #00e5a0; color: #0a0a0f; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; margin-bottom: 32px;">
              Vedi il trasferimento →
            </a>

            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0 0 24px 0;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Hai ricevuto questa email perché hai inserito il tuo indirizzo email durante l'upload.<br>
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
}: {
  senderEmail: string
  fileCount: number
  totalSize: number
  expiresAt: string
  token: string
  hasPassword: boolean
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vaultransfer.com'
  const downloadUrl = `${appUrl}/download/${token}`
  const expiryDate = new Date(expiresAt).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
  const sizeMB = (totalSize / (1024 * 1024)).toFixed(1)

  await resend.emails.send({
    from: FROM,
    to: senderEmail,
    subject: `Il tuo trasferimento è pronto — VaultTransfer`,
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
              Trasferimento pronto! 🎉
            </h1>
            <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 14px; line-height: 1.6;">
              Il tuo link di download è pronto da condividere.
            </p>

            <div style="background: #12121a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em;">Link di download</p>
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #00e5a0; word-break: break-all;">${downloadUrl}</p>

              <div style="display: flex; gap: 24px;">
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em;">File</p>
                  <p style="margin: 0; font-size: 14px; color: #f4f1eb;">${fileCount} file (${sizeMB} MB)</p>
                </div>
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em;">Scade il</p>
                  <p style="margin: 0; font-size: 14px; color: #f4f1eb;">${expiryDate}</p>
                </div>
              </div>

              ${hasPassword ? `
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
                <p style="margin: 0; font-size: 13px; color: #00e5a0;">🔑 Protetto da password</p>
              </div>` : ''}
            </div>

            <a href="${downloadUrl}"
               style="display: inline-block; background: #00e5a0; color: #0a0a0f; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; margin-bottom: 32px;">
              Apri il link →
            </a>

            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0 0 24px 0;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Hai ricevuto questa email perché hai inserito il tuo indirizzo durante l'upload.<br>
              <a href="${appUrl}" style="color: #00e5a0;">vaultransfer.com</a>
            </p>
          </div>
        </body>
      </html>
    `,
  })
}