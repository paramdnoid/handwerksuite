"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@zunftgewerk/ui";
import { mockCompany, mockCompanySettings } from "@/lib/mock-data";

export default function CompanyPage() {
  const [isSaving, setIsSaving] = useState<string | null>(null);

  const handleSave = async (section: string) => {
    setIsSaving(section);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(null);
    toast.success(`${section} erfolgreich gespeichert`);
  };

  return (
    <>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Unternehmen
        </h1>
        <p className="text-muted-foreground mt-1">
          Verwalten Sie die Stammdaten und Einstellungen Ihres Betriebs.
        </p>
      </div>

      {/* Basisinformationen */}
      <Card>
        <CardHeader>
          <CardTitle>Basisinformationen</CardTitle>
          <CardDescription>
            Grundlegende Informationen über Ihren Betrieb.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Firmenname</Label>
              <Input id="name" defaultValue={mockCompany.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalName">Rechtsform / Vollständiger Name</Label>
              <Input
                id="legalName"
                defaultValue={mockCompany.legalName ?? ""}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="craftType">Gewerk</Label>
              <Select defaultValue="shk">
                <SelectTrigger id="craftType">
                  <SelectValue placeholder="Gewerk wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shk">
                    Sanitär, Heizung, Klima (SHK)
                  </SelectItem>
                  <SelectItem value="maler">Maler & Lackierer</SelectItem>
                  <SelectItem value="schornsteinfeger">
                    Schornsteinfeger
                  </SelectItem>
                  <SelectItem value="elektriker">Elektrotechnik</SelectItem>
                  <SelectItem value="dachdecker">Dachdecker</SelectItem>
                  <SelectItem value="tischler">Tischler</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL-Kennung</Label>
              <Input id="slug" defaultValue={mockCompany.slug} disabled />
              <p className="text-xs text-muted-foreground">
                Kann nicht geändert werden.
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button
              onClick={() => handleSave("Basisinformationen")}
              disabled={isSaving === "Basisinformationen"}
            >
              {isSaving === "Basisinformationen"
                ? "Speichern..."
                : "Speichern"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Steuerdaten */}
      <Card>
        <CardHeader>
          <CardTitle>Steuerdaten</CardTitle>
          <CardDescription>
            Steuerliche Informationen für die Rechnungsstellung.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="taxId">Steuernummer</Label>
              <Input id="taxId" defaultValue={mockCompany.taxId ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vatId">USt-IdNr.</Label>
              <Input id="vatId" defaultValue={mockCompany.vatId ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hwkNumber">HWK-Nummer</Label>
              <Input
                id="hwkNumber"
                defaultValue={mockCompany.hwkNumber ?? ""}
              />
            </div>
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button
              onClick={() => handleSave("Steuerdaten")}
              disabled={isSaving === "Steuerdaten"}
            >
              {isSaving === "Steuerdaten" ? "Speichern..." : "Speichern"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Betriebseinstellungen */}
      <Card>
        <CardHeader>
          <CardTitle>Betriebseinstellungen</CardTitle>
          <CardDescription>
            Lokalisierung und Rechnungseinstellungen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="locale">Sprache</Label>
              <Select defaultValue={mockCompanySettings.locale}>
                <SelectTrigger id="locale">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de-DE">Deutsch (Deutschland)</SelectItem>
                  <SelectItem value="de-AT">Deutsch (Österreich)</SelectItem>
                  <SelectItem value="de-CH">Deutsch (Schweiz)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Zeitzone</Label>
              <Select defaultValue={mockCompanySettings.timezone}>
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Berlin">Europe/Berlin</SelectItem>
                  <SelectItem value="Europe/Vienna">Europe/Vienna</SelectItem>
                  <SelectItem value="Europe/Zurich">Europe/Zurich</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Währung</Label>
              <Select defaultValue={mockCompanySettings.currency}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="CHF">Schweizer Franken (CHF)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Standard-Steuersatz (%)</Label>
              <Input
                id="taxRate"
                type="number"
                defaultValue={mockCompanySettings.defaultTaxRate}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Rechnungspräfix</Label>
              <Input
                id="invoicePrefix"
                defaultValue={mockCompanySettings.invoicePrefix ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscalYear">Geschäftsjahr beginnt</Label>
              <Select
                defaultValue={String(
                  mockCompanySettings.fiscalYearStartMonth,
                )}
              >
                <SelectTrigger id="fiscalYear">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Januar</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="7">Juli</SelectItem>
                  <SelectItem value="10">Oktober</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button
              onClick={() => handleSave("Betriebseinstellungen")}
              disabled={isSaving === "Betriebseinstellungen"}
            >
              {isSaving === "Betriebseinstellungen"
                ? "Speichern..."
                : "Speichern"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
