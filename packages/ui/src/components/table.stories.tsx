import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Letzte Aufträge</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Auftrag</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Kunde</TableHead>
          <TableHead className="text-right">Betrag</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">AUF-001</TableCell>
          <TableCell>Offen</TableCell>
          <TableCell>Müller GmbH</TableCell>
          <TableCell className="text-right">2.500,00 €</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">AUF-002</TableCell>
          <TableCell>In Bearbeitung</TableCell>
          <TableCell>Schmidt & Co.</TableCell>
          <TableCell className="text-right">1.200,00 €</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">AUF-003</TableCell>
          <TableCell>Abgeschlossen</TableCell>
          <TableCell>Weber AG</TableCell>
          <TableCell className="text-right">4.800,00 €</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Auftrag</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Kunde</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="text-muted-foreground h-24 text-center">
            Keine Aufträge vorhanden.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
