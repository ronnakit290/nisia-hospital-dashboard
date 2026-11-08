import { useEffect, useState } from 'react'
import {
  Ambulance,
  Check,
  CircleCheck,
  Clock,
  MapPin,
  Phone,
  Printer,
  Radio,
  Siren,
  Timer,
  X,
} from 'lucide-react'
import type { EmsCall } from '../data/clinical'
import { ambulances, emsCalls, responseTimes } from '../data/clinical'
import { PageHeader, SectionCard, Segmented, StatCard } from '../components/ui'
import { ResponseBarChart } from '../components/charts'
import { percent, statusTone, triageTone, tonePill } from '../lib/ui'

type Filter = 'all' | 'critical' | 'active' | 'closed'

const filters: { value: Filter; label: string; count: number }[] = [
  { value: 'all', label: 'ทั้งหมด', count: emsCalls.length },
  { value: 'critical', label: 'วิกฤต', count: emsCalls.filter((call) => call.triage === 'แดง').length },
  {
    value: 'active',
    label: 'กำลังดำเนินการ',
    count: emsCalls.filter((call) => call.status === 'ออกเหตุแล้ว' || call.status === 'กำลังนำส่ง').length,
  },
  { value: 'closed', label: 'ปิดเคส', count: emsCalls.filter((call) => call.status === 'ปิดเคส').length },
]

const protocol = [
  { label: 'รับแจ้งและคัดกรอง', actual: 0.8, target: 1, unit: 'นาที' },
  { label: 'จ่ายงานถึงทีมปฏิบัติการ', actual: 1.6, target: 2, unit: 'นาที' },
  { label: 'ถึงจุดเกิดเหตุ', actual: 7.4, target: 8, unit: 'นาที' },
]

const timelineSteps = ['รับแจ้งเหตุ', 'มอบหมายทีม', 'ถึงจุดเกิดเหตุ', 'นำส่งโรงพยาบาล']

function stepState(call: EmsCall, index: number) {
  if (index === 0) return 'done'
  if (index === 1) return call.status === 'รอรับแจ้ง' ? 'next' : 'done'
  if (index === 2) return call.status === 'กำลังนำส่ง' || call.status === 'ปิดเคส' ? 'done' : call.status === 'ออกเหตุแล้ว' ? 'active' : 'next'
  if (call.status === 'ปิดเคส') return 'done'
  if (call.status === 'กำลังนำส่ง') return 'active'
  return 'next'
}

