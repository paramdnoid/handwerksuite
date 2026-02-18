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
import {
  updateCompanyAction,
  updateTaxDataAction,
  updateCompanySettingsAction,
} from "@/lib/actions/company";

interface CompanyFormProps {
  company: {
    id: string;
    name: string;
    legalName: string | null;
    slug: string;
    craftType: string | null;
    taxId: string | null;
    vatId: string | null;
    hwkNumber: string | null;
  };
  settings: {
    locale: string;
    timezone: string;
    currency: string;
    defaultTaxRate: string | number;
    invoicePrefix: string | null;
    fiscalYearStartMonth: number;
  } | null;
}

export function CompanyForm({ company, settings }: CompanyFormProps) {
  const [isSaving, setIsSaving] = useState<string | null>(null);

  const handleSubmit = async (
    section: string,
    action: (formData: FormData) => Promise<{ success: boolean; error?: string }>,
    form: HTMLFormElement,
  ) => {
    setIsSaving(section);
    const formData = new FormData(form);
    const result = await action(formData);
    setIsSaving(null);

    if (result.success) {
      toast.success(`${section} erfolgreich gespeichert`);
    } else {
      toast.error(result.error ?? "Fehler beim Speichern");
    }
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

      <Card>
        <CardHeader>
          <CardTitle>Basisinformationen</CardTitle>
          <CardDescription>
            Grundlegende Informationen über Ihren Betrieb.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(
                "Basisinformationen",
                updateCompanyAction,
                e.currentTarget,
              );
            }}
            className="space-y-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Firmenname</Label>
                <Input id="name" name="name" defaultValue={company.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="legalName">
                  Rechtsform / Vollständiger Name
                </Label>
                <Input
                  id="legalName"
                  name="legalName"
                  defaultValue={company.legalName ?? ""}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="craftType">Gewerk</Label>
                <Select
                  name="craftType"
                  defaultValue={company.craftType ?? ""}
                >
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
                    <SelectItem value="elektro">Elektrotechnik</SelectItem>
                    <SelectItem value="dachdecker">Dachdecker</SelectItem>
                    <SelectItem value="tischler">Tischler</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL-Kennung</Label>
                <Input id="slug" defaultValue={company.slug} disabled />
                <p className="text-xs text-muted-foreground">
                  Kann nicht geändert werden.
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving === "Basisinformationen"}
              >
                {isSaving === "Basisinformationen"
                  ? "Speichern..."
                  : "Speichern"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Steuerdaten</CardTitle>
          <CardDescription>
            Steuerliche Informationen für die Rechnungsstellung.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(
                "Steuerdaten",
                updateTaxDataAction,
                e.currentTarget,
              );
            }}
            className="space-y-6"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="taxId">Steuernummer</Label>
                <Input
                  id="taxId"
                  name="taxId"
                  defaultValue={company.taxId ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vatId">USt-IdNr.</Label>
                <Input
                  id="vatId"
                  name="vatId"
                  defaultValue={company.vatId ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hwkNumber">HWK-Nummer</Label>
                <Input
                  id="hwkNumber"
                  name="hwkNumber"
                  defaultValue={company.hwkNumber ?? ""}
                />
              </div>
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving === "Steuerdaten"}>
                {isSaving === "Steuerdaten" ? "Speichern..." : "Speichern"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {settings && (
        <Card>
          <CardHeader>
            <CardTitle>Betriebseinstellungen</CardTitle>
            <CardDescription>
              Lokalisierung und Rechnungseinstellungen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(
                  "Betriebseinstellungen",
                  updateCompanySettingsAction,
                  e.currentTarget,
                );
              }}
              className="space-y-6"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="locale">Sprache</Label>
                  <Select name="locale" defaultValue={settings.locale}>
                    <SelectTrigger id="locale">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de-DE">
                        Deutsch (Deutschland)
                      </SelectItem>
                      <SelectItem value="de-AT">
                        Deutsch (Österreich)
                      </SelectItem>
                      <SelectItem value="de-CH">
                        Deutsch (Schweiz)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zeitzone</Label>
                  <Select name="timezone" defaultValue={settings.timezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Berlin">
                        Europe/Berlin
                      </SelectItem>
                      <SelectItem value="Europe/Vienna">
                        Europe/Vienna
                      </SelectItem>
                      <SelectItem value="Europe/Zurich">
                        Europe/Zurich
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Währung</Label>
                  <Select name="currency" defaultValue={settings.currency}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="CHF">
                        Schweizer Franken (CHF)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultTaxRate">
                    Standard-Steuersatz (%)
                  </Label>
                  <Input
                    id="defaultTaxRate"
                    name="defaultTaxRate"
                    type="text"
                    defaultValue={String(settings.defaultTaxRate)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Rechnungspräfix</Label>
                  <Input
                    id="invoicePrefix"
                    name="invoicePrefix"
                    defaultValue={settings.invoicePrefix ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiscalYearStartMonth">
                    Geschäftsjahr beginnt
                  </Label>
                  <Select
                    name="fiscalYearStartMonth"
                    defaultValue={String(settings.fiscalYearStartMonth)}
                  >
                    <SelectTrigger id="fiscalYearStartMonth">
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
                  type="submit"
                  disabled={isSaving === "Betriebseinstellungen"}
                >
                  {isSaving === "Betriebseinstellungen"
                    ? "Speichern..."
                    : "Speichern"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
