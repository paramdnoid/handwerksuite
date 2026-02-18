import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: 'Text eingeben...' },
};

export const Email: Story = {
  args: { type: 'email', placeholder: 'name@example.com' },
};

export const Password: Story = {
  args: { type: 'password', placeholder: 'Passwort' },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Deaktiviert', value: 'Nicht editierbar' },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="email" className="text-sm font-medium">
        E-Mail
      </label>
      <Input id="email" type="email" placeholder="name@example.com" {...args} />
    </div>
  ),
};
