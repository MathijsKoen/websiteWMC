# De Westfriese Modelspoor Club — Website

De officiële website van de WMC, gebouwd met Next.js en gehost op Netlify.

---

## Externe diensten

### Hosting & Deployment

**[Netlify](https://app.netlify.com)**
Hier wordt de website op gehost en automatisch gepubliceerd. Elke keer dat er code naar GitHub wordt gepusht, bouwt Netlify de website opnieuw en zet deze live. Ook de omgevingsvariabelen (API-sleutels, wachtwoorden) worden hier ingesteld onder *Site settings → Environment variables*.

---

### Content beheer (CMS)

**[Contentful](https://app.contentful.com)**
Het content management systeem waar teksten, afbeeldingen, nieuws, agenda en ledenportaal-documenten worden beheerd. Redacteurs kunnen hier inloggen om content aan te passen zonder code te hoeven aanraken.

Benodigde omgevingsvariabelen:
- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_ACCESS_TOKEN`
- `CONTENTFUL_PREVIEW_TOKEN`
- `CONTENTFUL_MANAGEMENT_TOKEN`

---

### E-mail

**[Resend](https://resend.com)**
Verstuurt de e-mails wanneer een lid een declaratie indient via het ledenportaal. De declaratie wordt als opgemaakte e-mail afgeleverd bij de penningmeester. Beheer van verzonden mails en statistieken is te vinden in het Resend-dashboard.

Benodigde omgevingsvariabelen:
- `RESEND_API_KEY`
- `DECLARATIE_EMAIL` — het e-mailadres van de ontvanger (penningmeester)

> **Let op:** Zolang er geen eigen domein is geverifieerd in Resend, worden e-mails verstuurd via `onboarding@resend.dev`. Verifieer een eigen domein (bijv. `dewmc.nl`) in *Resend → Domains* om een eigen afzenderadres te gebruiken.

---

### Websitestatistieken

**[Google Analytics 4](https://analytics.google.com)**
Bijhouden hoeveel bezoekers de website heeft en welke pagina's het meest worden bezocht. IP-adressen worden geanonimiseerd. De tracking wordt alleen geactiveerd als een bezoeker toestemming geeft via de cookiebanner.

Het Measurement ID (`G-CP8W9JKLPF`) staat direct in de code in [components/analytics/GoogleAnalytics.tsx](components/analytics/GoogleAnalytics.tsx). Er zijn geen omgevingsvariabelen nodig.

---

### Spam-beveiliging

**[Google reCAPTCHA v2](https://www.google.com/recaptcha/admin)**
Het "Ik ben geen robot" vinkje op het declaratieformulier. Beschermt het formulier tegen geautomatiseerde spam. Beheer van de sleutels (aanmaken, domeinen toevoegen) via de Google reCAPTCHA-beheerconsole.

Benodigde omgevingsvariabelen:
- `RECAPTCHA_SECRET_KEY` — de geheime sleutel voor server-side verificatie

De publieke site key staat direct in de code in [components/sections/DeclarationForm.tsx](components/sections/DeclarationForm.tsx).

---

### Visuele editor (ontwikkeling)

**[Stackbit](https://app.stackbit.com)**
Maakt het mogelijk om content visueel te bewerken via een live preview van de website, gekoppeld aan Contentful. Wordt gebruikt tijdens ontwikkeling en beheer. Werkt via `npx stackbit dev` (poort 8090).

---

## Omgevingsvariabelen overzicht

Maak een `.env.local` bestand aan op basis van `.env.local.example`:

| Variabele | Dienst | Omschrijving |
|---|---|---|
| `CONTENTFUL_SPACE_ID` | Contentful | ID van de Contentful space |
| `CONTENTFUL_ACCESS_TOKEN` | Contentful | Toegangstoken voor de Delivery API |
| `CONTENTFUL_PREVIEW_TOKEN` | Contentful | Toegangstoken voor de Preview API |
| `CONTENTFUL_MANAGEMENT_TOKEN` | Contentful | Token voor de Management API (Stackbit) |
| `RESEND_API_KEY` | Resend | API-sleutel voor e-mailverzending |
| `DECLARATIE_EMAIL` | Resend | E-mailadres ontvanger declaraties |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA | Geheime sleutel voor server-side verificatie |
| `MEMBER_USERNAME` | Ledenportaal | Gebruikersnaam voor het ledenportaal |
| `MEMBER_PASSWORD` | Ledenportaal | Wachtwoord voor het ledenportaal |
| `SESSION_SECRET` | Ledenportaal | Willekeurige string voor sessieversleuteling |

---

## Lokaal starten

```bash
npm install
npm run dev
```

De website is dan bereikbaar op [http://localhost:3000](http://localhost:3000).