function CallDialog({ call, onClose }: { call: EmsCall; onClose: () => void }) {
  const unit = ambulances.find((ambulance) => ambulance.id === call.unit)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-ink-950/55 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="call-dialog-title"
        className="relative z-10 max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-float scroll-thin sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <p className="eyebrow">รายละเอียดเหตุ · {call.id}</p>
            <h2 id="call-dialog-title" className="mt-1 text-lg font-bold text-ink-900">
              {call.type}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`pill ${tonePill[triageTone[call.triage]]}`}>คัดกรอง {call.triage}</span>
              <span className={`pill ${tonePill[statusTone[call.status]]}`}>{call.status}</span>
              <span className="text-[11px] text-ink-400">แจ้งเมื่อ {call.time} น.</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="icon-btn shrink-0" aria-label="ปิดรายละเอียด" autoFocus>
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line bg-ink-50/50 px-3.5 py-3">
              <p className="eyebrow">สถานที่เกิดเหตุ</p>
              <p className="mt-1.5 flex items-start gap-1.5 text-[12px] font-semibold leading-snug text-ink-800">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-ink-400" aria-hidden="true" />
                {call.location}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-ink-50/50 px-3.5 py-3">
              <p className="eyebrow">ทีมที่รับผิดชอบ</p>
              <p className="mt-1.5 text-[12px] font-semibold text-ink-800">{call.unit}</p>
              <p className="mt-0.5 text-[11px] text-ink-400">{unit?.crew ?? 'ทีมปฏิบัติการ'}</p>
            </div>
            <div className="rounded-xl border border-line bg-ink-50/50 px-3.5 py-3">
              <p className="eyebrow">เวลาถึงโดยประมาณ</p>
              <p className="mt-1.5 text-[12px] font-semibold text-ink-800">{call.eta}</p>
            </div>
            <div className="rounded-xl border border-line bg-ink-50/50 px-3.5 py-3">
              <p className="eyebrow">ช่องทางประสานงาน</p>
              <p className="mt-1.5 text-[12px] font-semibold text-ink-800">วิทยุช่อง 3 · ศูนย์ EMS</p>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-3">ลำดับเหตุการณ์</p>
            <ol className="space-y-3">
              {timelineSteps.map((step, index) => {
                const state = stepState(call, index)
                return (
                  <li key={step} className="flex items-center gap-3">
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                        state === 'done'
                          ? 'bg-success-50 text-success-700 ring-1 ring-success-100'
                          : state === 'active'
                            ? 'bg-danger-600 text-white'
                            : 'bg-ink-50 text-ink-300 ring-1 ring-line'
                      }`}
                    >
                      {state === 'done' ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
                    </span>
                    <span className={`text-[12px] ${state === 'next' ? 'text-ink-400' : 'font-semibold text-ink-800'}`}>
                      {step}
                    </span>
                    <span className="ml-auto text-[10px] font-semibold text-ink-300">
                      {state === 'done' ? 'เสร็จสิ้น' : state === 'active' ? 'กำลังดำเนินการ' : 'รอดำเนินการ'}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line px-5 py-4 sm:flex-row sm:px-6">
          <a href="tel:1669" className="btn btn-primary flex-1">
            <Phone className="size-4" aria-hidden="true" />
            ประสานงานศูนย์ EMS
          </a>
          <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Ems() {
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedCall, setSelectedCall] = useState<EmsCall | null>(null)

  const visibleCalls = emsCalls.filter((call) => {
    if (filter === 'critical') return call.triage === 'แดง'
    if (filter === 'active') return call.status === 'ออกเหตุแล้ว' || call.status === 'กำลังนำส่ง'
    if (filter === 'closed') return call.status === 'ปิดเคส'
    return true
  })

  const criticalCall = emsCalls.find((call) => call.triage === 'แดง' && call.status === 'กำลังนำส่ง') ?? emsCalls[0]

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="ศูนย์ควบคุม · EMS"
        title="ศูนย์รับแจ้งเหตุฉุกเฉิน"
        description="ติดตามเหตุการณ์ รถพยาบาล และเวลาตอบสนองของทีมปฏิบัติการแบบเรียลไทม์"
        actions={
          <button type="button" onClick={() => window.print()} className="btn btn-ghost">
            <Printer className="size-4" aria-hidden="true" />
            พิมพ์รายการเหตุ
          </button>
        }
      />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-danger-700 via-danger-600 to-danger-500 px-5 py-4 text-white shadow-card sm:px-6">
        <div
          className="pointer-events-none absolute -right-10 -top-16 size-52 rounded-full bg-white/10 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <Siren className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
              <span className="size-1.5 rounded-full bg-white animate-soft-pulse" />
              เหตุวิกฤตกำลังดำเนินการ
            </p>
            <p className="mt-1 text-[15px] font-bold leading-snug">
              {criticalCall.type} · {criticalCall.location}
            </p>
            <p className="mt-1 text-[11.5px] text-white/70">
              {criticalCall.unit} กำลังนำส่ง · ถึงโรงพยาบาลใน {criticalCall.eta} · แจ้งเมื่อ {criticalCall.time} น.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedCall(criticalCall)}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-bold text-danger-700 transition hover:bg-danger-50"
          >
            ดูรายละเอียดเคส
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label="รถพร้อมออกเหตุ"
          value="2"
          unit="/ 4 คัน"
          icon={Ambulance}
          tone="green"
          detail="1 ออกเหตุ · 1 ซ่อมบำรุง"
        />
        <StatCard
          index={1}
          label="เหตุวันนี้"
          value="18"
          unit="เคส"
          icon={Siren}
          tone="red"
          trend={{ value: '+3 เคส', direction: 'up', positive: false }}
          detail="ในชั่วโมงที่ผ่านมา"
        />
        <StatCard
          index={2}
          label="เวลาตอบสนองเฉลี่ย"
          value="7.4"
          unit="นาที"
          icon={Timer}
          tone="blue"
          trend={{ value: '−0.6 นาที', direction: 'down', positive: true }}
          detail="เทียบกับสัปดาห์ก่อน"
        />
        <StatCard
          index={3}
          label="นำส่งสำเร็จ"
          value="16"
          unit="เคส"
          icon={CircleCheck}
          tone="green"
          detail="อัตราความสำเร็จ 94%"
          progress={{ value: 94, label: 'อัตรานำส่งสำเร็จ', tone: 'green' }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <SectionCard
          className="xl:col-span-8"
          index={1}
          title="รายการแจ้งเหตุ"
          description="เรียงตามเวลาที่รับแจ้ง ล่าสุดอยู่ด้านบน"
          bodyClassName="px-0 pb-2 pt-4 sm:px-0 sm:pb-2"
        >
          <div className="px-5 pb-3 sm:px-6">
            <Segmented label="กรองรายการเหตุ" value={filter} onChange={setFilter} options={filters} />
          </div>

          <div className="hidden overflow-x-auto scroll-thin md:block">
            <table className="data-table w-full min-w-[640px] border-collapse">
              <caption className="sr-only">รายการแจ้งเหตุฉุกเฉินวันนี้</caption>
              <thead className="table-head">
                <tr>
                  <th scope="col">เวลา</th>
                  <th scope="col">รหัส / อาการ</th>
                  <th scope="col">สถานที่</th>
                  <th scope="col">สถานะ</th>
                  <th scope="col">ETA</th>
                  <th scope="col">
                    <span className="sr-only">การดำเนินการ</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleCalls.map((call) => (
                  <tr key={call.id}>
                    <td className="whitespace-nowrap font-semibold tabular-nums text-ink-700">{call.time}</td>
                    <td>
                      <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-900">
                        {call.id}
                        <span className={`pill ${tonePill[triageTone[call.triage]]}`}>{call.triage}</span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-ink-400">{call.type}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-ink-300">
                        <Radio className="size-2.5" aria-hidden="true" />
                        {call.unit}
                      </p>
                    </td>
                    <td>
                      <span className="flex items-start gap-1 text-[11.5px] text-ink-500">
                        <MapPin className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                        {call.location}
                      </span>
                    </td>
                    <td>
                      <span className={`pill ${tonePill[statusTone[call.status]]}`}>{call.status}</span>
                    </td>
                    <td className="whitespace-nowrap text-[11.5px] font-semibold text-ink-500">{call.eta}</td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedCall(call)}
                        className="cursor-pointer rounded-lg px-2 py-1 text-[11px] font-semibold text-brand-600 transition hover:bg-brand-50"
                      >
                        ดูเคส
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleCalls.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-xs text-ink-400">
                      ไม่พบรายการในตัวกรองนี้
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-line/70 md:hidden">
            {visibleCalls.map((call) => (
              <li key={`${call.id}-mobile`} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-1.5 text-[12.5px] font-bold text-ink-900">
                      <span className="tabular-nums">{call.time}</span>
                      <span>{call.id}</span>
                      <span className={`pill ${tonePill[triageTone[call.triage]]}`}>{call.triage}</span>
                    </p>
                    <p className="mt-1 text-[11.5px] text-ink-600">{call.type}</p>
                    <p className="mt-1 flex items-start gap-1 text-[10.5px] text-ink-400">
                      <MapPin className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                      {call.location} · {call.unit}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCall(call)}
                    className="shrink-0 cursor-pointer rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-semibold text-brand-600 transition hover:bg-brand-50"
                  >
                    ดูเคส
                  </button>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <span className={`pill ${tonePill[statusTone[call.status]]}`}>{call.status}</span>
                  <span className="text-[10px] font-semibold text-ink-400">ETA {call.eta}</span>
                </div>
              </li>
            ))}
            {visibleCalls.length === 0 ? (
              <li className="px-5 py-8 text-center text-xs text-ink-400">ไม่พบรายการในตัวกรองนี้</li>
            ) : null}
          </ul>

          <p className="px-5 pt-2 text-[10.5px] text-ink-300 sm:px-6">
            แสดง {visibleCalls.length} จาก {emsCalls.length} รายการ · อัปเดตทุก 30 วินาที
          </p>
        </SectionCard>

        <SectionCard
          className="xl:col-span-4"
          index={2}
          title="ทีมรถพยาบาล"
          description="พร้อมปฏิบัติการ 2 จาก 4 คัน"
          action={<span className="pill pill-green">2 พร้อม</span>}
        >
          <ul className="space-y-2">
            {ambulances.map((unit) => {
              const tone = statusTone[unit.status]
              return (
                <li key={unit.id} className="rounded-xl border border-line/80 p-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                        unit.status === 'ซ่อมบำรุง'
                          ? 'bg-ink-50 text-ink-400'
                          : unit.status === 'ออกเหตุ'
                            ? 'bg-danger-50 text-danger-600'
                            : 'bg-success-50 text-success-700'
                      }`}
                    >
                      <Ambulance className="size-4" strokeWidth={1.9} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center justify-between gap-2 text-[12.5px] font-bold text-ink-800">
                        {unit.id}
                        <span className={`pill ${tonePill[tone]}`}>{unit.status}</span>
                      </p>
                      <p className="mt-0.5 truncate text-[10.5px] text-ink-400">
                        {unit.model} · {unit.level}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-line/70 pt-2 text-[10.5px] text-ink-400">
                    <span className="flex min-w-0 items-center gap-1 truncate">
                      <Radio className="size-3 shrink-0" aria-hidden="true" />
                      {unit.crew}
                    </span>
                    <span className="flex min-w-0 items-center gap-1 truncate text-right">
                      <MapPin className="size-3 shrink-0" aria-hidden="true" />
                      {unit.location}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <SectionCard
          className="xl:col-span-7"
          index={3}
          title="เวลาตอบสนองตามช่วงเวลา"
          description="เวลาเฉลี่ยตั้งแต่รับแจ้งจนถึงจุดเกิดเหตุ (นาที)"
          action={
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-400">
              <span className="size-2 rounded-full bg-danger-500" aria-hidden="true" />
              เกินเป้าหมาย 8 นาที
            </span>
          }
        >
          <ResponseBarChart
            data={responseTimes}
            ariaLabel="เวลาตอบสนองเฉลี่ยรายช่วงเวลา สูงสุดที่ช่วง 12:00 นาที 10.6 นาที"
          />
          <p className="mt-2 border-t border-line/80 pt-3 text-[11px] leading-relaxed text-ink-400">
            ช่วง 12:00 น. มีเวลาตอบสนองเกินเป้าหมายจากปริมาณเหตุที่เพิ่มขึ้น ควรจัดรถสำรองเพิ่มในช่วงดังกล่าว
          </p>
        </SectionCard>

        <SectionCard
          className="xl:col-span-5"
          index={4}
          title="มาตรฐานการตอบสนอง"
          description="เทียบเวลาจริงกับเป้าหมายที่กำหนด"
        >
          <ul className="space-y-3.5">
            {protocol.map((step) => {
              const passed = step.actual <= step.target
              return (
                <li key={step.label}>
                  <div className="flex items-center justify-between gap-2 text-[11.5px]">
                    <span className="truncate font-medium text-ink-600">{step.label}</span>
                    <span className={`shrink-0 font-bold tabular-nums ${passed ? 'text-success-700' : 'text-danger-600'}`}>
                      {step.actual} {step.unit}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className={`h-full rounded-full ${passed ? 'bg-success-600' : 'bg-danger-500'}`}
                      style={{ width: `${Math.min((step.actual / step.target) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-ink-400">
                    เป้าหมาย ≤ {step.target} {step.unit} ·{' '}
                    <span className={passed ? 'font-semibold text-success-700' : 'font-semibold text-danger-600'}>
                      {passed ? 'ผ่านเกณฑ์' : 'เกินเป้าหมาย'}
                    </span>
                  </p>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2.5 text-[11px] leading-relaxed text-brand-700 ring-1 ring-brand-100">
            <Clock className="size-3.5 shrink-0" aria-hidden="true" />
            อัตราตอบสนองภายในเป้าหมายวันนี้ {percent(15, 18)}%
          </div>
        </SectionCard>
      </div>

      {selectedCall ? <CallDialog call={selectedCall} onClose={() => setSelectedCall(null)} /> : null}
    </div>
  )
}
