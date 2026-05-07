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
      from: 'onboarding@resend.dev',
      to: process.env.DECLARATIE_EMAIL ?? '',
      subject: `Nieuwe declaratie van ${naam} — €${bedrag}`,
      html: `
        <h2>Nieuwe declaratie ingediend</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Naam</td><td style="padding:8px;border:1px solid #ddd">${naam}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">E-mail</td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Bedrag</td><td style="padding:8px;border:1px solid #ddd">€${bedrag}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Kostenplaats</td><td style="padding:8px;border:1px solid #ddd">${kostenplaats}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Omschrijving</td><td style="padding:8px;border:1px solid #ddd">${omschrijving}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">IBAN</td><td style="padding:8px;border:1px solid #ddd">${rekeningnummer || '(niet opgegeven)'}</td></tr>
        </table>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Declaratie e-mail fout:', err)
    return NextResponse.json({ error: 'Verzenden mislukt' }, { status: 500 })
  }
}
