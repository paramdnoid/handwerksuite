import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { ArrowRight, Loader2, Mail } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: 'Button' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Löschen' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
};

export const Link: Story = {
  args: { variant: 'link', children: 'Link' },
};

export const Small: Story = {
  args: { size: 'sm', children: 'Klein' },
};

export const Large: Story = {
  args: { size: 'lg', children: 'Groß' },
};

export const Icon: Story = {
  args: { size: 'icon', children: <Mail className="h-4 w-4" /> },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        Weiter <ArrowRight className="h-4 w-4" />
      </>
    ),
  },
};

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <Loader2 className="h-4 w-4 animate-spin" /> Laden...
      </>
    ),
  },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Deaktiviert' },
};
