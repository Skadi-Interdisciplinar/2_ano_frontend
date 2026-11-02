/**
 * Extrai a primeira letra do primeiro nome do usuário.
 * Ex: "Pedro Henrique" -> "P"
 *     "Carlos Eduardo" -> "C"
 *     "  ana clara  " -> "A"
 *     "" ou undefined -> fallback ('U')
 */
export function extrairInicialPrimeiroNome(nome?: string, fallback = 'U'): string {
  if (!nome || typeof nome !== 'string') return fallback
  const primeiroNome = nome.trim().split(/\s+/)[0]
  if (!primeiroNome) return fallback
  return primeiroNome.charAt(0).toUpperCase() || fallback
}
