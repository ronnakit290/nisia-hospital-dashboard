import { useEffect, useState } from 'react'
import {
  CircleAlert,
  CircleCheck,
  ClipboardList,
  Clock,
  Package,
  Pill,
  Printer,
  Search,
  ShieldCheck,
} from 'lucide-react'
import type { Prescription } from '../data/clinical'
import { dispense7d, interactionAlerts, prescriptions, stockAlerts } from '../data/clinical'
import { PageHeader, SectionCard, Segmented, StatCard } from '../components/ui'
import { DispenseBarChart } from '../components/charts'
import { formatNumber, percent, statusTone, tonePill } from '../lib/ui'

type Filter = 'all' | 'pending' | 'preparing' | 'verify' | 'done'

const filterMatches: Record<Exclude<Filter, 'all'>, Prescription['status']> = {
  pending: 'รอจ่าย',
  preparing: 'กำลังจัดยา',
  verify: 'รอตรวจสอบ',
  done: 'จ่ายแล้ว',
}

const filterLabels: { value: Filter; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'pending', label: 'รอจ่าย' },
  { value: 'preparing', label: 'กำลังจัดยา' },
  { value: 'verify', label: 'รอตรวจสอบ' },
  { value: 'done', label: 'จ่ายแล้ว' },
]

export default function Pharmacy() {
  const [queue, setQueue] = useState<Prescription[]>(prescriptions)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [pendingTotal, setPendingTotal] = useState(34)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 3200)
    return () => window.clearTimeout(timer)
  }, [notice])

  const visibleQueue = queue.filter((item) => {
    if (filter !== 'all' && item.status !== filterMatches[filter]) return false
    const query = search.trim().toLowerCase()
    if (!query) return true
    return `${item.id} ${item.patient} ${item.ward}`.toLowerCase().includes(query)
  })

  function dispense(item: Prescription) {
    setQueue((items) =>
      items.map((entry) => (entry.id === item.id ? { ...entry, status: 'จ่ายแล้ว', waiting: 0 } : entry)),
    )
    setPendingTotal((total) => Math.max(0, total - 1))
    setNotice(`จ่ายยาใบสั่ง ${item.id} ของ ${item.patient} เรียบร้อยแล้ว`)
  }

  const filtersWithCounts = filterLabels.map((option) => ({
    ...option,
    count:
      option.value === 'all'
        ? queue.length
        : queue.filter((item) => item.status === filterMatches[option.value as Exclude<Filter, 'all'>]).length,
  }))

  const weeklyTotal = dispense7d.reduce((sum, item) => sum + item.count, 0)
  const criticalStock = stockAlerts.filter((item) => percent(item.remaining, item.minimum) <= 40).length

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="ศูนย์ควบคุม · เภสัชกรรม"
        title="งานเภสัชกรรม"
        description="จัดการคิวใบสั่งยา ตรวจสอบความปลอดภัยของคำสั่งใช้ยา และติดตามระดับคงคลัง"
        actions={
          <button type="button" onClick={() => window.print()} className="btn btn-ghost">
            <Printer className="size-4" aria-hidden="true" />
            พิมพ์รายการรอจ่าย
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label="ใบสั่งยารอดำเนินการ"
          value={String(pendingTotal)}
          unit="รายการ"
          icon={ClipboardList}
          tone="amber"
          detail="รวมทุกจุดจ่ายยาในโรงพยาบาล"
        />
        <StatCard
          index={1}
          label="จ่ายยาแล้ววันนี้"
          value="186"
          unit="รายการ"
          icon={CircleCheck}
          tone="green"
          trend={{ value: '+14 รายการ', direction: 'up', positive: true }}
          detail="เทียบกับเมื่อวาน"
        />
        <StatCard
          index={2}
          label="รายการยาใกล้หมด"
          value={String(stockAlerts.length)}
          unit="รายการ"
          icon={Package}
          tone="red"
          detail={`${criticalStock} รายการต่ำกว่าระดับวิกฤต`}
        />
        <StatCard
          index={3}
          label="คำสั่งซื้อรออนุมัติ"
          value="3"
          unit="รายการ"
          icon={ClipboardList}
          tone="blue"
          detail="มูลค่ารวม ฿48,200"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <SectionCard
          className="xl:col-span-8"
          index={1}
          title="คิวใบสั่งยา"
          description={`แสดง ${visibleQueue.length} รายการจากคิวล่าสุด — เลือก “จ่ายยา” เพื่ออัปเดตสถานะ`}
          action={
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-400" aria-hidden="true" />
              <label htmlFor="rx-search" className="sr-only">
                ค้นหาใบสั่งยา
              </label>
              <input
                id="rx-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ค้นหาชื่อ / เลขใบสั่งยา"
                className="w-48 rounded-lg border border-line bg-white py-1.5 pl-8 pr-2.5 text-[11.5px] text-ink-700 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                autoComplete="off"
              />
            </div>
          }
          bodyClassName="px-0 pb-2 pt-4 sm:px-0 sm:pb-2"
        >
          <div className="flex flex-col gap-2 px-5 pb-3 sm:flex-row sm:items-center sm:px-6">
            <Segmented label="กรองสถานะใบสั่งยา" value={filter} onChange={setFilter} options={filtersWithCounts} />
            <div className="relative sm:hidden">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-400" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ค้นหาชื่อ / เลขใบสั่งยา"
                className="w-full rounded-lg border border-line bg-white py-2 pl-8 pr-2.5 text-xs text-ink-700 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                aria-label="ค้นหาใบสั่งยา"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="hidden overflow-x-auto scroll-thin md:block">
            <table className="data-table w-full min-w-[620px] border-collapse">
              <caption className="sr-only">คิวใบสั่งยาที่รอดำเนินการ</caption>
              <thead className="table-head">
                <tr>
                  <th scope="col">ใบสั่งยา</th>
                  <th scope="col">ผู้ป่วย</th>
                  <th scope="col">รายการยา</th>
                  <th scope="col">รอ (นาที)</th>
                  <th scope="col">สถานะ</th>
                  <th scope="col">
                    <span className="sr-only">การดำเนินการ</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleQueue.map((item) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap">
                      <p className="text-[12px] font-bold text-ink-800">{item.id}</p>
                      <p className="mt-1">
                        <span className={`pill ${item.priority === 'ด่วน' ? 'pill-red' : 'pill-slate'}`}>
                          {item.priority}
                        </span>
                      </p>
                    </td>
                    <td>
                      <p className="text-[12.5px] font-semibold text-ink-800">{item.patient}</p>
                      <p className="mt-0.5 text-[10.5px] text-ink-400">{item.ward}</p>
                    </td>
                    <td className="whitespace-nowrap text-[12px] font-semibold tabular-nums text-ink-700">{item.items} รายการ</td>
                    <td className="whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[12px] font-semibold tabular-nums ${
                          item.waiting >= 15 ? 'text-danger-600' : 'text-ink-600'
                        }`}
                      >
                        <Clock className="size-3" aria-hidden="true" />
                        {item.waiting}
                      </span>
                    </td>
                    <td>
                      <span className={`pill ${tonePill[statusTone[item.status]]}`}>{item.status}</span>
                    </td>
                    <td className="text-right">
                      {item.status === 'จ่ายแล้ว' ? (
                        <span className="inline-flex items-center gap-1 whitespace-nowrap pr-1 text-[11px] font-semibold text-success-700">
                          <CircleCheck className="size-3.5" aria-hidden="true" />
                          เสร็จสิ้น
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => dispense(item)}
                          className="cursor-pointer whitespace-nowrap rounded-lg bg-brand-600 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-brand-700"
                        >
                          จ่ายยา
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {visibleQueue.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-xs text-ink-400">
                      ไม่พบใบสั่งยาที่ตรงกับเงื่อนไข
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-line/70 md:hidden">
            {visibleQueue.map((item) => (
              <li key={`${item.id}-mobile`} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[12.5px] font-bold text-ink-900">
                      {item.id}
                      <span className={`pill ${item.priority === 'ด่วน' ? 'pill-red' : 'pill-slate'}`}>
                        {item.priority}
                      </span>
                    </p>
                    <p className="mt-1 text-[11.5px] font-semibold text-ink-700">{item.patient}</p>
                    <p className="mt-0.5 text-[10.5px] text-ink-400">{item.ward}</p>
                  </div>
                  <span className={`pill shrink-0 ${tonePill[statusTone[item.status]]}`}>{item.status}</span>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-3 text-[10.5px] text-ink-400">
                    <span>{item.items} รายการ</span>
                    <span
                      className={`inline-flex items-center gap-1 tabular-nums ${
                        item.waiting >= 15 ? 'font-semibold text-danger-600' : ''
                      }`}
                    >
                      <Clock className="size-3" aria-hidden="true" />
                      รอ {item.waiting} นาที
                    </span>
                  </span>
                  {item.status === 'จ่ายแล้ว' ? (
                    <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-success-700">
                      <CircleCheck className="size-3.5" aria-hidden="true" />
                      เสร็จสิ้น
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => dispense(item)}
                      className="shrink-0 cursor-pointer rounded-lg bg-brand-600 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-brand-700"
                    >
                      จ่ายยา
                    </button>
                  )}
                </div>
              </li>
            ))}
            {visibleQueue.length === 0 ? (
              <li className="px-5 py-8 text-center text-xs text-ink-400">ไม่พบใบสั่งยาที่ตรงกับเงื่อนไข</li>
            ) : null}
          </ul>

          <p className="px-5 pt-2 text-[10.5px] text-ink-300 sm:px-6">
            รายการทั้งหมด {queue.length} ใบ · รอดำเนินการ {pendingTotal} รายการทั่วโรงพยาบาล
          </p>
        </SectionCard>

        <SectionCard
          className="xl:col-span-4"
          index={2}
          title="แจ้งเตือนคลังยา"
          description="รายการที่คงเหลือต่ำกว่าจุดสั่งซื้อ"
          action={<span className="pill pill-red">{stockAlerts.length} รายการ</span>}
        >
          <ul className="space-y-3">
            {stockAlerts.map((item) => {
              const ratio = percent(item.remaining, item.minimum)
              const critical = ratio <= 40
              return (
                <li key={item.name} className="rounded-xl border border-line/80 px-3 py-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-semibold text-ink-800">{item.name}</p>
                      <p className="mt-0.5 truncate text-[10px] text-ink-400">{item.detail}</p>
                    </div>
                    <span className={`pill shrink-0 ${critical ? 'pill-red' : 'pill-amber'}`}>
                      {critical ? 'วิกฤต' : 'ใกล้หมด'}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                      <span
                        className={`block h-full rounded-full ${critical ? 'bg-danger-500' : 'bg-warn-600'}`}
                        style={{ width: `${Math.min(ratio, 100)}%` }}
                      />
                    </span>
                    <span className="shrink-0 text-[10px] font-semibold tabular-nums text-ink-500">
                      {item.remaining} / {item.minimum} {item.unit}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-warn-50 px-3 py-2.5 text-[10.5px] leading-relaxed text-warn-700 ring-1 ring-warn-100">
            <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            ควรออกใบสั่งซื้อภายในวันนี้ เพื่อไม่ให้กระทบแผนการรักษาในสัปดาห์หน้า
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <SectionCard
          className="xl:col-span-7"
          index={3}
          title="ปริมาณการจ่ายยา"
          description="จำนวนรายการยาที่จ่ายให้ผู้ป่วยใน 7 วันที่ผ่านมา"
          action={<span className="pill pill-blue">รวม {formatNumber(weeklyTotal)} รายการ</span>}
        >
          <DispenseBarChart
            data={dispense7d}
            ariaLabel={`กราฟการจ่ายยา 7 วัน รวม ${weeklyTotal} รายการ สูงสุดวันศุกร์ 212 รายการ`}
          />
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-line/80 pt-3 text-[11px] text-ink-400">
            <span>
              เฉลี่ย <span className="font-bold text-ink-800">{Math.round(weeklyTotal / dispense7d.length)}</span> รายการ/วัน
            </span>
            <span>
              ระยะรอจ่ายเฉลี่ย <span className="font-bold text-ink-800">11.2</span> นาที
            </span>
            <span className="ml-auto inline-flex items-center gap-1 font-semibold text-success-700">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              ผ่านการตรวจสอบ 100%
            </span>
          </div>
        </SectionCard>

        <SectionCard
          className="xl:col-span-5"
          index={4}
          title="แจ้งเตือนอันตรกิริยาระหว่างยา"
          description="รายการที่ต้องได้รับการยืนยันจากเภสัชกรก่อนจ่ายยา"
          action={<span className="pill pill-red">{interactionAlerts.length} รายการ</span>}
        >
          <ul className="space-y-3">
            {interactionAlerts.map((alert) => (
              <li
                key={alert.id}
                className={`rounded-xl border-l-[3px] px-3.5 py-3 ${
                  alert.severity === 'สูง'
                    ? 'border-l-danger-500 bg-danger-50/70 ring-1 ring-danger-100'
                    : 'border-l-warn-600 bg-warn-50/70 ring-1 ring-warn-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12.5px] font-bold text-ink-900">{alert.drugs}</p>
                  <span className={`pill shrink-0 ${alert.severity === 'สูง' ? 'pill-red' : 'pill-amber'}`}>
                    ความเสี่ยง{alert.severity}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] font-medium text-ink-600">
                  {alert.patient} · {alert.ward}
                </p>
                <p className="mt-1 text-[10.5px] leading-relaxed text-ink-500">{alert.note}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-dashed border-line px-3 py-2.5 text-[10.5px] leading-relaxed text-ink-400">
            <Pill className="mt-0.5 size-3.5 shrink-0 text-brand-500" aria-hidden="true" />
            ระบบตรวจสอบอันตรกิริยาอัตโนมัติทำงานร่วมกับเภสัชกรผู้มีสิทธิ์ยืนยันคำสั่งใช้ยา
          </div>
        </SectionCard>
      </div>

      {notice ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-start gap-2.5 rounded-2xl border border-success-100 bg-white px-4 py-3 shadow-float sm:left-auto sm:right-6 sm:translate-x-0"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-success-50 text-success-700">
            <CircleCheck className="size-4" aria-hidden="true" />
          </span>
          <p className="pt-1 text-[11.5px] font-medium leading-relaxed text-ink-700">{notice}</p>
        </div>
      ) : null}
    </div>
  )
}
