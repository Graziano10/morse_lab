# MorseLab

A modern educational web app to learn, translate, listen and practice Morse code.
Built mobile-first with Next.js, TypeScript and Tailwind CSS.

## Features

- **Translator** — Convert text ↔ Morse code instantly
- **Audio Player** — Hear Morse code with configurable WPM (5–40) and frequency (400–900 Hz)
- **Full Dictionary** — A–Z, 0–9 and 7 common symbols with visual dot/dash patterns
- **Practice Mode** — Flashcard-style training with score, accuracy and streak tracking
- **Learn Page** — Theory, timing rules, conventions and examples
- **API Routes** — `POST /api/encode` and `POST /api/decode` for programmatic use
- **Mobile-First** — Responsive from 360px smartphones to full-HD desktops

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 |
| Validation | Zod 4 |
| Audio | Web Audio API |
| Linting | ESLint + eslint-config-next |

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd morse_lab

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## API Reference

### POST /api/encode

Encode plain text to Morse code.

**Request:**
```json
{ "text": "SOS" }
```

**Response:**
```json
{
  "input": "SOS",
  "output": "... --- ...",
  "unsupportedChars": []
}
```

### POST /api/decode

Decode Morse code to plain text.

**Request:**
```json
{ "morse": "... --- ..." }
```

**Response:**
```json
{
  "input": "... --- ...",
  "output": "SOS",
  "unsupportedChars": []
}
```

## Manual Test Examples

### Encode SOS
```bash
curl -X POST http://localhost:3000/api/encode \
  -H "Content-Type: application/json" \
  -d '{"text": "SOS"}'
# Expected: { "output": "... --- ..." }
```

### Decode `... --- ...`
```bash
curl -X POST http://localhost:3000/api/decode \
  -H "Content-Type: application/json" \
  -d '{"morse": "... --- ..."}'
# Expected: { "output": "SOS" }
```

### Encode CIAO MONDO
```bash
curl -X POST http://localhost:3000/api/encode \
  -H "Content-Type: application/json" \
  -d '{"text": "CIAO MONDO"}'
# Expected: { "output": "-.-. .. .- --- / -- --- -. -.. ---" }
```

## Morse Conventions

| Symbol | Meaning |
|--------|---------|
| `.` | Dot (1 unit) |
| `-` | Dash (3 units) |
| ` ` (space) | Letter separator (3 units) |
| `/` | Word separator (7 units) |

**Timing (Paris standard):** 1 WPM = 1200ms per dot unit.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page with hero + translator
│   ├── learn/page.tsx        # Learning guide + full dictionary
│   ├── practice/page.tsx     # Practice mode
│   ├── api/
│   │   ├── encode/route.ts   # POST /api/encode
│   │   └── decode/route.ts   # POST /api/decode
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # Button, Card, Badge, Slider, Textarea, Input
│   ├── morse/
│   │   ├── MorseTranslator.tsx
│   │   ├── MorsePlayer.tsx
│   │   ├── MorseDictionaryTable.tsx
│   │   └── PracticeCard.tsx
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── morse/
│   │   ├── dictionary.ts     # Complete Morse dictionary + Maps
│   │   ├── encode.ts         # Pure encode function
│   │   ├── decode.ts         # Pure decode function
│   │   ├── timing.ts         # WPM -> timing calculation
│   │   └── random.ts         # Random question generator
│   ├── audio/
│   │   └── playMorse.ts      # Web Audio API player
│   ├── validators/
│   │   └── morseSchemas.ts   # Zod schemas
│   └── utils.ts              # cn() utility
├── stores/
│   └── practiceStore.ts      # Zustand practice state
├── types/
│   └── morse.ts              # TypeScript interfaces
└── config/
    └── future-db-notes.md    # PostgreSQL integration plan
```

## Future Roadmap

- [ ] PostgreSQL + Prisma integration (see `src/config/future-db-notes.md`)
- [ ] User accounts and persistent scores
- [ ] Lesson curriculum with progress tracking
- [ ] Leaderboard
- [ ] Keyboard training mode (tap `.` and `-` keys)
- [ ] i18n support

## License

MIT
