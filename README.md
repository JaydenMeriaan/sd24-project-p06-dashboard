# SDG Dashboard - Jouw Project

Een interactieve webapplicatie voor het volgen en visualiseren van de Duurzame Ontwikkelingsdoelen (SDGs). In dit project bouw je van de grond af een moderne web applicatie en leer je werken met professionele tools en technieken.

## 🎯 Wat Ga Je Leren?

Dit project is ontworpen om je stap voor stap kennis te laten maken met moderne webdevelopment:

### Frontend Development
- **Next.js 14**: Een krachtig React framework voor moderne webapps
- **React**: Component-based development, state management, hooks
- **TypeScript**: Type-veilige code schrijven en beter bugs voorkomen
- **Tailwind CSS**: Snel en efficient mooie interfaces bouwen

### Backend & Database
- **Prisma ORM**: Type-safe database queries
- **MySQL**: Relationele database voor data opslag
- **API Development**: RESTful endpoints bouwen
- **Data Validatie**: Zod voor input validatie

### Data Visualisatie
- **Chart.js**: Interactieve grafieken en visualisaties
- **Data Processing**: Trends berekenen, data filteren, aggregaties


## 🚀 Project Opstarten

Volg deze stappen om het project voor het eerst te starten:

### 1. Installeer Dependencies
```bash
npm install
```

### 2. Maak Environment Bestand
```bash
cp .env.example .env
```
De standaard instellingen werken direct!

### 3. Initialiseer Database
```bash
npm run db:generate    # Genereer Prisma Client
npm run db:push        # Maak database tabellen
npm run db:seed        # Voeg voorbeeld data toe
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - je zou nu de applicatie moeten zien!

## 📁 Projectstructuur Begrijpen

```
template/
├── app/                    # Next.js pagina's en routes
│   ├── api/               # Backend API endpoints
│   ├── overview/          # Overzicht van alle SDGs
│   ├── sdg/[id]/         # Detail pagina per SDG
│   ├── layout.tsx        # Hoofdlayout (Header/Footer)
│   └── globals.css       # Globale styling
│
├── components/            # Herbruikbare componenten
│   ├── ui/               # Interface componenten
│   └── charts/           # Grafiek componenten
│
├── lib/                   # Hulpfuncties en utilities
│   ├── prisma.ts         # Database connectie
│   ├── types.ts          # TypeScript definities
│   └── data.ts           # Data helper functies
│
├── prisma/               # Database setup
│   ├── schema.prisma     # Database structuur
│   └── seed.ts           # Voorbeeld data
│
└── data/                 # Statische gegevens
    └── sdg-info.json     # Info over alle 17 SDGs
