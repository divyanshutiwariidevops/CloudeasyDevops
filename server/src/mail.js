import nodemailer from 'nodemailer'

export function createTransporter() {
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, '')
  if (!user || !pass || user.includes('your-gmail') || pass.includes('your-gmail')) {
    throw new Error('SMTP is not configured. Update .env with SMTP_USER and SMTP_PASS.')
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  })
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const OTP_COPY = {
  login: {
    subject: 'Cloudeasy Devops Portal sign-in code · साइन-इन कोड',
    kicker: 'Sign in · साइन इन',
    title: 'Your verification code',
    en: 'Use this one-time code to sign in to Cloudeasy Devops Portal.',
    hi: 'Cloudeasy Devops Portal में साइन इन करने के लिए यह एक बार का कोड इस्तेमाल करें।',
  },
  '2fa': {
    subject: 'Cloudeasy Devops Portal 2FA code · दो-स्तरीय कोड',
    kicker: 'Two-factor · दो-स्तरीय सुरक्षा',
    title: 'Two-factor code',
    en: 'Enter this code to finish signing in.',
    hi: 'साइन इन पूरा करने के लिए यह कोड डालें।',
  },
  '2fa-setup': {
    subject: 'Enable two-factor authentication · 2FA चालू करें',
    kicker: 'Security · सुरक्षा',
    title: 'Enable 2FA',
    en: 'Use this code to turn on two-factor authentication for your account.',
    hi: 'अपने खाते पर दो-स्तरीय सुरक्षा चालू करने के लिए यह कोड इस्तेमाल करें।',
  },
  '2fa-disable': {
    subject: 'Disable two-factor authentication · 2FA बंद करें',
    kicker: 'Security · सुरक्षा',
    title: 'Disable 2FA',
    en: 'Use this code to turn off two-factor authentication for your account.',
    hi: 'अपने खाते की दो-स्तरीय सुरक्षा बंद करने के लिए यह कोड इस्तेमाल करें।',
  },
}

const ROLE_COPY = {
  Viewer: {
    en: 'Read-only access to the dashboard, projects, network, and shortcuts.',
    hi: 'डैशबोर्ड, प्रोजेक्ट, नेटवर्क और शॉर्टकट केवल पढ़ने के लिए।',
  },
  Developer: {
    en: 'Access to APIs, allowed secret values, and shortcuts.',
    hi: 'API, अनुमति वाले सीक्रेट और शॉर्टकट तक पहुँच।',
  },
  DevOps: {
    en: 'Access to infrastructure, secrets, and project management.',
    hi: 'इंफ्रास्ट्रक्चर, सीक्रेट और प्रोजेक्ट मैनेजमेंट तक पहुँच।',
  },
  Admin: {
    en: 'Full workspace access, including invitations and settings.',
    hi: 'पूरा वर्कस्पेस, इनवाइट और सेटिंग्स सहित।',
  },
}

