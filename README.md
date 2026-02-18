# ZunftGewerk

Die digitale Enterprise-Plattform für Handwerksbetriebe – offline-fähig, verschlüsselt und DSGVO-konform.

## Architektur

```
handwerksuite/
├── apps/
│   ├── landing/          # Next.js 15 – Landing, Auth, Subscription (Port 3000)
│   ├── web/              # Next.js 15 – Haupt-App mit IndexedDB (Port 3001)
│   ├── desktop/          # Tauri v2 – Mac + Windows (natives SQLite)
│   └── mobile/           # Capacitor 6 – iOS + Android (natives SQLite)
│
├── packages/
│   ├── ui/               # shadcn/ui v4 Design System (Tailwind CSS v4)
│   ├── db/               # Drizzle ORM Schemas + Migrations (PostgreSQL)
│   ├── api/              # tRPC Router + Server-Logik
│   ├── auth/             # Better Auth (E-Mail, OAuth, 2FA, Organisationen)
│   ├── crypto/           # AES-256-GCM Envelope Encryption + Field-Level
│   ├── sync/             # PowerSync Offline-First Sync Engine
│   ├── app-core/         # Shared App-Logik (React Hooks, tRPC Client)
│   ├── types/            # Shared TypeScript Types
│   └── config/           # Shared ESLint, TypeScript, Tailwind Konfiguration
│
├── services/
│   ├── openbao/          # OpenBao (Vault-Fork) Key Management
│   └── postgres/         # PostgreSQL RLS Policies
│
└── docker/               # Docker Compose für lokale Entwicklung
```

## Tech-Stack

| Bereich    | Technologie                    | Lizenz             |
| ---------- | ------------------------------ | ------------------ |
| Monorepo   | Turborepo + pnpm               | MIT                |
| Frontend   | Next.js 15 + React 19          | MIT                |
| UI         | shadcn/ui v4 + Tailwind CSS v4 | MIT                |
| Desktop    | Tauri v2                       | MIT/Apache-2.0     |
| Mobile     | Capacitor 6                    | MIT                |
| Auth       | Better Auth                    | MIT                |
| API        | tRPC 11                        | MIT                |
| ORM        | Drizzle ORM                    | Apache-2.0         |
| Database   | PostgreSQL 16                  | PostgreSQL License |
| Offline-DB | SQLite (wa-sqlite / nativ)     | Public Domain      |
| Sync       | PowerSync (self-hosted)        | Apache-2.0         |
| Encryption | Node.js crypto (AES-256-GCM)   | MIT                |
| Key Mgmt   | OpenBao (Vault-Fork)           | MPL-2.0            |
| Billing    | Stripe                         | Proprietaer (SaaS) |

## Sicherheitsarchitektur

- **AES-256-GCM Envelope Encryption** mit mehrstufiger Schlüsselhierarchie (DEK/KEK)
- **Field-Level Encryption** für personenbezogene Daten (DSGVO Art. 32)
- **AAD-basierter Cross-Tenant-Schutz** – Verschlüsselung bindet Daten kryptografisch an den Tenant
- **OpenBao Transit Engine** – Enterprise Key Management mit automatischer Key-Rotation
- **PostgreSQL Row-Level Security** – Datenbank-seitige Tenant-Isolation

## Schnellstart

### Voraussetzungen

- Node.js >= 20
- pnpm >= 9
- Docker & Docker Compose
- (Optional) Rust – für Tauri Desktop-App
- (Optional) Xcode/Android Studio – für Mobile-App

### Entwicklung starten

```bash
# 1. Dependencies installieren
pnpm install

# 2. Infrastruktur starten (PostgreSQL, OpenBao, PowerSync)
cd docker && docker compose up -d

# 3. OpenBao Transit Engine einrichten
cd ../services/openbao && ./setup-dev.sh

# 4. Datenbank-Migrations ausführen
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 5. .env einrichten
cp .env.example .env
# → Werte anpassen

# 6. Entwicklungsserver starten
pnpm dev               # Alle Apps
pnpm dev:landing       # Nur Landing (Port 3000)
pnpm dev:web           # Nur Web-App (Port 3001)
pnpm dev:desktop       # Nur Desktop (Tauri)
```

## Multi-Tenancy

- **Handwerksbetriebe** registrieren sich über die Landing-App
- **Behörden** (HWK, Kreishandwerkerschaften) erhalten separaten Zugang
- **Zuordnung** über `authority_assignments` – Behörden sehen nur zugewiesene Betriebe
- **Isolation** durch PostgreSQL RLS + AAD-gebundene Encryption

## Lizenz

Alle verwendeten Pakete sind Open Source. Siehe Tabelle oben für Details.
