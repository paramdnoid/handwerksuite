'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input, Button, cn } from '@zunftgewerk/ui'

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showStrength?: boolean
}

function getPasswordStrength(password: string): {
  score: number
  label: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  const labels = ['Sehr schwach', 'Schwach', 'Mittel', 'Stark', 'Sehr stark']
  return {
    score: Math.min(score, 4),
    label: labels[Math.min(score, 4)] ?? 'Sehr schwach',
  }
}

const strengthColors = [
  'bg-destructive',
  'bg-destructive',
  'bg-amber-500',
  'bg-primary',
  'bg-green-500',
]

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, onChange, id, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false)
    const [strength, setStrength] = React.useState({ score: 0, label: '' })
    const [hasValue, setHasValue] = React.useState(false)

    const strengthId = id ? `${id}-strength` : undefined

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setHasValue(val.length > 0)
        if (showStrength) {
          setStrength(getPasswordStrength(val))
        }
        onChange?.(e)
      },
      [showStrength, onChange],
    )

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            type={visible ? 'text' : 'password'}
            className={cn('pr-10', className)}
            onChange={handleChange}
            aria-describedby={showStrength && hasValue ? strengthId : undefined}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? 'Passwort verbergen' : 'Passwort anzeigen'}
            aria-pressed={visible}
          >
            {visible ? (
              <EyeOff className="text-muted-foreground size-4" />
            ) : (
              <Eye className="text-muted-foreground size-4" />
            )}
          </Button>
        </div>
        {showStrength && hasValue && (
          <div className="space-y-1" id={strengthId} aria-live="polite">
            <div
              className="flex gap-1"
              role="meter"
              aria-valuenow={strength.score}
              aria-valuemin={0}
              aria-valuemax={4}
              aria-label="Passwortstärke"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    i <= strength.score - 1 ? strengthColors[strength.score] : 'bg-muted',
                  )}
                />
              ))}
            </div>
            <p className="text-muted-foreground text-xs">{strength.label}</p>
          </div>
        )}
      </div>
    )
  },
)
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
