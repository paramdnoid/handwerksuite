"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Input,
  Label,
  Separator,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@zunftgewerk/ui";
import { Shield, Smartphone, Monitor, Globe, LogOut } from "lucide-react";
import { mockSessions } from "@/lib/mock-data";

export default function SecurityPage() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async () => {
    setIsChangingPassword(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsChangingPassword(false);
    toast.success("Passwort erfolgreich geändert");
  };

  return (
    <>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Sicherheit
        </h1>
        <p className="text-muted-foreground mt-1">
          Schützen Sie Ihr Konto mit starkem Passwort und
          Zwei-Faktor-Authentifizierung.
        </p>
      </div>

      {/* Passwort ändern */}
      <Card>
        <CardHeader>
          <CardTitle>Passwort ändern</CardTitle>
          <CardDescription>
            Verwenden Sie ein sicheres Passwort mit mindestens 12 Zeichen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Aktuelles Passwort</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">Neues Passwort</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Passwort bestätigen</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
            >
              {isChangingPassword
                ? "Wird geändert..."
                : "Passwort ändern"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2FA */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Zwei-Faktor-Authentifizierung</CardTitle>
              <CardDescription>
                Zusätzliche Sicherheitsebene für Ihr Konto.
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1.5">
              <Shield className="size-3" />
              Inaktiv
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Die Zwei-Faktor-Authentifizierung schützt Ihr Konto durch einen
            zusätzlichen Code bei der Anmeldung. Verwenden Sie eine
            Authenticator-App wie Google Authenticator oder Authy.
          </p>
          <Button variant="outline">
            <Smartphone className="mr-2 size-4" />
            2FA aktivieren
          </Button>
        </CardContent>
      </Card>

      {/* Aktive Sitzungen */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aktive Sitzungen</CardTitle>
              <CardDescription>
                Geräte, auf denen Sie aktuell angemeldet sind.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.success("Alle anderen Sitzungen wurden beendet")
              }
            >
              <LogOut className="mr-2 size-4" />
              Alle abmelden
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockSessions.map((session) => {
            const DeviceIcon = session.device.includes("iPhone")
              ? Smartphone
              : session.device.includes("Chrome") ||
                  session.device.includes("Firefox") ||
                  session.device.includes("Safari")
                ? session.device.includes("macOS") ||
                  session.device.includes("Windows")
                  ? Monitor
                  : Globe
                : Monitor;

            return (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <DeviceIcon className="size-5 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{session.device}</p>
                      {session.isCurrent && (
                        <Badge variant="secondary" className="text-xs">
                          Aktuell
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      IP: {session.ip} · Zuletzt aktiv:{" "}
                      {session.lastActive.toLocaleDateString("de-DE")}{" "}
                      {session.lastActive.toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toast.success("Sitzung wurde beendet")
                    }
                  >
                    Beenden
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Gefahrenzone</CardTitle>
          <CardDescription>
            Irreversible Aktionen für Ihr Konto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Account löschen</p>
              <p className="text-sm text-muted-foreground">
                Alle Daten werden unwiderruflich gelöscht. Diese Aktion kann
                nicht rückgängig gemacht werden.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive shrink-0">
                  Account löschen
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Account unwiderruflich löschen?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Alle Ihre Daten, Projekte, Kunden und Rechnungen werden
                    permanent gelöscht. Team-Mitglieder verlieren ihren Zugang.
                    Diese Aktion kann nicht rückgängig gemacht werden.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-2 py-2">
                  <Label htmlFor="delete-confirm">
                    Geben Sie Ihr Passwort zur Bestätigung ein
                  </Label>
                  <Input id="delete-confirm" type="password" />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Endgültig löschen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
