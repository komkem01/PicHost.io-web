/**
 * Export data to a CSV file with UTF-8 BOM for Excel and Thai character support.
 */
export function exportToCsv(filename: string, headers: { label: string; key: string }[], data: Record<string, any>[]) {
  if (!data || data.length === 0) {
    alert('No data to export')
    return
  }

  // UTF-8 BOM
  const BOM = '\uFEFF'
  
  const headerRow = headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(',')
  
  const dataRows = data.map(item => {
    return headers.map(h => {
      let val = item[h.key]
      if (val === null || val === undefined) {
        val = ''
      } else if (typeof val === 'object') {
        val = JSON.stringify(val)
      } else {
        val = String(val)
      }
      return `"${val.replace(/"/g, '""')}"`
    }).join(',')
  })

  const csvContent = BOM + [headerRow, ...dataRows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
