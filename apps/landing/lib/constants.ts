/* ------------------------------------------------------------------ */
/*  Shared constants — single source of truth for magic numbers        */
/* ------------------------------------------------------------------ */

/** Cooldown in seconds before a 2FA code can be resent */
export const RESEND_COOLDOWN_SECONDS = 60

/** Minimum password length */
export const MIN_PASSWORD_LENGTH = 8

/** OTP code length */
export const OTP_CODE_LENGTH = 6

/** Scroll threshold (px) before header becomes opaque */
export const HEADER_SCROLL_THRESHOLD = 20

/** Throttle interval for scroll listeners (ms) — ~60fps */
export const SCROLL_THROTTLE_MS = 16

/** Cookie consent storage key */
export const COOKIE_CONSENT_KEY = 'cookie-consent'

/** Cookie consent hydration delay in ms */
export const COOKIE_CONSENT_DELAY_MS = 1_000
