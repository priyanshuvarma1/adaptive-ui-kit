import { useMemo, useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '../lib/cn'
import { Icon } from './Icon'

/**
 * Table — the component that usually breaks across resolutions.
 *
 * Rules that make it survive HD → 4K:
 *  • cell padding in rem, so rows breathe more on big panels;
 *  • column widths in rem or %, never px;
 *  • the scroll container is capped by `min(<rem>, <vh>)`, so it grows with
 *    both the UI scale and the actual screen height — a 4K panel shows more
 *    rows, not the same rows stretched;
 *  • numeric columns use tabular-nums so digits stay aligned at any size.
 */
export function Table({
  columns = [],
  rows = [],
  compact = false,
  sortable = true,
  maxBody,
  caption,
  className,
}) {
  const [sort, setSort] = useState({ key: null, dir: 'asc' })

  const sorted = useMemo(() => {
    if (!sort.key) return rows
    const col = columns.find((c) => c.key === sort.key)
    const get = col?.sortValue || ((r) => r[sort.key])
    return [...rows].sort((a, b) => {
      const av = get(a), bv = get(b)
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv))
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [rows, sort, columns])

  const toggle = (key) => setSort((s) =>
    s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })

  return (
    <div className={cn('ui-table-wrap', className)}>
      <div className="ui-table-scroll"
           style={maxBody ? { maxHeight: maxBody, overflowY: 'auto' } : undefined}>
        <table className={cn('ui-table', compact && 'ui-table-compact')}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <colgroup>
            {columns.map((c) => <col key={c.key} style={c.width ? { width: c.width } : undefined} />)}
          </colgroup>
          <thead>
            <tr>
              {columns.map((c) => {
                const active = sort.key === c.key
                const canSort = sortable && c.sortable !== false
                return (
                  <th key={c.key} className={cn(c.align === 'right' && 'ui-table-num')}
                      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    {canSort ? (
                      <button onClick={() => toggle(c.key)}
                              className={cn('inline-flex items-center gap-[0.35em] hover:text-ink',
                                            active && 'text-ink')}>
                        {c.header}
                        <Icon as={active ? (sort.dir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown}
                              size="sm" className={cn(!active && 'opacity-40')} />
                      </button>
                    ) : c.header}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.id ?? i}>
                {columns.map((c) => (
                  <td key={c.key} className={cn(c.align === 'right' && 'ui-table-num', c.cellClass)}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={columns.length} className="py-[2.5rem] text-center text-ink-3">
                Nothing to show
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
