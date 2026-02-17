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
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@zunftgewerk/ui";
import {
  Users,
  Folder,
  Receipt,
  Calendar,
  ClipboardCheck,
  Package,
  Flame,
  Clock,
  Monitor,
  Smartphone,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { mockModules } from "@/lib/mock-data";
import type { ModuleCategory } from "@zunftgewerk/types";

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  folder: Folder,
  receipt: Receipt,
  calendar: Calendar,
  "clipboard-check": ClipboardCheck,
  package: Package,
  flame: Flame,
  clock: Clock,
};

const platformIcons: Record<string, { icon: LucideIcon; label: string }> = {
  web: { icon: Globe, label: "Web" },
  mobile: { icon: Smartphone, label: "Mobile" },
  desktop: { icon: Monitor, label: "Desktop" },
};

const categoryLabels: Record<string, string> = {
  core: "Kern",
  pruefung: "Prüfung",
  verwaltung: "Verwaltung",
  branchenspezifisch: "Branchenspezifisch",
};

export default function ModulesPage() {
  const [modules, setModules] = useState(mockModules);

  const handleToggle = (moduleId: string, checked: boolean) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, isActive: checked } : m,
      ),
    );
    const mod = modules.find((m) => m.id === moduleId);
    if (mod) {
      toast.success(
        checked
          ? `${mod.name} wurde aktiviert`
          : `${mod.name} wurde deaktiviert`,
      );
    }
  };

  const categories = ["all", "core", "pruefung", "verwaltung", "branchenspezifisch"];

  const filterModules = (category: string) =>
    category === "all"
      ? modules
      : modules.filter((m) => m.category === category);

  return (
    <>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Module
        </h1>
        <p className="text-muted-foreground mt-1">
          Aktivieren und deaktivieren Sie Funktionsmodule für Ihren Betrieb.
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Alle</TabsTrigger>
          {categories.slice(1).map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {categoryLabels[cat]}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filterModules(cat).map((mod) => {
                const Icon = iconMap[mod.icon ?? ""] ?? Package;

                return (
                  <Card
                    key={mod.id}
                    className={!mod.isAvailable ? "opacity-60" : ""}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="size-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {mod.name}
                            </CardTitle>
                            <div className="flex items-center gap-1.5 mt-1">
                              {mod.isCore && (
                                <Badge variant="secondary" className="text-xs">
                                  Kern
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {categoryLabels[mod.category]}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={mod.isActive}
                          onCheckedChange={(checked) =>
                            handleToggle(mod.id, checked)
                          }
                          disabled={mod.isCore || !mod.isAvailable}
                          aria-label={`${mod.name} ${mod.isActive ? "deaktivieren" : "aktivieren"}`}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {mod.description}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-3">
                        {mod.platforms.map((platform) => {
                          const pInfo =
                            platformIcons[platform] ?? platformIcons.web;
                          return (
                            <div
                              key={platform}
                              className="flex items-center gap-1 text-xs text-muted-foreground"
                              title={pInfo.label}
                            >
                              <pInfo.icon className="size-3" />
                              <span>{pInfo.label}</span>
                            </div>
                          );
                        })}
                      </div>
                      {!mod.isAvailable && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Nicht verfügbar für Ihr Gewerk
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
