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

// 1. Mail naar de Administratie (Intern)
await resend.emails.send({
  from: 'Declaratie Systeem <onboarding@resend.dev>',
  replyTo: email,
  to: process.env.DECLARATIE_EMAIL ?? '',
  subject: `🔴 Nieuwe declaratie: ${naam} — €${bedrag}`,
  html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #000;">
      <div style="background-color: #000; padding: 20px; text-align: center;">
        <h2 style="margin: 0; color: #fff; font-size: 18px;">INTERNE MELDING</h2>
      </div>
      <div style="padding: 20px; background-color: #fff;">
        <p>Er is een nieuwe declaratie ingediend die verwerkt moet worden:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f9f9f9;"><td style="padding: 10px; border: 1px solid #eee;"><strong>Indiener:</strong></td><td style="padding: 10px; border: 1px solid #eee;">${naam}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #eee;"><strong>Bedrag:</strong></td><td style="padding: 10px; border: 1px solid #eee; color: #CC0000; font-weight: bold;">€${bedrag}</td></tr>
          <tr style="background-color: #f9f9f9;"><td style="padding: 10px; border: 1px solid #eee;"><strong>Kostenplaats:</strong></td><td style="padding: 10px; border: 1px solid #eee;">${kostenplaats}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #eee;"><strong>IBAN:</strong></td><td style="padding: 10px; border: 1px solid #eee;">${rekeningnummer}</td></tr>
        </table>
        <p><strong>Omschrijving:</strong><br/>${omschrijving}</p>
      </div>
    </div>
  `,
});

// 2. Mail naar de Indiener (Klant/Medewerker)
await resend.emails.send({
  from: 'Declaratie Systeem <onboarding@resend.dev>',
  to: email,
  subject: `Bevestiging van je declaratie — €${bedrag}`,
  html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; border: 1px solid #eee;">
      <div style="background-color: #CC0000; padding: 30px; text-align: center;">
        <h1 style="margin: 0; color: #fff; font-size: 24px;">Bedankt, ${naam}!</h1>
      </div>
      
      <div style="padding: 30px; background-color: #fff; line-height: 1.6;">
        <p>We hebben je declaratie in goede orde ontvangen. Ons team gaat hier zo snel mogelijk mee aan de slag.</p>
        
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 4px; border-left: 4px solid #000;">
          <h3 style="margin-top: 0; color: #CC0000;">Samenvatting</h3>
          <p style="margin: 5px 0;"><strong>Bedrag:</strong> €${bedrag}</p>
          <p style="margin: 5px 0;"><strong>Kostenplaats:</strong> ${kostenplaats}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> In behandeling</p>
        </div>

        <p style="margin-top: 25px;">Zodra de declaratie is goedgekeurd, wordt het bedrag overgemaakt naar het door jou opgegeven rekeningnummer.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />
        <p style="font-size: 14px; color: #666;">Heb je vragen? Beantwoord dan simpelweg deze e-mail.</p>
      </div>
      
      <div style="background-color: #000; padding: 15px; text-align: center; color: #fff; font-size: 12px;">
        &copy; ${new Date().getFullYear()} Jouw Bedrijfsnaam
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
