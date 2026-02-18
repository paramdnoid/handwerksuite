import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';
import { Button } from './button';
import { Input } from './input';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Dialog öffnen</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profil bearbeiten</DialogTitle>
          <DialogDescription>Ändern Sie hier Ihre Profilinformationen.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input placeholder="Name" />
          <Input placeholder="E-Mail" type="email" />
        </div>
        <DialogFooter>
          <Button>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Löschen</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sind Sie sicher?</DialogTitle>
          <DialogDescription>Diese Aktion kann nicht rückgängig gemacht werden.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Abbrechen</Button>
          <Button variant="destructive">Löschen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
