# 🔐 WMC Ledenportaal — Setup & Instructies

Het ledenportaal is klaar voor gebruik! Hier is alles wat je nodig hebt om het in te stellen.

## 📋 Inloggegevens

Het portaal gebruikt momenteel een **gezamenlijke inlognaam en wachtwoord**:

- **Wachtwoord**: Uw postcode (bijv. `1723 HX`)
- **Gebruikersnaam**: Vrij in te vullen (bijv. `leden`, `wmc`, etc.)

### Wachtwoord wijzigen

Wil je het wachtwoord aanpassen? Wijzig deze regel in [components/sections/MemberLoginForm.tsx](components/sections/MemberLoginForm.tsx#L11):

```typescript
const MEMBER_PASSWORD = 'Correcthorsebatterystaple' // ← Wijzig dit
```

## 📝 Content toevoegen in Contentful

### 1. Mededelingen (Announcements)

**Ga naar**: Contentful Dashboard → **Ledenportaal — Mededeling**

Voeg mededelingen toe met:
- **Titel** (verplicht) — Het onderwerp
- **Inhoud** (verplicht) — De boodschap
- **Publicatiedatum** (verplicht) — Wanneer het zichtbaar moet zijn
- **Prioriteit** (optioneel) — `hoog`, `normaal`, of `laag`
  - Hoog = rood accent (Belangrijk)
  - Normaal = geel accent
  - Laag = blauw accent (Informatief)
- **Zichtbaar** (verplicht) — Zet dit aan (`true`) om zichtbaar te maken

### 2. Documenten (Jaarverslagen, Notulen, etc.)

**Ga naar**: Contentful Dashboard → **Ledenportaal — Document**

Upload documenten met:
- **Titel** (verplicht) — Bijv. "Jaarverslag 2025"
- **Beschrijving** (optioneel) — Korte omschrijving
- **Document** (verplicht) — PDF, Word, Excel, etc. uploaden
- **Categorie** (verplicht) — Kies één van:
  - `jaarverslag` — Voor jaarverslagen
  - `notulen` — Voor vergadernotulen
  - `financieel` — Voor financiële stukken
  - `overig` — Voor overige bestanden
- **Uploadatum** (verplicht) — Wanneer het is geüpload
- **Zichtbaar** (verplicht) — Zet dit aan (`true`) om zichtbaar te maken

**💡 Tip**: Zorg dat je PDF-bestanden redelijk klein zijn (< 10MB) voor sneller downloaden.

## 🎨 Uiterlijk

Het portaal ondersteunt automatisch:
- ✅ Donker/licht themawisseling
- ✅ Mobiele responsive design
- ✅ Documenten met bestandstype-icoon en grootte
- ✅ Categorisering van documenten
- ✅ Prioriteitskleuren voor mededelingen

## 🔄 Cache-timing

Content wordt **5 minuten lang gecached** voor betere performance. Als je content wijzigt in Contentful:

1. De website haalt automatisch de nieuwe content op (elke 5 minuten)
2. Gebruikers zien de update na maximaal 5 minuten
3. Websitehouders kunnen manueel triggeren: `npm run build`

## 🚀 Testen

1. Start de dev server: `npm run dev`
2. Ga naar: http://localhost:3000/leden
3. Log in met je ingestelde gegevens
4. Je zou mededelingen en documenten moeten zien (als je die hebt toegevoegd)

## 📱 URL

Het ledenportaal is altijd bereikbaar op: **`https://dewmc.nl/leden`**

## 🔧 Technische Details

- **Framework**: Next.js 16 met TypeScript
- **CMS**: Contentful (contentful-management v12)
- **Hosting**: Netlify
- **Auth**: Client-side localStorage (eenvoudig systeem)
- **Cache**: Next.js Data Cache (5 minuten)

## ⚠️ Beveiligingsnote

Dit systeem is **niet geschikt voor gevoelige gegevens**:
- ❌ Het wachtwoord staat in de code (kan via DevTools zien)
- ❌ Geen versleuteling
- ❌ Geen audit logging
- ❌ Geen IP-beperking

Dit is bewust eenvoudig gehouden op jouw verzoek. Voor **echt beveiligde** ledenportalen hebben we betere opties (OAuth, JWT, externe auth provider, etc.).

## 📞 Vragen?

Neem contact op via **info@dewmc.nl** of via GitHub issues.

---

**Klaar om te gaan? 🚀 Voeg wat inhoud toe in Contentful en test het portaal!**
