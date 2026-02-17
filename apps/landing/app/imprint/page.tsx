import { company } from '@/lib/company'

export const metadata = {
  title: 'Impressum - ZunftGewerk',
  description: `Impressum und rechtliche Angaben der ${company.name}.`,
}

export default function ImpressumPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">Impressum</h1>

      <div className="max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold">Angaben gemäß § 5 TMG</h2>
          <p className="text-muted-foreground">
            {company.name}
            <br />
            {company.street}
            <br />
            {company.zip} {company.city}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Kontakt</h2>
          <p className="text-muted-foreground">
            Telefon: {company.phone}
            <br />
            E-Mail: {company.email}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Vertreten durch</h2>
          <p className="text-muted-foreground">Geschäftsführer: {company.ceo}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Registereintrag</h2>
          <p className="text-muted-foreground">
            Registergericht: {company.court}
            <br />
            Registernummer: {company.registrationNumber}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Umsatzsteuer-ID</h2>
          <p className="text-muted-foreground">
            Umsatzsteuer-Identifikationsnummer gemäß §27 a UStG:
            <br />
            {company.vatId}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Haftungsausschluss</h2>
          <p className="text-muted-foreground">
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
          </p>
        </section>
      </div>
    </div>
  )
}
