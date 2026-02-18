"use client";

import { useState } from "react";
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
} from "@zunftgewerk/ui";
import { MoreHorizontal, UserPlus, Mail, X } from "lucide-react";
import {
  inviteMemberAction,
  cancelInvitationAction,
  removeMemberAction,
  updateMemberRoleAction,
} from "@/lib/actions/team";

const roleLabels: Record<string, string> = {
  owner: "Inhaber",
  admin: "Administrator",
  manager: "Manager",
  employee: "Mitarbeiter",
  readonly: "Nur Lesen",
};

interface TeamManagementProps {
  members: Array<{
    id: string;
    userId: string;
    role: string;
    joinedAt: Date;
    userName: string;
    userEmail: string;
    userImage: string | null;
  }>;
  invitations: Array<{
    id: string;
    email: string;
    role: string;
    expiresAt: Date;
    createdAt: Date;
  }>;
  currentUserId: string;
}

export function TeamManagement({
  members,
  invitations,
  currentUserId,
}: TeamManagementProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await inviteMemberAction(formData);
    setIsSubmitting(false);

    if (result.success) {
      setIsInviteOpen(false);
      toast.success("Einladung wurde versendet");
      router.refresh();
    } else {
      toast.error(result.error ?? "Fehler beim Versenden");
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    const result = await cancelInvitationAction(invitationId);
    if (result.success) {
      toast.success("Einladung storniert");
      router.refresh();
    } else {
      toast.error(result.error ?? "Fehler");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    const result = await removeMemberAction(memberId);
    if (result.success) {
      toast.success("Mitglied entfernt");
      router.refresh();
    } else {
      toast.error(result.error ?? "Fehler");
    }
  };

  const handleChangeRole = async (memberId: string, role: string) => {
    const result = await updateMemberRoleAction(memberId, role);
    if (result.success) {
      toast.success("Rolle geändert");
      router.refresh();
    } else {
      toast.error(result.error ?? "Fehler");
    }
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
            <form onSubmit={handleInvite}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">E-Mail-Adresse</Label>
                  <Input
                    id="invite-email"
                    name="email"
                    type="email"
                    placeholder="name@beispiel.de"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-role">Rolle</Label>
                  <Select name="role" defaultValue="employee">
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsInviteOpen(false)}
                >
                  Abbrechen
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Mail className="mr-2 size-4" />
                  {isSubmitting ? "Wird gesendet..." : "Einladung senden"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mitglieder</CardTitle>
          <CardDescription>
            Aktive Mitglieder Ihres Teams ({members.length}).
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
              {members.map((member) => {
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
                      {member.role !== "owner" &&
                      member.userId !== currentUserId ? (
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
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeRole(member.id, "admin")
                              }
                            >
                              Zum Admin machen
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeRole(member.id, "employee")
                              }
                            >
                              Zum Mitarbeiter machen
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              Entfernen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {member.role === "owner" ? "Inhaber" : "Sie"}
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

      {invitations.length > 0 && (
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
                {invitations.map((inv) => (
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
                              onClick={() => handleCancelInvitation(inv.id)}
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
