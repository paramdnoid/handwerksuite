import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@zunftgewerk/ui'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="mb-10 flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="ZunftGewerk Logo"
          width={40}
          height={40}
          className="h-10 w-10"
        />
        <span className="font-display text-xl font-extrabold tracking-tight">
          Zunft<span className="text-foreground/45">Gewerk</span>
        </span>
      </Link>

      <h1 className="font-display mb-4 text-6xl font-extrabold tracking-tight md:text-8xl">
        <span className="animate-gradient-x from-primary bg-linear-to-r via-primary/80 to-amber-500 bg-clip-text text-transparent">
          404
        </span>
      </h1>

      <h2 className="font-display mb-3 text-xl font-bold tracking-tight md:text-2xl">
        Seite nicht gefunden
      </h2>

      <p className="text-muted-foreground mb-8 max-w-md">
        Die angeforderte Seite existiert nicht oder wurde verschoben. Kehren Sie zur Startseite
        zurück, um fortzufahren.
      </p>

      <Button asChild size="lg" className="gap-2">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Zur Startseite
        </Link>
      </Button>
    </div>
  )
}
