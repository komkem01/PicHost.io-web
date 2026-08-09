/**
 * Formats a byte number into a human-readable string (e.g. 1024 -> "1 KB", -1 -> "Unlimited").
 */
export function formatBytes(bytes: number | null | undefined, decimals = 1): string {
  if (bytes === null || bytes === undefined) return '0 B'
  if (bytes === -1) return 'Unlimited'
  if (bytes === 0) return '0 B'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const index = Math.min(i, sizes.length - 1)

  const value = parseFloat((bytes / Math.pow(k, index)).toFixed(dm))
  return `${value} ${sizes[index]}`
}

/**
 * Alias for formatBytes for backward compatibility and semantic code intent.
 */
export const formatSize = formatBytes

/**
 * Formats a currency amount based on current locale.
 */
export function formatCurrency(amount: number, locale = 'th', currency = 'THB'): string {
  if (currency === 'THB') {
    return `฿${amount.toLocaleString(locale === 'th' ? 'th-TH' : 'en-US')}`
  }
  return new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Formats a date string or object based on locale.
 */
export function formatDate(dateInput: string | Date | null | undefined, locale = 'th'): string {
  if (!dateInput) return ''
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(date.getTime())) return ''

  return date.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
