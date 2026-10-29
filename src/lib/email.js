import nodemailer from 'nodemailer';
import { getDb } from '@/lib/db';

/**
 * Envoie un email de notification lorsqu'un message est soumis dans le formulaire de contact,
 * directement à l'adresse d'Harmonie (laparentheseharmonieuse@gmail.com).
 */
export async function sendContactNotification(data) {
    let siteInfo = {};
    try {
        const db = getDb();
        const rows = await db.prepare('SELECT key, value FROM site_info').all();
        siteInfo = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    } catch (e) {
        console.warn('[Email] Impossible de lire site_info, utilisation des valeurs par défaut:', e.message);
    }

    const recipient = siteInfo.contact_email || siteInfo.notification_email || process.env.NOTIFY_EMAIL || 'laparentheseharmonieuse@gmail.com';
    const formspreeUrl = siteInfo.formspree_url || process.env.FORMSPREE_URL;
    const smtpPass = siteInfo.smtp_pass || process.env.SMTP_PASS;
    const resendApiKey = siteInfo.resend_api_key || process.env.RESEND_API_KEY;

    const {
        name = 'Cliente',
        email = '',
        phone = '',
        service_interest,
        preferred_date,
        preferred_time,
        event_type,
        event_date,
        message = '',
    } = data;

    const serviceLabel = service_interest || event_type || 'Demande de soin';
    const dateLabel = preferred_date || event_date || '';
    const timeLabel = preferred_time || '';

    const subject = `✨ Nouveau message de ${name} (${serviceLabel})`;

    const htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e8dfd5; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <div style="background: #2C2623; color: #D8B685; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;">La Parenthèse Harmonieuse</h1>
        <p style="margin: 6px 0 0; font-size: 14px; color: #FAF7F2; opacity: 0.95;">Nouveau message reçu depuis le site</p>
    </div>

    <div style="padding: 24px 28px; color: #2C2623; background: #FAF7F2;">
        <p style="font-size: 16px; margin-top: 0; color: #2C2623;">Bonjour Harmonie,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #5A504A;">Une cliente vient de remplir le formulaire de contact sur le site <strong>La Parenthèse Harmonieuse</strong> :</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ebd8c5;">
            <tr style="background: #fbf5ef;">
                <td style="padding: 12px 14px; font-weight: 600; color: #744E1C; border-bottom: 1px solid #ebd8c5; width: 35%;">Nom complet</td>
                <td style="padding: 12px 14px; border-bottom: 1px solid #ebd8c5; color: #2C2623; font-weight: 700;">${escapeHtml(name)}</td>
            </tr>
            <tr>
                <td style="padding: 12px 14px; font-weight: 600; color: #744E1C; border-bottom: 1px solid #ebd8c5;">Email</td>
                <td style="padding: 12px 14px; border-bottom: 1px solid #ebd8c5;"><a href="mailto:${escapeHtml(email)}" style="color: #744E1C; text-decoration: underline; font-weight: 600;">${escapeHtml(email)}</a></td>
            </tr>
            <tr style="background: #fbf5ef;">
                <td style="padding: 12px 14px; font-weight: 600; color: #744E1C; border-bottom: 1px solid #ebd8c5;">Téléphone</td>
                <td style="padding: 12px 14px; border-bottom: 1px solid #ebd8c5;"><a href="tel:${escapeHtml(phone)}" style="color: #2C2623; text-decoration: none; font-weight: 600;">${escapeHtml(phone || 'Non renseigné')}</a></td>
            </tr>
            <tr>
                <td style="padding: 12px 14px; font-weight: 600; color: #744E1C; border-bottom: 1px solid #ebd8c5;">Soin / Sujet</td>
                <td style="padding: 12px 14px; border-bottom: 1px solid #ebd8c5;"><span style="background: #f1e4d3; color: #744E1C; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 13px;">${escapeHtml(serviceLabel)}</span></td>
            </tr>
            ${dateLabel ? `
            <tr style="background: #fbf5ef;">
                <td style="padding: 12px 14px; font-weight: 600; color: #744E1C; border-bottom: 1px solid #ebd8c5;">Date souhaitée</td>
                <td style="padding: 12px 14px; color: #2C2623; font-weight: 700; border-bottom: 1px solid #ebd8c5;">${escapeHtml(dateLabel)}</td>
            </tr>
            ` : ''}
            ${timeLabel ? `
            <tr>
                <td style="padding: 12px 14px; font-weight: 600; color: #744E1C;">Créneau souhaité</td>
                <td style="padding: 12px 14px; color: #2C2623; font-weight: 600;">${escapeHtml(timeLabel)}</td>
            </tr>
            ` : ''}
        </table>

        <div style="background: #ffffff; border: 1px solid #ebd8c5; border-left: 4px solid #B9925E; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <div style="font-weight: 700; margin-bottom: 8px; color: #744E1C; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Message de la cliente :</div>
            <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #2C2623;">${escapeHtml(message)}</div>
        </div>

        <div style="text-align: center; margin: 28px 0 10px;">
            <a href="mailto:${escapeHtml(email)}?subject=Re:%20Votre%20message%20chez%20La%20Parenth%C3%A8se%20Harmonieuse" style="background: #8E662F; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">✉️ Répondre à la cliente</a>
        </div>
    </div>

    <div style="background: #f4ece2; padding: 14px; text-align: center; font-size: 12px; color: #744E1C;">
        Notification automatique envoyée à <strong>${escapeHtml(recipient)}</strong> • La Parenthèse Harmonieuse
    </div>
</div>
`;

    const textContent = `
NOUVEAU MESSAGE - LA PARENTHÈSE HARMONIEUSE
---------------------------------------------
Cliente : ${name}
Email : ${email}
Téléphone : ${phone || 'Non renseigné'}
Soin souhaité : ${serviceLabel}
Date souhaitée : ${dateLabel || 'Non précisée'}
Créneau souhaité : ${timeLabel || 'Non précisé'}

Message :
${message}
---------------------------------------------
`;

    // 1. PRIORITÉ 1 : Formspree
    if (formspreeUrl && formspreeUrl.startsWith('https://formspree.io/')) {
        try {
            const resp = await fetch(formspreeUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    service_interest: serviceLabel,
                    preferred_date: dateLabel,
                    preferred_time: timeLabel,
                    message,
                    _subject: subject,
                }),
            });
            if (resp.ok) {
                return { success: true, provider: 'formspree' };
            }
        } catch (err) {
            console.error('[Email] Échec envoi Formspree :', err.message);
        }
    }

    // 2. PRIORITÉ 2 : Resend
    if (resendApiKey) {
        try {
            const resp = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'La Parenthèse Harmonieuse <onboarding@resend.dev>',
                    to: [recipient],
                    reply_to: email,
                    subject,
                    html: htmlContent,
                    text: textContent,
                }),
            });
            if (resp.ok) {
                return { success: true, provider: 'resend' };
            }
        } catch (err) {
            console.error('[Email] Échec envoi Resend :', err.message);
        }
    }

    // 3. PRIORITÉ 3 : SMTP
    const host = siteInfo.smtp_host || process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(siteInfo.smtp_port || process.env.SMTP_PORT || '465', 10);
    const secure = (siteInfo.smtp_secure !== undefined ? siteInfo.smtp_secure === 'true' : process.env.SMTP_SECURE === 'true') || port === 465;
    const user = siteInfo.smtp_user || process.env.SMTP_USER || 'laparentheseharmonieuse@gmail.com';
    const pass = smtpPass;

    if (pass) {
        try {
            const transporter = nodemailer.createTransport({
                host,
                port,
                secure,
                auth: { user, pass },
            });
            await transporter.sendMail({
                from: `"La Parenthèse Harmonieuse" <${user}>`,
                to: recipient,
                replyTo: email,
                subject,
                text: textContent,
                html: htmlContent,
            });
            return { success: true, provider: 'smtp' };
        } catch (smtpErr) {
            console.error('[Email] Échec envoi SMTP :', smtpErr.message);
        }
    }

    return { success: true, provider: 'database_only' };
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
