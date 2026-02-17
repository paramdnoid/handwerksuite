/* ------------------------------------------------------------------ */
/*  Typed error classes for enterprise error handling                   */
/* ------------------------------------------------------------------ */

/** Base class for all application errors */
export class AppError extends Error {
  public readonly code: string
  public readonly statusCode?: number

  constructor(message: string, code: string, statusCode?: number) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
  }
}

/** Errors returned from the API (4xx / 5xx) */
export class ApiError extends AppError {
  public readonly isRetryable: boolean

  constructor(message: string, statusCode: number, isRetryable = false) {
    super(message, 'API_ERROR', statusCode)
    this.name = 'ApiError'
    this.isRetryable = isRetryable
  }
}

/** Network-level failures (timeout, offline, DNS, etc.) */
export class NetworkError extends AppError {
  constructor(message = 'Verbindung zum Server fehlgeschlagen.') {
    super(message, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

/** Authentication / authorization errors (401, 403) */
export class AuthError extends AppError {
  constructor(message = 'Authentifizierung fehlgeschlagen.', statusCode = 401) {
    super(message, 'AUTH_ERROR', statusCode)
    this.name = 'AuthError'
  }
}

/** Client-side validation errors */
export class ValidationError extends AppError {
  public readonly fieldErrors: Record<string, string[]>

  constructor(message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message, 'VALIDATION_ERROR', 422)
    this.name = 'ValidationError'
    this.fieldErrors = fieldErrors
  }
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Returns true if the HTTP status code indicates a transient
 * error that is safe to retry.
 */
export function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500
}

/**
 * Extract a user-friendly error message from any thrown value.
 */
export function getUserMessage(error: unknown): string {
  if (error instanceof AppError) return error.message
  if (error instanceof Error) return error.message
  return 'Ein unerwarteter Fehler ist aufgetreten.'
}

/**
 * Structured error reporter.
 * In production this should forward to Sentry / Datadog / etc.
 */
export function reportError(error: unknown, context?: Record<string, unknown>): void {
  console.error('[ErrorReport]', {
    error,
    context,
    timestamp: new Date().toISOString(),
  })
  // TODO: Sentry.captureException(error, { extra: context })
}
