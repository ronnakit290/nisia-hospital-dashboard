import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatNumber } from '../lib/ui'

type TooltipEntry = {
  name?: string
  value?: number | string
  color?: string
}

function ChartTooltip({
  active,
  payload,
  label,
  unit = '',
}: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
  unit?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-white/95 px-3 py-2 text-xs shadow-card backdrop-blur">
      {label !== undefined ? <p className="mb-1 font-bold text-ink-800">{label}</p> : null}
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-1.5 text-ink-500">
          <span className="size-1.5 rounded-full" style={{ background: entry.color ?? '#2F6BEA' }} />
          <span>{entry.name}</span>
          <span className="ml-auto pl-3 font-semibold text-ink-800">
            {typeof entry.value === 'number' ? formatNumber(entry.value) : entry.value}
            {unit}
          </span>
        </p>
      ))}
    </div>
  )
}

const axisTick = { fill: '#7895b6', fontSize: 11, fontWeight: 500 }

type AdmissionsDatum = { day: string; admitted: number; discharged: number }

export function AdmissionsChart({ data, ariaLabel }: { data: AdmissionsDatum[]; ariaLabel: string }) {
  return (
    <div role="img" aria-label={ariaLabel}>
      <div className="mb-2 flex items-center justify-end gap-4 text-[11px] font-semibold text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-brand-500" />
          รับใหม่
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-3.5 rounded-full bg-danger-500" />
          จำหน่าย
        </span>
      </div>
      <div className="h-[236px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="admittedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2F6BEA" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#2F6BEA" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#EAF0F8" strokeDasharray="3 5" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={axisTick}
              dy={6}
              interval={data.length > 12 ? 4 : 0}
            />
            <YAxis axisLine={false} tickLine={false} tick={axisTick} width={46} />
            <Tooltip
              content={<ChartTooltip unit=" ราย" />}
              cursor={{ stroke: '#CDD9E8', strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="admitted"
              name="รับใหม่"
              stroke="#2F6BEA"
              strokeWidth={2.4}
              fill="url(#admittedFill)"
              activeDot={{ r: 4.5, strokeWidth: 2, stroke: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="discharged"
              name="จำหน่าย"
              stroke="#D92D3C"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

type TriageDatum = { name: string; value: number; color: string }

export function TriageDonut({ data, ariaLabel }: { data: TriageDatum[]; ariaLabel: string }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return (
    <div role="img" aria-label={ariaLabel}>
      <div className="relative mx-auto h-[184px] w-full max-w-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              stroke="none"
              cornerRadius={5}
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip unit=" ราย" />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[26px] font-bold leading-none tracking-tight text-ink-900">{total}</span>
          <span className="mt-1 text-[10px] font-semibold text-ink-400">ผู้ป่วยทั้งหมด</span>
        </div>
      </div>
      <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-2.5">
        {data.map((item) => (
          <li key={item.name} className="flex items-center gap-2 text-[11px]">
            <span className="size-2 shrink-0 rounded-full" style={{ background: item.color }} aria-hidden="true" />
            <span className="truncate text-ink-500">{item.name}</span>
            <span className="ml-auto font-bold tabular-nums text-ink-800">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

type ResponseDatum = { hour: string; minutes: number }

export function ResponseBarChart({ data, ariaLabel }: { data: ResponseDatum[]; ariaLabel: string }) {
  return (
    <div role="img" aria-label={ariaLabel}>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 6, left: 0, bottom: 0 }} barCategoryGap="28%">
            <CartesianGrid stroke="#EAF0F8" strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={axisTick} dy={6} />
            <YAxis axisLine={false} tickLine={false} tick={axisTick} width={44} />
            <Tooltip content={<ChartTooltip unit=" นาที" />} cursor={{ fill: 'rgba(47,107,234,0.05)' }} />
            <ReferenceLine
              y={8}
              stroke="#D92D3C"
              strokeDasharray="4 4"
              label={{ value: 'เป้า 8 น.', position: 'insideTopRight', fill: '#B51F2E', fontSize: 10, fontWeight: 600 }}
            />
            <Bar dataKey="minutes" name="เวลาตอบสนอง" radius={[6, 6, 0, 0]} maxBarSize={34}>
              {data.map((entry) => (
                <Cell key={entry.hour} fill={entry.minutes > 8 ? '#E8455A' : '#2F6BEA'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

type DispenseDatum = { day: string; count: number }

export function DispenseBarChart({ data, ariaLabel }: { data: DispenseDatum[]; ariaLabel: string }) {
  return (
    <div role="img" aria-label={ariaLabel}>
      <div className="h-[190px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid stroke="#EAF0F8" strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={axisTick} dy={6} />
            <YAxis axisLine={false} tickLine={false} tick={axisTick} width={44} />
            <Tooltip content={<ChartTooltip unit=" รายการ" />} cursor={{ fill: 'rgba(47,107,234,0.05)' }} />
            <Bar dataKey="count" name="จ่ายยา" fill="#2F6BEA" radius={[6, 6, 0, 0]} maxBarSize={30}>
              {data.map((entry, index) => (
                <Cell key={entry.day} fill={index === data.length - 1 ? '#93B7FF' : '#2F6BEA'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

type OccupancyDatum = { day: string; occupancy: number }

export function OccupancyAreaChart({ data, ariaLabel }: { data: OccupancyDatum[]; ariaLabel: string }) {
  return (
    <div role="img" aria-label={ariaLabel}>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 6, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="occupancyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2F6BEA" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#2F6BEA" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#EAF0F8" strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={axisTick} dy={6} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={axisTick}
              width={44}
              domain={[70, 100]}
              tickFormatter={(value: number) => `${value}%`}
            />
            <Tooltip content={<ChartTooltip unit="%" />} cursor={{ stroke: '#CDD9E8', strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="occupancy"
              name="อัตราครองเตียง"
              stroke="#2F6BEA"
              strokeWidth={2.4}
              fill="url(#occupancyFill)"
              activeDot={{ r: 4.5, strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
