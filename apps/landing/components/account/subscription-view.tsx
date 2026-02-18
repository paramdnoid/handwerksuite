"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Progress,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { Check, Download, ExternalLink } from "lucide-react";
import {
  createCheckoutAction,
  createPortalAction,
  cancelSubscriptionAction,
} from "@/lib/actions/subscription";
import type {
  SubscriptionTier,
  SubscriptionPlan,
  SubscriptionLimits,
} from "@zunftgewerk/types";

function LimitBar({
  label,
  current,
  max,
}: {
  label: string;
  current: number;
  max: number;
}) {
  const isUnlimited = max === -1;
  const percent = isUnlimited ? 0 : Math.round((current / max) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {current}
          {isUnlimited ? " (unbegrenzt)" : ` / ${max}`}
        </span>
      </div>
      {!isUnlimited && <Progress value={percent} />}
    </div>
  );
}

interface SubscriptionViewProps {
  subscription: {
    id: string;
    tier: string;
    status: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    stripePriceId: string;
  } | null;
  tier: SubscriptionTier;
  limits: SubscriptionLimits;
  currentUsage: {
    users: number;
    projects: number;
    customers: number;
    storageMb: number;
  };
  plans: SubscriptionPlan[];
  invoices: Array<{
    id: string;
    stripeInvoiceId: string;
    amountDue: number;
    amountPaid: number;
    currency: string;
    status: string;
    invoicePdfUrl: string | null;
    createdAt: Date;
  }>;
  hasStripeCustomer: boolean;
}

export function SubscriptionView({
  subscription,
  tier,
  limits,
  currentUsage,
  plans,
  invoices,
  hasStripeCustomer,
}: SubscriptionViewProps) {
  const router = useRouter();
  const currentPlan = plans.find((p) => p.tier === tier);
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  const handleManageSubscription = async () => {
    const result = await createPortalAction();
    if (result.success && result.url) {
      window.location.href = result.url;
    } else {
      toast.error(result.error ?? "Fehler");
    }
  };

  const handleUpgrade = async (priceId: string) => {
    const result = await createCheckoutAction(priceId);
    if (result.success && result.url) {
      window.location.href = result.url;
    } else {
      toast.error(result.error ?? "Fehler");
    }
  };

  const handleCancel = async () => {
    const result = await cancelSubscriptionAction();
    if (result.success) {
      toast.success("Abonnement wird zum Periodenende gekündigt");
      router.refresh();
    } else {
      toast.error(result.error ?? "Fehler");
    }
  };

  return (
    <>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Abonnement
        </h1>
        <p className="text-muted-foreground mt-1">
          Verwalten Sie Ihren Plan, Limits und Rechnungen.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aktueller Plan</CardTitle>
              <CardDescription>
                Ihr aktives Abonnement und die nächste Verlängerung.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {subscription?.status === "active"
                ? "Aktiv"
                : subscription?.status === "canceled"
                  ? "Gekündigt"
                  : tier === "free"
                    ? "Kostenlos"
                    : "Inaktiv"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {currentPlan?.name ?? tierLabel}
            </span>
            {currentPlan && currentPlan.priceMonthly > 0 && (
              <span className="text-muted-foreground">
                {currentPlan.priceMonthly} € / Monat
              </span>
            )}
          </div>
          {subscription && (
            <p className="text-sm text-muted-foreground mt-2">
              Aktuelle Periode:{" "}
              {subscription.currentPeriodStart.toLocaleDateString("de-DE")} –{" "}
              {subscription.currentPeriodEnd.toLocaleDateString("de-DE")}
              {subscription.cancelAtPeriodEnd && (
                <span className="text-destructive ml-2">
                  (Endet am{" "}
                  {subscription.currentPeriodEnd.toLocaleDateString("de-DE")})
                </span>
              )}
            </p>
          )}
          {hasStripeCustomer && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleManageSubscription}
            >
              <ExternalLink className="mr-2 size-4" />
              Abonnement verwalten
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nutzung</CardTitle>
          <CardDescription>Aktuelle Auslastung Ihres Plans.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LimitBar
            label="Benutzer"
            current={currentUsage.users}
            max={limits.maxUsers}
          />
          <LimitBar
            label="Projekte"
            current={currentUsage.projects}
            max={limits.maxProjects}
          />
          <LimitBar
            label="Kunden"
            current={currentUsage.customers}
            max={limits.maxCustomers}
          />
          <LimitBar
            label="Speicher (MB)"
            current={currentUsage.storageMb}
            max={limits.maxStorageMb}
          />
        </CardContent>
      </Card>

      <div>
        <h2 className="font-display text-lg font-semibold mb-4">
          Verfügbare Pläne
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.tier === tier;
            return (
              <Card
                key={plan.id}
                className={
                  isCurrent ? "border-primary ring-1 ring-primary" : ""
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {isCurrent && <Badge>Aktuell</Badge>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    {plan.priceMonthly > 0 ? (
                      <>
                        {plan.priceMonthly} €
                        <span className="text-sm font-normal text-muted-foreground">
                          {" "}
                          / Monat
                        </span>
                      </>
                    ) : (
                      <span className="text-lg">Auf Anfrage</span>
                    )}
                  </div>
                  <Separator />
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((f) => (
                      <li key={f.key} className="flex items-center gap-2">
                        <Check
                          className={`size-4 ${f.included ? "text-primary" : "text-muted-foreground/30"}`}
                        />
                        <span
                          className={
                            f.included
                              ? ""
                              : "text-muted-foreground line-through"
                          }
                        >
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {!isCurrent && plan.tier !== "enterprise" && (
                    <Button
                      className="w-full"
                      onClick={() =>
                        handleUpgrade(plan.id)
                      }
                    >
                      Upgraden
                    </Button>
                  )}
                  {!isCurrent && plan.tier === "enterprise" && (
                    <Button className="w-full" variant="outline">
                      Kontaktieren
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {invoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rechnungsverlauf</CardTitle>
            <CardDescription>
              Ihre bisherigen Rechnungen und Zahlungen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rechnung</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Betrag</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium font-mono text-xs">
                      {invoice.stripeInvoiceId.slice(0, 20)}...
                    </TableCell>
                    <TableCell>
                      {invoice.createdAt.toLocaleDateString("de-DE")}
                    </TableCell>
                    <TableCell>
                      {(invoice.amountPaid / 100).toFixed(2)}{" "}
                      {invoice.currency.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "paid" ? "secondary" : "outline"
                        }
                      >
                        {invoice.status === "paid"
                          ? "Bezahlt"
                          : invoice.status === "open"
                            ? "Offen"
                            : invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.invoicePdfUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          asChild
                        >
                          <a
                            href={invoice.invoicePdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="size-4" />
                            <span className="sr-only">Herunterladen</span>
                          </a>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {subscription && !subscription.cancelAtPeriodEnd && (
        <Card className="border-destructive/20">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="font-medium">Abonnement kündigen</p>
              <p className="text-sm text-muted-foreground">
                Ihr Zugang bleibt bis zum Ende der aktuellen Periode bestehen.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive">
                  Kündigen
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Abonnement wirklich kündigen?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Ihr Zugang bleibt bis zum{" "}
                    {subscription.currentPeriodEnd.toLocaleDateString("de-DE")}{" "}
                    bestehen. Danach verlieren Sie den Zugriff auf
                    Premium-Funktionen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Ja, kündigen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}
    </>
  );
}