```

## 🎓 Leertraject (6 Weken)

### Week 1: Basis Begrijpen
**Doel**: Project begrijpen en eerste component bouwen

- Bekijk de hele codebase, open alle bestanden
- Begrijp hoe Next.js routing werkt
- Leer over React componenten door voorbeelden te bestuderen
- Bouw je eerste eenvoudige component (Button)

📖 **Start hier**: `components/ui/README.md`

### Week 2: UI Componenten Bouwen
**Doel**: Herbruikbare interface componenten maken

Je gaat verschillende soorten componenten bouwen:
- **Formulier componenten**: Voor gebruikers input
- **Display componenten**: Voor informatie tonen
- **Interactieve componenten**: Met state en events

Elke component moet:
- TypeScript props interfaces hebben
- Herbruikbaar zijn voor verschillende situaties
- Responsive werken op alle schermen

📖 **Details in**: `components/ui/README.md`

### Week 3: Data Visualisatie
**Doel**: Grafieken bouwen met Chart.js

Leer werken met Chart.js:
- Begrijp hoe chart data gestructureerd wordt
- Maak verschillende chart types (line, bar, pie)
- Werk met kleuren en styling
- Maak charts responsive

Je hebt al een werkend voorbeeld (BarChart.tsx) - gebruik dit als referentie!

📖 **Voorbeelden in**: `components/charts/README.md`

### Week 4: Pagina's Bouwen
**Doel**: SDG data tonen in een mooie interface

**Overview Pagina**:
- Toon alle 17 SDGs in een grid
- Gebruik je Card component
- Maak het responsive
- Voeg hover effects toe

**Detail Pagina's**:
- Toon gedetailleerde info per SDG
- Voeg KPI cards toe met statistieken
- Begin met de layout en structuur

📖 **Uitleg in**: `app/overview/README.md` en `app/sdg/[id]/README.md`

### Week 5: Data & API's
**Doel**: Backend endpoints en data integratie

**Database**:
- Voeg meer jaren toe aan de data
- Voeg meer landen toe
- Begrijp hoe Prisma queries werken

**API Endpoints**:
- Bouw GET endpoints voor data ophalen
- Voeg filters toe (land, jaar, SDG nummer)
- Leer over request validatie met Zod

📖 **API specs in**: `app/api/README.md`

### Week 6: Visualisaties & Afronding
**Doel**: Charts toevoegen en alles afmaken

- Integreer je charts in de detail pagina's
- Voeg filters toe die de charts updaten
- Bouw een data tabel met export functie
- Fix bugs en verbeter styling
- Test alles grondig

## 🗺️ Waar Begin Je?

### Stap 1: Verken de Voorbeelden
- Bekijk `Card.tsx` - hoe ziet een component eruit?
- Bekijk `BarChart.tsx` - hoe werkt Chart.js?
- Bekijk `Header.tsx` - hoe werk je met props?

### Stap 2: Lees de README's
Elke map heeft een README met specifieke uitleg:
- `components/ui/README.md` - Specs voor alle UI componenten
- `components/charts/README.md` - Chart voorbeelden
- `app/overview/README.md` - Wat de overview pagina moet doen
- `app/sdg/[id]/README.md` - Detail pagina opbouw
- `app/api/README.md` - API endpoint specificaties

### Stap 3: Begin Klein
Start met één eenvoudig component:
- Maak `Button.tsx`
- Test het door de button in een pagina te gebruiken
- Pas styling aan met Tailwind CSS

### Stap 4: Bouw Stap voor Stap
- Maak eerst de simpele componenten (Button, Input)
- Dan de complexere (FilterBar, Table)
- Gebruik ze in je pagina's
- Voeg data integratie toe

## 💡 Belangrijke Concepten

### Next.js App Router
- **Server Components**: Default, draaien op de server
- **Client Components**: Voor interactiviteit, gebruik `'use client'`
- **Dynamic Routes**: `[id]` in mapnaam voor dynamische pagina's

### React Hooks
- **useState**: Voor state management in components
- **useMemo**: Voor performance bij zware berekeningen
- **useEffect**: Voor side effects (API calls, etc.)

### TypeScript
- Definieer altijd **interfaces** voor props
- Gebruik **types** voor data structuren
- Laat TypeScript je helpen bugs te voorkomen

### Prisma ORM
- **Schema**: Definieert je database structuur
- **Queries**: Type-safe database operaties
- **Migrations**: Versie controle voor je database

### Tailwind CSS
- Utility-first CSS framework
- Responsive design met prefixes (`md:`, `lg:`)
- Dark mode met `dark:` prefix

## 🛠️ Nuttige Commando's

### Development
```bash
npm run dev              # Start development server
npm run build            # Build voor productie
npm run type-check       # Check TypeScript errors
npm run lint             # Check code quality
```

### Database
```bash
npm run db:studio        # Open visuele database editor
npm run db:seed          # Voeg (meer) sample data toe
npm run db:generate      # Regenereer Prisma Client
```

### Database Bekijken
```bash
npm run db:studio        # Prisma Studio (http://localhost:5555)
# OF
open http://localhost:8080   # phpMyAdmin (user: sdg_user, pass: sdg_password)
```

## 🐛 Problemen Oplossen

### Prisma Errors
```bash
npm run db:generate
```

### Project Opnieuw Beginnen
```bash
docker-compose down -v      # Stop en verwijder database
docker-compose up -d         # Start opnieuw
npm run db:push             # Maak tabellen
npm run db:seed             # Voeg data toe
```

## 📖 Externe Documentatie

### Must-Read
- [Next.js Documentatie](https://nextjs.org/docs) - Officiële Next.js docs
- [React Documentatie](https://react.dev/) - Leer React concepten
- [Tailwind CSS](https://tailwindcss.com/docs) - CSS utility classes
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript basics

### Als Je Verder Wilt
- [Prisma Docs](https://www.prisma.io/docs) - Database queries
- [Chart.js Docs](https://www.chartjs.org/docs/) - Grafiek opties
- [Zod Docs](https://zod.dev/) - Data validatie

### SDG Data Bronnen
- [UN SDG Database](https://unstats.un.org/sdgs/dataportal) - Officiële SDG data
- [World Bank](https://data.worldbank.org/) - Economische data
- [Our World in Data](https://ourworldindata.org/) - Visualisaties en data

### Video Tutorials
- [Next.js 14 Tutorial](https://www.youtube.com/watch?v=wm5gMKuwSYk)
- [TypeScript voor Beginners](https://www.youtube.com/watch?v=BwuLxPH8IDs)
- [Prisma Crash Course](https://www.youtube.com/watch?v=RebA5J-rlwg)

## 🎯 Tips voor Succes

### 1. Begin Klein
Probeer niet alles tegelijk te bouwen. Start met één component, test het, en ga dan verder.

### 2. Gebruik de Voorbeelden
Je hebt werkende voorbeelden van componenten. Bestudeer ze, begrijp ze, pas ze aan.

### 3. Test Vaak
Test je code regelmatig in de browser. Fix bugs zodra je ze ziet.

### 4. Lees Error Messages
Error messages vertellen je vaak precies wat er mis is. Lees ze zorgvuldig!

### 5. Google is Je Vriend
Stuck? Google je error message. Grote kans dat iemand anders het ook heeft gehad.

### 6. Gebruik TypeScript
Als TypeScript klaagt, luister dan. Het voorkomt bugs!

### 7. Console.log is Krachtig
Gebruik `console.log()` om te zien wat je variabelen bevatten.

### 8. Git Commits
Commit regelmatig je werk. Elke werkende feature = een commit.

## 🎉 Klaar om te Beginnen?

1. **Start het project** met de commando's hierboven
2. **Open `components/ui/README.md`** - begin daar!
3. **Bouw je eerste component** - Button is een goede start
4. **Vraag om hulp als je vastloopt** - dat hoort erbij!

---

**Veel succes met je project! 🚀**