import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

async function verifyRecaptcha(token: string): Promise<boolean> {
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY ?? '',
      response: token,
    }),
  })
  const data = await res.json()
  return data.success === true
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { naam, email, bedrag, kostenplaats, omschrijving, rekeningnummer, recaptchaToken, privacyAccepted } = body

    if (!naam || !email || !bedrag || !kostenplaats || !omschrijving) {
      return NextResponse.json({ error: 'Velden ontbreken' }, { status: 400 })
    }

    if (!privacyAccepted) {
      return NextResponse.json({ error: 'Akkoord op privacyverklaring en regelement is vereist' }, { status: 400 })
    }

    const captchaOk = await verifyRecaptcha(recaptchaToken ?? '')
    if (!captchaOk) {
      return NextResponse.json({ error: 'reCAPTCHA verificatie mislukt' }, { status: 400 })
    }

    const indienDatum = new Date().toLocaleDateString('nl-NL', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

    // Gedeelde stijlconstanten (zorgt voor visuele consistentie tussen beide mails)
    const rood = '#CC0000'
    const donker = '#1a1c1c'
    const lichtGrijs = '#f7f7f7'
    const randKleur = '#e5e5e5'
    const jaar = new Date().getFullYear()

    const emailHeader = (titel: string, subtitel?: string) => `
      <div style="background-color: ${rood}; padding: 26px 32px;">
        <p style="margin: 0 0 5px; color: rgba(255,255,255,0.7); font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Westfriese Modelspoor Club</p>
        <h1 style="margin: 0; color: #fff; font-size: 22px; font-weight: 700; line-height: 1.3;">${titel}</h1>
        ${subtitel ? `<p style="margin: 6px 0 0; color: rgba(255,255,255,0.75); font-size: 14px;">${subtitel}</p>` : ''}
      </div>`

    const emailFooter = (extra?: string) => `
      <div style="background-color: ${donker}; padding: 16px 32px; text-align: center;">
        <p style="margin: 0; color: rgba(255,255,255,0.35); font-size: 11px; line-height: 1.8;">
          &copy; ${jaar} Westfriese Modelspoor Club${extra ? ` &mdash; ${extra}` : ''}
        </p>
      </div>`

    const detailRij = (label: string, waarde: string, gestreept: boolean, stijl = '') => `
      <tr style="background-color: ${gestreept ? lichtGrijs : '#fff'};">
        <td style="padding: 10px 14px; border: 1px solid ${randKleur}; color: #666; font-size: 14px; width: 36%;">${label}</td>
        <td style="padding: 10px 14px; border: 1px solid ${randKleur}; color: #111; font-size: 14px; ${stijl}">${waarde}</td>
      </tr>`

    // 1. Mail naar de Penningmeester (intern)
    await resend.emails.send({
      from: 'De WMC — Declaraties <onboarding@resend.dev>',
      replyTo: email,
      to: process.env.DECLARATIE_EMAIL ?? '',
      subject: `Nieuwe declaratie van ${naam} — €${bedrag}`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid ${randKleur}; background-color: #fff;">
          ${emailHeader('Nieuwe declaratie ingediend', `Ingediend op ${indienDatum} via het ledenportaal`)}

          <div style="padding: 28px 32px;">
            <p style="margin: 0 0 6px; color: ${donker}; font-size: 15px;">Beste penningmeester,</p>
            <p style="margin: 0 0 22px; color: #555; font-size: 14px; line-height: 1.7;">Er is een nieuwe declaratie binnengekomen. Hieronder vind je alle benodigde informatie om dit te verwerken.</p>

            <table style="width: 100%; border-collapse: collapse;">
              ${detailRij('Naam', naam, true)}
              ${detailRij('E-mailadres', `<a href="mailto:${email}" style="color: ${rood}; text-decoration: none;">${email}</a>`, false)}
              ${detailRij('Bedrag', `€${bedrag}`, true, `color: ${rood}; font-weight: 700; font-size: 16px;`)}
              ${detailRij('Kostenplaats', kostenplaats, false)}
              ${detailRij('IBAN', rekeningnummer || '<em style="color:#999;">Niet opgegeven</em>', true, 'font-family: monospace;')}
            </table>

            <div style="margin-top: 20px; background-color: ${lichtGrijs}; border-left: 3px solid ${rood}; padding: 14px 16px;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Omschrijving</p>
              <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.7;">${omschrijving}</p>
            </div>

            <p style="margin: 22px 0 0; font-size: 13px; color: #999; line-height: 1.6;">Je kunt de indiener direct bereiken door op deze e-mail te antwoorden.</p>
          </div>

          ${emailFooter('Intern gebruik — niet doorsturen')}
        </div>
      `,
    })

    // 2. Bevestigingsmail naar de indiener
    await resend.emails.send({
      from: 'De WMC <onboarding@resend.dev>',
      to: email,
      subject: `Declaratie ontvangen — €${bedrag}`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid ${randKleur}; background-color: #fff;">
          ${emailHeader('Je declaratie is ontvangen')}

          <div style="padding: 28px 32px; line-height: 1.7; color: #444; font-size: 15px;">
            <p style="margin: 0 0 12px;">Hoi ${naam},</p>
            <p style="margin: 0 0 22px;">Goed nieuws — je declaratie is in goede orde ontvangen! De penningmeester neemt dit in behandeling en neemt contact met je op als er nog vragen zijn.</p>

            <div style="background-color: ${lichtGrijs}; border: 1px solid ${randKleur}; padding: 20px 22px; margin-bottom: 22px;">
              <p style="margin: 0 0 14px; font-size: 12px; color: ${rood}; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">Overzicht</p>
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 7px 0; color: #666; width: 42%; border-bottom: 1px solid ${randKleur};">Bedrag</td>
                  <td style="padding: 7px 0; color: ${donker}; font-weight: 700; border-bottom: 1px solid ${randKleur};">€${bedrag}</td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; color: #666; border-bottom: 1px solid ${randKleur};">Kostenplaats</td>
                  <td style="padding: 7px 0; color: ${donker}; border-bottom: 1px solid ${randKleur};">${kostenplaats}</td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; color: #666; border-bottom: 1px solid ${randKleur};">Ingediend op</td>
                  <td style="padding: 7px 0; color: ${donker}; border-bottom: 1px solid ${randKleur};">${indienDatum}</td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; color: #666;">Status</td>
                  <td style="padding: 7px 0;"><span style="background-color: #fff7e6; color: #b45309; font-size: 12px; font-weight: 600; padding: 3px 9px; border-radius: 4px; border: 1px solid #fcd34d;">In behandeling</span></td>
                </tr>
              </table>
            </div>

            <p style="margin: 0 0 6px;">Zodra alles goedgekeurd is, wordt het bedrag overgemaakt. Je hoeft verder niks te doen.</p>

            <hr style="border: 0; border-top: 1px solid ${randKleur}; margin: 26px 0;" />
            <p style="margin: 0; font-size: 13px; color: #999;">Vragen? Beantwoord deze e-mail gewoon, dan komt het direct bij de penningmeester terecht.</p>
          </div>

          ${emailFooter('dewmc.nl')}
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Declaratie e-mail fout:', err)
    return NextResponse.json({ error: 'Verzenden mislukt' }, { status: 500 })
  }
}
