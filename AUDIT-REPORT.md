# ZunftGewerk Monorepo – Strukturaudit & Best-Practice-Analyse

**Datum:** 18. Februar 2026
**Scope:** Gesamte Monorepo-Struktur, Tooling, CI/CD, Testing, Security, DX

---

## Gesamtbewertung

| Kategorie                | Score | Status              |
| ------------------------ | ----- | ------------------- |
| Monorepo-Architektur     | 9/10  | Exzellent           |
| Package-Organisation     | 8/10  | Sehr gut            |
| TypeScript-Konfiguration | 8/10  | Sehr gut            |
| Linting & Formatting     | 5/10  | Verbesserungsbedarf |
| Testing                  | 2/10  | Kritisch            |
| CI/CD                    | 0/10  | Fehlt komplett      |
| Security-Architektur     | 9/10  | Exzellent           |
| Developer Experience     | 6/10  | Gut, aber Lücken    |
| Dokumentation            | 5/10  | Ausbaufähig         |
| Docker/Infrastruktur     | 7/10  | Gut                 |

**Gesamtscore: 5.9/10** – Starke Architektur-Basis, aber kritische Lücken bei Testing und CI/CD.

---

## 1. Was bereits Enterprise-Niveau hat

### 1.1 Monorepo-Architektur (Exzellent)

Die Grundstruktur `apps/` → `packages/` → `services/` folgt exakt dem Enterprise-Standard (Vercel, Shopify, etc.). Turborepo mit pnpm-Workspaces ist die richtige Wahl. Der `dependency-cruiser` verhindert zirkuläre Abhängigkeiten und verbotene App-zu-App-Imports – das sieht man selten, selbst in großen Projekten.

### 1.2 Package-Grenzen & Exports

Die `exports`-Felder in den `package.json`-Dateien sind sauber definiert mit klaren Entry Points:

```json
"exports": {
  ".": "./src/index.ts",
  "./schema": "./src/schema/index.ts",
  "./client": "./src/client.ts"
}
```

Das verhindert unkontrollierten Deep-Import und ist Enterprise Best Practice.

### 1.3 Security-Architektur (Exzellent)

Envelope Encryption (AES-256-GCM) mit DEK/KEK-Hierarchie, OpenBao Transit Engine, PostgreSQL Row-Level Security und AAD-basierter Cross-Tenant-Schutz – das ist Enterprise-Grade Security auf einem Niveau, das viele SaaS-Produkte nicht erreichen.

### 1.4 Multi-Tenancy & Datenmodell

Die Schema-Architektur mit `company_id`-basierter Isolation, RLS-Policies und dem PowerSync-Bucket-System ist durchdacht und DSGVO-konform.

### 1.5 TypeScript Shared Config

Die drei `tsconfig`-Presets (`base.json`, `library.json`, `nextjs.json`) in `packages/config/typescript/` eliminieren Konfigurationsdrift – genau richtig.

---

## 2. Kritische Probleme (Sofort beheben)

### 2.1 KRITISCH: Keine CI/CD-Pipeline

**Problem:** Es gibt kein `.github/workflows/`-Verzeichnis. Kein automatisierter Build, kein automatisierter Test, kein automatisiertes Deployment.

**Warum Enterprise-kritisch:** Ohne CI/CD kann jeder Push die Produktion brechen. Kein Reviewschutz, kein Quality Gate.

**Empfehlung:** GitHub Actions Workflow erstellen:

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm format:check
      - run: pnpm dep:check
      - run: pnpm test
      - run: pnpm build
