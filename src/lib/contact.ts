/** Where "suggest improvements" emails go. */
export const SUPPORT_EMAIL = 'dada0639@gmail.com'

export function feedbackMailto(
  subject = 'RigForge — feedback & improvement ideas',
): string {
  const body = "Hi,\n\nHere's my feedback / improvement idea for RigForge:\n\n"
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
