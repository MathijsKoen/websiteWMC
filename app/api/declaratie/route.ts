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
    const { naam, email, bedrag, kostenplaats, omschrijving, rekeningnummer, recaptchaToken } = body

    if (!naam || !email || !bedrag || !kostenplaats || !omschrijving) {
      return NextResponse.json({ error: 'Velden ontbreken' }, { status: 400 })
    }

    const captchaOk = await verifyRecaptcha(recaptchaToken ?? '')
    if (!captchaOk) {
      return NextResponse.json({ error: 'reCAPTCHA verificatie mislukt' }, { status: 400 })
    }

    await resend.emails.send({
  // Tip: Gebruik een eigen domein (bijv. info@jouwdomein.nl) zodra je dit hebt ingesteld in Resend
  from: 'Declaratie Systeem <onboarding@resend.dev>',
  replyTo: email, // Zo antwoord je direct naar de indiener
  to: process.env.DECLARATIE_EMAIL ?? '',
  subject: `Nieuwe declaratie: ${naam} — €${bedrag}`,
  html: `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f8f9fa; padding: 20px; border-bottom: 1px solid #eee;">
        <h2 style="margin: 0; color: #1a1a1a; font-size: 20px;">Nieuwe declaratie ingediend</h2>
      </div>
      
      <div style="padding: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 150px;">Indiener</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 500;">${naam}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">E-mailadres</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Bedrag</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #2e7d32;">€${bedrag}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Kostenplaats</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${kostenplaats}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">IBAN</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-family: monospace;">${rekeningnummer || '<em>Niet opgegeven</em>'}</td>
          </tr>
        </table>

        <div style="margin-top: 20px;">
          <p style="color: #666; margin-bottom: 8px;">Omschrijving:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 4px; font-style: italic;">
            "${omschrijving}"
          </div>
        </div>
      </div>

      <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        Dit is een automatisch bericht verzonden vanaf het declaratieformulier.
      </div>
    </div>
  `,
});

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Declaratie e-mail fout:', err)
    return NextResponse.json({ error: 'Verzenden mislukt' }, { status: 500 })
  }
}
