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
  Avatar,
  AvatarFallback,
  AvatarImage,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Separator,
} from "@zunftgewerk/ui";
import { MoreHorizontal, UserPlus, Mail, X } from "lucide-react";
import { mockMembers, mockInvitations } from "@/lib/mock-data";

const roleLabels: Record<string, string> = {
  owner: "Inhaber",
  admin: "Administrator",
  manager: "Manager",
  employee: "Mitarbeiter",
  readonly: "Nur Lesen",
};

export default function TeamPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const handleInvite = () => {
    setIsInviteOpen(false);
    toast.success("Einladung wurde versendet");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Team
          </h1>
          <p className="text-muted-foreground mt-1">
            Verwalten Sie Ihr Team und Einladungen.
          </p>
        </div>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 size-4" />
              Mitglied einladen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neues Mitglied einladen</DialogTitle>
              <DialogDescription>
                Senden Sie eine Einladung per E-Mail an ein neues Team-Mitglied.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">E-Mail-Adresse</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="name@beispiel.de"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Rolle</Label>
                <Select defaultValue="employee">
                  <SelectTrigger id="invite-role">
                    <SelectValue placeholder="Rolle wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Mitarbeiter</SelectItem>
                    <SelectItem value="readonly">Nur Lesen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleInvite}>
                <Mail className="mr-2 size-4" />
                Einladung senden
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Mitglieder</CardTitle>
          <CardDescription>
            Aktive Mitglieder Ihres Teams ({mockMembers.length}).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mitglied</TableHead>
                <TableHead>Rolle</TableHead>
                <TableHead>Beigetreten</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMembers.map((member) => {
                const initials = member.userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={member.userImage ?? undefined} />
                          <AvatarFallback className="text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.userEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {roleLabels[member.role] ?? member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.joinedAt.toLocaleDateString("de-DE")}
                    </TableCell>
                    <TableCell className="text-right">
                      {member.role !== "owner" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Aktionen</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Rolle ändern</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Entfernen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Inhaber
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {mockInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Offene Einladungen</CardTitle>
            <CardDescription>
              Einladungen, die noch nicht angenommen wurden.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Rolle</TableHead>
                  <TableHead>Eingeladen am</TableHead>
                  <TableHead>Läuft ab</TableHead>
                  <TableHead className="text-right">Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvitations.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {roleLabels[inv.role] ?? inv.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {inv.createdAt.toLocaleDateString("de-DE")}
                    </TableCell>
                    <TableCell>
                      {inv.expiresAt.toLocaleDateString("de-DE")}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <X className="size-4" />
                            <span className="sr-only">Stornieren</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Einladung stornieren?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Die Einladung an {inv.email} wird zurückgezogen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                toast.success("Einladung storniert")
                              }
                            >
                              Stornieren
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