```

### 2.2 KRITISCH: Keine Tests vorhanden

**Problem:** Es gibt **null** Testdateien im gesamten Projekt. `vitest` ist als devDependency in `packages/api` und `packages/crypto` installiert, aber es existieren weder `vitest.config.ts`-Dateien noch `*.test.ts`-Dateien. Die `pnpm test`-Scripts sind Luftnummern.

**Warum Enterprise-kritisch:** Bei einer App mit Verschlüsselung, Multi-Tenancy und Billing ist das ein Risiko. Ein Fehler in `packages/crypto/envelope.ts` kann zu Datenverlust führen.

**Prioritäten für Testing:**

1. **packages/crypto/** – Unit Tests für Encryption/Decryption, Key-Rotation, AAD-Validierung
2. **packages/api/** – Integration Tests für tRPC-Router mit Auth-Kontext
3. **packages/db/** – Schema-Tests und Seed-Validierung
4. **packages/auth/** – Auth-Flow Tests (Login, 2FA, OAuth)
5. **packages/stripe/** – Webhook-Handler Tests

**Empfehlung:** Shared Vitest-Config als Package erstellen:

```
packages/config/vitest/
├── package.json          # @zunftgewerk/vitest-config
├── base.ts               # Shared Vitest-Konfiguration
└── integration.ts        # Für DB/API-Tests mit Setup
```

### 2.3 KRITISCH: Biome installiert aber nicht konfiguriert

**Problem:** `@biomejs/biome` ist als Root-devDependency installiert, aber es gibt keine `biome.json`. Gleichzeitig nutzt das Projekt ESLint + Prettier. Das ist verwirrend und ineffizient.

**Empfehlung:** Entscheide dich für EINEN Stack:

| Option                          | Vorteile                                               | Nachteile              |
| ------------------------------- | ------------------------------------------------------ | ---------------------- |
| **Biome only** (empfohlen)      | 10-100x schneller, ein Tool statt drei, weniger Config | Migration nötig        |
| **ESLint + Prettier** (aktuell) | Ökosystem-Kompatibilität, mehr Regeln                  | Langsamer, mehr Config |

Bei Wahl von Biome: ESLint-Configs + Prettier entfernen, `biome.json` in Root erstellen.

---

## 3. Wichtige Verbesserungen (Zeitnah)

### 3.1 Fehlende Prettier-Konfiguration

**Problem:** `prettier --write` wird in Scripts und lint-staged verwendet, aber es gibt keine `.prettierrc` oder `prettier.config.mjs`. Das Projekt nutzt also Prettier-Defaults, was funktioniert – aber jeder Editor könnte unterschiedliche Defaults haben.

**Empfehlung:**

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 3.2 `services/` fehlt in pnpm-workspace.yaml

**Problem:** Die `pnpm-workspace.yaml` definiert nur `apps/*` und `packages/*`, aber nicht `services/*`. Das ist kein Breaking Issue, aber die Services könnten eigene `package.json`-Dateien für Tooling bekommen.

### 3.3 Inkonsistente lucide-react Versionen

**Problem:**

- `apps/landing`: `lucide-react@^0.564.0`
- `apps/web`: `lucide-react@^0.574.0`
- `packages/ui`: `lucide-react@^0.460.0`

**Empfehlung:** Eine Version als peerDependency in `packages/ui` definieren und in den Apps als Dependency. Alternativ: pnpm `overrides` im Root `package.json`:

```json
"pnpm": {
  "overrides": {
    "lucide-react": "^0.574.0"
  }
}
```

### 3.4 Fehlender `.prettierignore` / `.eslintignore`

**Problem:** `pnpm format` läuft über `**/*.{ts,tsx,...}` – das könnte theoretisch in `node_modules` oder `dist` Dateien treffen (Prettier ignoriert `node_modules` standardmäßig, aber explizit ist besser).

**Empfehlung:**

```
# .prettierignore
node_modules
dist
.next
.turbo
pnpm-lock.yaml
```

### 3.5 Kein `.nvmrc` oder `.node-version`

**Problem:** `engines.node >= 20.0.0` ist definiert, aber ohne `.nvmrc` kann ein Teammitglied versehentlich Node 18 nutzen.

**Empfehlung:**

```
# .nvmrc
20
```

### 3.6 Fehlende `CODEOWNERS`

**Problem:** Ohne `CODEOWNERS` gibt es keinen automatischen Review-Assignment in GitHub PRs.

**Empfehlung:**

```
# .github/CODEOWNERS
* @zunftgewerk/core-team
packages/crypto/ @zunftgewerk/security-team
packages/db/ @zunftgewerk/backend-team
packages/ui/ @zunftgewerk/frontend-team
```

---

## 4. Empfehlungen (Mittelfristig)

### 4.1 Turbo Remote Caching

**Problem:** Turbo läuft lokal ohne Remote Cache. Bei wachsendem Team wird das zum Bottleneck.

**Empfehlung:** Vercel Remote Cache oder selbst-gehosted (Turborepo mit S3-Backend).

### 4.2 Changesets für Versionierung

**Problem:** Alle Packages stehen auf `0.0.1` bzw. `0.0.0`. Wenn das Projekt wächst und Packages ggf. extern genutzt werden, fehlt ein Versioning-System.

**Empfehlung:** `@changesets/cli` einrichten für automatisierte Changelogs und Versionierung.

### 4.3 E2E-Testing Framework

**Problem:** `test:e2e` Script ist definiert, aber kein Playwright/Cypress installiert oder konfiguriert.

**Empfehlung:** Playwright empfohlen (schneller, besserer Multi-Browser-Support):

```
packages/config/playwright/
├── package.json
└── base.config.ts
```

### 4.4 Docker Compose für Entwicklung härten

**Problem:** `docker-compose.yml` nutzt dev-Tokens und einfache Passwörter. Das ist für lokale Entwicklung okay, aber ein `docker-compose.prod.yml` fehlt komplett.

### 4.5 Monitoring & Observability vorbereiten

**Problem:** Kein Sentry, kein OpenTelemetry, kein Health-Check-Endpoint in den Next.js-Apps.

**Empfehlung:** `packages/monitoring/` erstellen mit Sentry + OpenTelemetry Setup.

### 4.6 Commit-Konventionen

**Problem:** Kein Commitlint oder Conventional Commits konfiguriert. Ohne das wird der Git-Log bei mehreren Entwicklern schnell unübersichtlich.

**Empfehlung:** `@commitlint/cli` + `@commitlint/config-conventional` im Husky pre-commit oder commit-msg Hook.

---

## 5. Fehlende Enterprise-Standard-Dateien

| Datei                               | Status   | Priorität                   |
| ----------------------------------- | -------- | --------------------------- |
| `.github/workflows/ci.yml`          | Fehlt    | Kritisch                    |
| `.github/CODEOWNERS`                | Fehlt    | Hoch                        |
| `.github/pull_request_template.md`  | Fehlt    | Mittel                      |
| `.github/ISSUE_TEMPLATE/`           | Fehlt    | Niedrig                     |
| `.prettierrc`                       | Fehlt    | Hoch                        |
| `.prettierignore`                   | Fehlt    | Mittel                      |
| `.nvmrc`                            | Fehlt    | Hoch                        |
| `biome.json` (oder Biome entfernen) | Fehlt    | Hoch                        |
| `vitest.workspace.ts`               | Fehlt    | Kritisch                    |
| `commitlint.config.js`              | Fehlt    | Mittel                      |
| `CONTRIBUTING.md`                   | Fehlt    | Mittel                      |
| `LICENSE`                           | Fehlt    | Hoch (kommerziell relevant) |
| `docker-compose.prod.yml`           | Fehlt    | Mittel                      |
| `Makefile` oder `justfile`          | Optional | Niedrig                     |

---

## 6. Dependency-Hygiene

### Positiv

- `pnpm` mit striktem Hoisting
- `dependency-cruiser` für Architectural Rules
- Klare `peerDependencies` in `packages/ui`

### Zu prüfen

- **Doppelte Formatter:** Biome UND Prettier installiert → einen entfernen
- **lucide-react Version-Drift** → `pnpm overrides` einsetzen
- **Keine `pnpm.peerDependencyRules`** → Warnings bei Install unterdrücken oder fixen
- **`lint-staged` referenziert ESLint** → wenn Biome gewählt wird, anpassen

---

## 7. Priorisierte Maßnahmen-Roadmap

### Phase 1 – Sofort (1-2 Tage)

1. CI/CD-Pipeline mit GitHub Actions erstellen
2. `.nvmrc` mit Node 20 erstellen
3. Entscheidung Biome vs. ESLint+Prettier treffen und bereinigen
4. `.prettierrc` (oder `biome.json`) erstellen
5. `.prettierignore` erstellen

### Phase 2 – Diese Woche (3-5 Tage)

6. Vitest Workspace-Config erstellen
7. Unit Tests für `packages/crypto` schreiben (Encryption ist geschäftskritisch)
8. Unit Tests für `packages/api` Router schreiben
9. `CODEOWNERS` erstellen
10. `pnpm overrides` für lucide-react Version-Drift

### Phase 3 – Nächste 2 Wochen

11. Playwright E2E-Tests für Auth-Flows
12. Commitlint + Conventional Commits einrichten
13. PR-Template und Issue-Templates erstellen
14. Turbo Remote Caching aktivieren
15. `packages/monitoring` mit Sentry erstellen

### Phase 4 – Nächster Monat

16. Changesets für Versionierung
17. Docker Compose Production-Config
18. OpenTelemetry Integration
19. CONTRIBUTING.md verfassen
20. Security Audit der OpenBao-Konfiguration für Production

---

## Zusammenfassung

Das ZunftGewerk-Monorepo hat eine **hervorragende architektonische Basis** – die Package-Trennung, Security-Architektur und das Multi-Tenant-Design sind auf Enterprise-Niveau. Die beiden kritischsten Lücken sind das **komplette Fehlen von CI/CD** und **Tests**. Ohne diese beiden Säulen ist die restliche Architektur zwar elegant, aber nicht abgesichert.

Die gute Nachricht: Die Struktur ist so sauber, dass CI/CD und Testing relativ schmerzfrei eingeführt werden können, weil die Package-Grenzen klar sind und Turbo die Orchestrierung übernimmt.