function layout({ preheader, kicker, title, bodyHtml }) {
  const safePreheader = escapeHtml(preheader)
  const safeKicker = escapeHtml(kicker)
  const safeTitle = escapeHtml(title)

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
  </head>
  <body style="margin:0;padding:0;background:#e8edf5;color:#0f172a;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safePreheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e8edf5;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #dbe3ef;">
            <tr>
              <td style="background:#0b1220;padding:22px 28px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#f8fafc;">Cloudeasy Devops Portal</div>
                <div style="margin-top:4px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#a5b4fc;">English · हिन्दी</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6d5efc;font-weight:700;margin-bottom:8px;">${safeKicker}</div>
                <h1 style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:1.3;color:#0f172a;">${safeTitle}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 24px;">
                <div style="border-top:1px solid #e2e8f0;padding-top:16px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;color:#64748b;">
                  Sent by Cloudeasy Devops Portal. Made by Divyanshu Tiwari.<br />
                  यह संदेश Cloudeasy Devops Portal की ओर से है। यदि आपने इसकी उम्मीद नहीं की थी, तो इसे नज़रअंदाज़ करें।
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function langBlock(label, text) {
  return `
    <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">${escapeHtml(label)}</p>
    <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#334155;">${escapeHtml(text)}</p>
  `
}

async function sendMail({ to, subject, text, html }) {
  const transporter = createTransporter()
  const from = process.env.MAIL_FROM || process.env.SMTP_USER
  await transporter.sendMail({ from, to, subject, text, html })
}

export async function sendInviteEmail(to, role, loginUrl) {
  const hint = ROLE_COPY[role] || {
    en: 'Access to the Cloudeasy Devops Portal workspace.',
    hi: 'Cloudeasy Devops Portal वर्कस्पेस तक पहुँच।',
  }
  const safeRole = escapeHtml(role)
  const safeUrl = escapeHtml(loginUrl)
  const html = layout({
    preheader: `Invitation · निमंत्रण · ${role}`,
    kicker: 'Workspace invite · वर्कस्पेस निमंत्रण',
    title: 'You are invited',
    bodyHtml: `
      ${langBlock('English', `An administrator invited ${to} to join Cloudeasy Devops Portal.`)}
      ${langBlock('हिन्दी', `एक एडमिन ने ${to} को Cloudeasy Devops Portal में शामिल होने का निमंत्रण भेजा है।`)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
        <tr>
          <td style="padding:16px 18px;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Role · भूमिका</div>
            <div style="margin-top:4px;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#6d5efc;">${safeRole}</div>
            <div style="margin-top:8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#475569;">${escapeHtml(hint.en)}</div>
            <div style="margin-top:4px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#475569;">${escapeHtml(hint.hi)}</div>
          </td>
        </tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
        <tr>
          <td style="border-radius:10px;background:#4f46e5;">
            <a href="${safeUrl}" style="display:inline-block;padding:12px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Sign in · साइन इन करें</a>
          </td>
        </tr>
      </table>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#64748b;">
        ${safeUrl}
      </p>
    `,
  })

  await sendMail({
    to,
    subject: `Invitation · निमंत्रण · Cloudeasy Devops Portal · ${role}`,
    text: `You are invited to Cloudeasy Devops Portal as ${role}. ${hint.en}\nहिन्दी: आपको ${role} के रूप में निमंत्रण मिला है। ${hint.hi}\nSign in: ${loginUrl}`,
    html,
  })
}

export async function sendOtpEmail(to, otp, purpose = 'login') {
  const minutes = process.env.OTP_TTL_MINUTES || '5'
  const copy = OTP_COPY[purpose] || OTP_COPY.login
  const safeOtp = escapeHtml(otp)
  const html = layout({
    preheader: `${copy.en} ${otp}`,
    kicker: copy.kicker,
    title: copy.title,
    bodyHtml: `
      ${langBlock('English', copy.en)}
      ${langBlock('हिन्दी', copy.hi)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;background:#0b1220;border-radius:12px;">
        <tr>
          <td align="center" style="padding:22px 16px;">
            <div style="font-family:Consolas,'Courier New',monospace;font-size:32px;letter-spacing:10px;font-weight:700;color:#c7d2fe;line-height:1;">${safeOtp}</div>
            <div style="margin-top:10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#94a3b8;">Expires in ${escapeHtml(minutes)} minutes · ${escapeHtml(minutes)} मिनट में समाप्त</div>
          </td>
        </tr>
      </table>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:#64748b;">
        Do not share this code. Cloudeasy Devops Portal will never ask for it.<br />
        यह कोड किसी के साथ साझा न करें। Cloudeasy Devops Portal इसे कभी नहीं माँगेगा।
      </p>
    `,
  })

  await sendMail({
    to,
    subject: copy.subject,
    text: `${copy.en}\n${copy.hi}\nCode: ${otp}\nExpires in ${minutes} minutes.`,
    html,
  })
}
