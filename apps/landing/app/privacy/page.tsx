import { company } from '@/lib/company'

export const metadata = {
  title: 'Datenschutzerklärung - ZunftGewerk',
  description: `Datenschutzerklärung der ${company.name} gemäß DSGVO.`,
}

export default function DatenschutzPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">Datenschutzerklärung</h1>

      <div className="max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold">1. Verantwortlicher</h2>
          <p className="text-muted-foreground">
            {company.name}
            <br />
            {company.street}
            <br />
            {company.zip} {company.city}
            <br />
            E-Mail: {company.privacyEmail}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            2. Erhebung und Speicherung personenbezogener Daten
          </h2>
          <p className="text-muted-foreground">
            Wir erheben personenbezogene Daten, wenn Sie unsere Software nutzen, sich registrieren
            oder mit uns in Kontakt treten. Dies umfasst:
          </p>
          <ul className="text-muted-foreground list-disc pl-6">
            <li>Name, E-Mail-Adresse, Telefonnummer</li>
            <li>Firmendaten und Geschäftsadresse</li>
            <li>Nutzungsdaten und technische Informationen</li>
            <li>Kundendaten, die Sie in der Software erfassen</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Zweck der Datenverarbeitung</h2>
          <p className="text-muted-foreground">Ihre Daten werden verarbeitet zur:</p>
          <ul className="text-muted-foreground list-disc pl-6">
            <li>Bereitstellung und Verbesserung unserer Software (Art. 6 Abs. 1 lit. b DSGVO)</li>
            <li>Kommunikation und Kundenservice (Art. 6 Abs. 1 lit. b DSGVO)</li>
            <li>Abrechnung und Zahlungsabwicklung (Art. 6 Abs. 1 lit. b DSGVO)</li>
            <li>Produktanalyse und -verbesserung (Art. 6 Abs. 1 lit. f DSGVO)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Ihre Rechte (DSGVO)</h2>
          <p className="text-muted-foreground">Sie haben das Recht auf:</p>
          <ul className="text-muted-foreground list-disc pl-6">
            <li>
              <strong>Auskunft</strong> über Ihre gespeicherten Daten (Art. 15 DSGVO)
            </li>
            <li>
              <strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)
            </li>
            <li>
              <strong>Löschung</strong> Ihrer Daten (Art. 17 DSGVO)
            </li>
            <li>
              <strong>Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO)
            </li>
            <li>
              <strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)
            </li>
            <li>
              <strong>Widerspruch</strong> gegen die Verarbeitung (Art. 21 DSGVO)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Auftragsverarbeitung</h2>
          <p className="text-muted-foreground">Wir setzen folgende Auftragsverarbeiter ein:</p>
          <ul className="text-muted-foreground list-disc pl-6">
            <li>
              Eigene JWT-basierte Authentifizierung - Daten verbleiben auf unseren Servern (EU)
            </li>
            <li>Vercel (Hosting) - USA, EU-Standardvertragsklauseln</li>
            <li>Railway (API-Hosting) - EU</li>
            <li>Cloudflare (CDN, Storage) - Global, EU-Standardvertragsklauseln</li>
            <li>Sentry (Fehlerüberwachung) - USA, EU-Standardvertragsklauseln</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Kontakt</h2>
          <p className="text-muted-foreground">
            Bei Fragen zum Datenschutz wenden Sie sich an:
            <br />
            {company.privacyEmail}
          </p>
        </section>

        <p className="text-muted-foreground text-sm">Stand: Februar 2026</p>
      </div>
    </div>
  )
}
