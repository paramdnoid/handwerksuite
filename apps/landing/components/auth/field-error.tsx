interface FieldErrorProps {
  message?: string
  id?: string
}

export function FieldError({ message, id }: FieldErrorProps) {
  if (!message) return null

  return (
    <p id={id} className="text-destructive text-xs mt-1.5" role="alert">
      {message}
    </p>
  )
}
