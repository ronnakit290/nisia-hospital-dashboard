import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import type { Tone } from '../data/clinical'
import { toneBar, toneChip } from '../lib/ui'

type StatCardProps = {
  label: string
  value: string
  unit?: string
  icon: LucideIcon
  tone?: Tone
  detail?: string
  trend?: { value: string; direction: 'up' | 'down' | 'flat'; positive?: boolean }
  progress?: { value: number; label?: string; tone?: Tone }
  index?: number
}

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  tone = 'blue',
  detail,
  trend,
  progress,
  index = 0,
}: StatCardProps) {
  const TrendIcon = trend?.direction === 'up' ? ArrowUpRight : trend?.direction === 'down' ? ArrowDownRight : Minus
  const trendTone = trend?.positive === false ? 'text-danger-600' : 'text-success-700'

  return (
    <article
      className="card animate-fade-up p-5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">{label}</p>
          <p className="mt-2.5 flex items-end gap-1.5">
            <span className="text-[28px] font-bold leading-none tracking-tight text-ink-900">{value}</span>
            {unit ? <span className="pb-0.5 text-xs font-medium text-ink-400">{unit}</span> : null}
          </p>
        </div>
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-xl ring-1 ${toneChip[tone]}`}
          aria-hidden="true"
        >
          <Icon className="size-5" strokeWidth={1.9} />
        </span>
      </div>

      <div className="mt-3.5 flex items-center gap-2 text-xs">
        {trend ? (
          <span className={`inline-flex items-center gap-1 font-semibold ${trendTone}`}>
            <TrendIcon className="size-3.5" aria-hidden="true" />
            {trend.value}
          </span>
        ) : null}
        {detail ? <span className="truncate text-ink-400">{detail}</span> : null}
      </div>

      {progress ? (
        <div className="mt-3">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100"
            role="progressbar"
            aria-valuenow={progress.value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={progress.label ?? label}
          >
            <div
              className={`h-full rounded-full transition-[width] duration-700 ${toneBar[progress.tone ?? tone]}`}
              style={{ width: `${Math.min(progress.value, 100)}%` }}
            />
          </div>
        </div>
      ) : null}
    </article>
  )
}

type PageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-ink-900 sm:text-[28px]">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-500">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2 print:hidden">{actions}</div> : null}
    </div>
  )
}

type SectionCardProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  index?: number
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className = '',
  bodyClassName = '',
  index = 0,
}: SectionCardProps) {
  return (
    <section
      className={`card animate-fade-up overflow-hidden ${className}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold tracking-tight text-ink-900">{title}</h2>
          {description ? <p className="mt-1 text-xs leading-relaxed text-ink-400">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={bodyClassName || 'px-5 pb-5 pt-4 sm:px-6 sm:pb-6'}>{children}</div>
    </section>
  )
}

type SegmentedOption<T extends string> = {
  value: T
  label: string
  count?: number
}

type SegmentedProps<T extends string> = {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  label: string
}

export function Segmented<T extends string>({ options, value, onChange, label }: SegmentedProps<T>) {
  return (
    <div
      className="inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-xl bg-ink-100/80 p-1 scrollbar-none"
      role="group"
      aria-label={label}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? 'bg-white text-ink-900 shadow-[0_1px_3px_rgba(13,39,69,0.12)]'
                : 'text-ink-500 hover:text-ink-800'
            }`}
          >
            {option.label}
            {typeof option.count === 'number' ? (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                  active ? 'bg-brand-50 text-brand-700' : 'bg-white/70 text-ink-400'
                }`}
              >
                {option.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export function ViewAllLink({ onClick, label = 'ดูทั้งหมด' }: { onClick?: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-1.5 py-1 text-xs font-semibold text-brand-600 transition hover:bg-brand-50 hover:text-brand-700"
    >
      {label}
      <span aria-hidden="true">→</span>
    </button>
  )
}
