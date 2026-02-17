"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@handwerksuite/ui";
import { useAuth } from "@handwerksuite/app-core";
import { CRAFT_TYPE_INFO, type CraftTypeValue } from "@handwerksuite/types";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    businessName: "",
    craftType: "" as CraftTypeValue | "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.passwordConfirm) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    if (form.password.length < 12) {
      setError("Das Passwort muss mindestens 12 Zeichen lang sein.");
      return;
    }

    try {
      await signUp(form.email, form.password, form.name);
      router.push("/dashboard");
    } catch {
      setError("Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

  const craftTypes = Object.entries(CRAFT_TYPE_INFO).sort((a, b) =>
    a[1].label.localeCompare(b[1].label, "de"),
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Betrieb registrieren</CardTitle>
          <CardDescription>
            Erstellen Sie Ihr HandwerkSuite-Konto und starten Sie kostenlos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Ihr Name</Label>
                <Input
                  id="name"
                  placeholder="Max Müller"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="max@betrieb.de"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Betriebsname</Label>
              <Input
                id="businessName"
                placeholder="Müller Elektrotechnik GmbH"
                value={form.businessName}
                onChange={(e) =>
                  setForm({ ...form, businessName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="craftType">Gewerk</Label>
              <select
                id="craftType"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.craftType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    craftType: e.target.value as CraftTypeValue,
                  })
                }
                required
              >
                <option value="">Gewerk auswählen...</option>
                {craftTypes.map(([value, info]) => (
                  <option key={value} value={value}>
                    {info.label}
                    {info.requiresMeisterbrief ? " (Meisterpflicht)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  minLength={12}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Passwort bestätigen</Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  value={form.passwordConfirm}
                  onChange={(e) =>
                    setForm({ ...form, passwordConfirm: e.target.value })
                  }
                  required
                  minLength={12}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Mindestens 12 Zeichen. Verwenden Sie Groß- und Kleinbuchstaben,
              Zahlen und Sonderzeichen.
            </p>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Wird registriert..." : "Kostenlos registrieren"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Bereits registriert?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Jetzt anmelden
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
