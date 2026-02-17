/* ------------------------------------------------------------------ */
/*  Shared CSS field-enter stagger utility                             */
/*  Generates motion-safe animation-delay classes for form fields      */
/* ------------------------------------------------------------------ */

/**
 * Returns a Tailwind class string that applies a staggered `field-enter`
 * animation (defined in `globals.css`). Uses `motion-safe:` to respect
 * reduced motion preferences.
 *
 * @param index — 0-based position in the stagger sequence
 */
export function fieldStagger(index: number): string {
  const delay = (0.05 + index * 0.07).toFixed(2)
  return `motion-safe:animate-[field-enter_0.45s_ease-out_${delay}s_both]`
}
