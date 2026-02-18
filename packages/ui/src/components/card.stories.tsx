import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Projekt erstellen</CardTitle>
        <CardDescription>Erstellen Sie ein neues Projekt.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Inhalt hier einfügen.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Abbrechen</Button>
        <Button>Erstellen</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px] p-6">
      <p className="text-sm">Einfache Card ohne Header oder Footer.</p>
    </Card>
  ),
};
