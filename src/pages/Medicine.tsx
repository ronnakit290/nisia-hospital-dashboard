import { useEffect, useState } from 'react'
import {
  BedDouble,
  Check,
  Clock,
  FlaskConical,
  Printer,
  Search,
  Stethoscope,
  Users,
  UserRound,
  X,
} from 'lucide-react'
import type { Patient } from '../data/clinical'
import { labResults, patients, rounds, wardOccupancy7d, wards } from '../data/clinical'
import { PageHeader, SectionCard, Segmented, StatCard } from '../components/ui'
import { OccupancyAreaChart } from '../components/charts'
import { percent, statusTone, toneChip, tonePill } from '../lib/ui'

type Filter = 'all' | 'critical' | 'watch' | 'stable' | 'discharge'

const filterMatches: Record<Exclude<Filter, 'all'>, Patient['status']> = {
  critical: 'วิกฤต',
  watch: 'เฝ้าระวัง',
  stable: 'คงที่',
  discharge: 'รอจำหน่าย',
}

function PatientDialog({ patient, onClose }: { patient: Patient; onClose: () => void }) {
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
        aria-labelledby="patient-dialog-title"
        className="relative z-10 max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white shadow-float scroll-thin sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="eyebrow">ข้อมูลผู้ป่วย · {patient.id}</p>
            <h2 id="patient-dialog-title" className="mt-1 truncate text-lg font-bold text-ink-900">
              {patient.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="pill pill-blue">เตียง {patient.bed}</span>
              <span className={`pill ${tonePill[statusTone[patient.status]]}`}>{patient.status}</span>
              <span className="text-[11px] text-ink-400">อายุ {patient.age} ปี</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="icon-btn shrink-0" aria-label="ปิดข้อมูลผู้ป่วย" autoFocus>
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-line bg-ink-50/50 px-3.5 py-3">
              <p className="eyebrow">การวินิจฉัย</p>
              <p className="mt-1.5 text-[12.5px] font-semibold text-ink-800">{patient.diagnosis}</p>
            </div>
            <div className="rounded-xl border border-line bg-ink-50/50 px-3.5 py-3">
              <p className="eyebrow">แพทย์ผู้ดูแล</p>
              <p className="mt-1.5 text-[12.5px] font-semibold text-ink-800">{patient.doctor}</p>
            </div>
            <div className="rounded-xl border border-line bg-ink-50/50 px-3.5 py-3">
              <p className="eyebrow">เข้ารับการรักษา</p>
              <p className="mt-1.5 text-[12.5px] font-semibold text-ink-800">{patient.admitted}</p>
            </div>
            <div className="rounded-xl border border-danger-100 bg-danger-50/60 px-3.5 py-3">
              <p className="eyebrow text-danger-600/70">ประวัติแพ้ยา</p>
              <p className="mt-1.5 text-[12.5px] font-bold text-danger-700">{patient.allergies}</p>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-2.5">สัญญาณชีพล่าสุด</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {patient.vitals.map((vital) => (
                <div
                  key={vital.label}
                  className={`rounded-xl px-3 py-2.5 ring-1 ${toneChip[vital.tone]}`}
                >
                  <p className="text-[9.5px] font-semibold opacity-70">{vital.label}</p>
                  <p className="mt-1 text-lg font-bold leading-none tabular-nums">{vital.value}</p>
                  <p className="mt-1 text-[9.5px] opacity-60">{vital.unit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-line px-3.5 py-3">
            <p className="eyebrow">บันทึกการดูแล</p>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-600">{patient.note}</p>
          </div>

          <p className="flex items-center gap-1.5 text-[10.5px] text-ink-400">
            <Clock className="size-3.5" aria-hidden="true" />
            รอบตรวจเยี่ยมถัดไป {patient.round} น. · ข้อมูลอัปเดตล่าสุด 09:24 น.
          </p>
        </div>

        <div className="border-t border-line px-5 py-4 sm:px-6">
          <button type="button" onClick={onClose} className="btn btn-primary w-full">
            ปิดข้อมูลผู้ป่วย
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Medicine() {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const totalPatients = wards.reduce((sum, ward) => sum + ward.occupied, 0)
  const totalBeds = wards.reduce((sum, ward) => sum + ward.beds, 0)
  const occupancy = percent(totalPatients, totalBeds)

  const visiblePatients = patients.filter((patient) => {
    if (filter !== 'all' && patient.status !== filterMatches[filter]) return false
    const query = search.trim().toLowerCase()
    if (!query) return true
    return `${patient.name} ${patient.bed} ${patient.diagnosis} ${patient.doctor}`.toLowerCase().includes(query)
  })

  const filterOptions = [
    { value: 'all' as Filter, label: 'ทั้งหมด', count: patients.length },
    { value: 'critical' as Filter, label: 'วิกฤต', count: patients.filter((item) => item.status === 'วิกฤต').length },
    { value: 'watch' as Filter, label: 'เฝ้าระวัง', count: patients.filter((item) => item.status === 'เฝ้าระวัง').length },
    { value: 'stable' as Filter, label: 'คงที่', count: patients.filter((item) => item.status === 'คงที่').length },
    {
      value: 'discharge' as Filter,
      label: 'รอจำหน่าย',
      count: patients.filter((item) => item.status === 'รอจำหน่าย').length,
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="ศูนย์ควบคุม · เวชกรรม"
        title="กลุ่มงานอายุรกรรม"
        description="ติดตามผู้ป่วยใน การครองเตียง ผลการตรวจทางห้องปฏิบัติการ และกำหนดการตรวจเยี่ยม"
        actions={
          <button type="button" onClick={() => window.print()} className="btn btn-ghost">
            <Printer className="size-4" aria-hidden="true" />
            พิมพ์รายชื่อผู้ป่วย
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label="ผู้ป่วยในความดูแล"
          value={String(totalPatients)}
          unit="ราย"
          icon={Users}
          tone="blue"
          detail={`จาก ${totalBeds} เตียงในกลุ่มงาน`}
        />
        <StatCard
          index={1}
          label="อัตราครองเตียง"
          value={String(occupancy)}
          unit="%"
          icon={BedDouble}
          tone="amber"
          detail="สูงกว่าเป้าหมาย 85%"
          progress={{ value: occupancy, label: 'อัตราครองเตียง', tone: 'amber' }}
        />
        <StatCard
          index={2}
          label="รอรับเข้า"
          value="7"
          unit="ราย"
          icon={UserRound}
          tone="amber"
          detail="รอเตียงว่างจากหอผู้ป่วย"
        />
        <StatCard
          index={3}
          label="ผลแลปค้างอ่าน"
          value="11"
          unit="รายการ"
          icon={FlaskConical}
          tone="red"
          detail="3 รายการระดับด่วน"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <SectionCard
          className="xl:col-span-8"
          index={1}
          title="ผู้ป่วยใน"
          description="รายการผู้ป่วยที่อยู่ระหว่างการรักษาในกลุ่มงานอายุรกรรม"
          action={
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-400" aria-hidden="true" />
              <label htmlFor="patient-search" className="sr-only">
                ค้นหาผู้ป่วย
              </label>
              <input
                id="patient-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ค้นหาชื่อ / เตียง / การวินิจฉัย"
                className="w-52 rounded-lg border border-line bg-white py-1.5 pl-8 pr-2.5 text-[11.5px] text-ink-700 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                autoComplete="off"
              />
            </div>
          }
          bodyClassName="px-0 pb-2 pt-4 sm:px-0 sm:pb-2"
        >
          <div className="flex flex-col gap-2 px-5 pb-3 sm:px-6">
            <Segmented label="กรองสถานะผู้ป่วย" value={filter} onChange={setFilter} options={filterOptions} />
            <div className="relative sm:hidden">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-400" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ค้นหาชื่อ / เตียง / การวินิจฉัย"
                className="w-full rounded-lg border border-line bg-white py-2 pl-8 pr-2.5 text-xs text-ink-700 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                aria-label="ค้นหาผู้ป่วย"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="hidden overflow-x-auto scroll-thin md:block">
            <table className="data-table w-full min-w-[640px] border-collapse">
              <caption className="sr-only">รายชื่อผู้ป่วยในกลุ่มงานอายุรกรรม</caption>
              <thead className="table-head">
                <tr>
                  <th scope="col">เตียง</th>
                  <th scope="col">ผู้ป่วย</th>
                  <th scope="col">การวินิจฉัย</th>
                  <th scope="col">แพทย์ผู้ดูแล</th>
                  <th scope="col">สถานะ</th>
                  <th scope="col">
                    <span className="sr-only">การดำเนินการ</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visiblePatients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="whitespace-nowrap">
                      <span className="inline-grid min-w-9 place-items-center rounded-lg bg-ink-50 px-2 py-1 text-[11.5px] font-bold tabular-nums text-ink-700 ring-1 ring-line">
                        {patient.bed}
                      </span>
                    </td>
                    <td>
                      <p className="text-[12.5px] font-semibold text-ink-800">{patient.name}</p>
                      <p className="mt-0.5 text-[10.5px] text-ink-400">
                        {patient.id} · {patient.age} ปี
                      </p>
                    </td>
                    <td className="max-w-[200px] text-[11.5px] text-ink-500">{patient.diagnosis}</td>
                    <td className="whitespace-nowrap">
                      <p className="text-[11.5px] text-ink-600">{patient.doctor}</p>
                      <p className="mt-0.5 text-[10px] tabular-nums text-ink-400">ตรวจ {patient.round} น.</p>
                    </td>
                    <td>
                      <span className={`pill ${tonePill[statusTone[patient.status]]}`}>{patient.status}</span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedPatient(patient)}
                        className="cursor-pointer whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-semibold text-brand-600 transition hover:bg-brand-50"
                      >
                        ดูข้อมูล
                      </button>
                    </td>
                  </tr>
                ))}
                {visiblePatients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-xs text-ink-400">
                      ไม่พบผู้ป่วยที่ตรงกับเงื่อนไข
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-line/70 md:hidden">
            {visiblePatients.map((patient) => (
              <li key={`${patient.id}-mobile`} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span className="inline-grid min-w-9 shrink-0 place-items-center rounded-lg bg-ink-50 px-2 py-1 text-[11.5px] font-bold tabular-nums text-ink-700 ring-1 ring-line">
                      {patient.bed}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-semibold text-ink-800">{patient.name}</p>
                      <p className="mt-0.5 text-[10.5px] text-ink-400">
                        {patient.id} · {patient.age} ปี
                      </p>
                    </div>
                  </div>
                  <span className={`pill shrink-0 ${tonePill[statusTone[patient.status]]}`}>{patient.status}</span>
                </div>
                <p className="mt-2 text-[11.5px] text-ink-600">{patient.diagnosis}</p>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <p className="text-[10.5px] text-ink-400">
                    {patient.doctor} · ตรวจ {patient.round} น.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedPatient(patient)}
                    className="shrink-0 cursor-pointer rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-semibold text-brand-600 transition hover:bg-brand-50"
                  >
                    ดูข้อมูล
                  </button>
                </div>
              </li>
            ))}
            {visiblePatients.length === 0 ? (
              <li className="px-5 py-8 text-center text-xs text-ink-400">ไม่พบผู้ป่วยที่ตรงกับเงื่อนไข</li>
            ) : null}
          </ul>

          <p className="px-5 pt-2 text-[10.5px] text-ink-300 sm:px-6">
            แสดง {visiblePatients.length} จากผู้ป่วยทั้งหมด {patients.length} รายในตัวอย่าง · ข้อมูลผู้ป่วยในรวม {totalPatients} ราย
          </p>
        </SectionCard>

        <SectionCard
          className="xl:col-span-4"
          index={2}
          title="การครองเตียง"
          description={`รวม ${totalPatients} จาก ${totalBeds} เตียง`}
          action={<span className="pill pill-amber">{occupancy}%</span>}
        >
          <ul className="space-y-3.5">
            {wards.map((ward) => {
              const wardOccupancy = percent(ward.occupied, ward.beds)
              const full = ward.occupied >= ward.beds
              const high = wardOccupancy >= 90
              return (
                <li key={ward.id}>
                  <div className="flex items-center justify-between gap-2 text-[11.5px]">
                    <span className="truncate font-semibold text-ink-700">{ward.name}</span>
                    <span className={`shrink-0 pill ${full ? 'pill-red' : high ? 'pill-amber' : 'pill-green'}`}>
                      {full ? 'เต็ม' : high ? 'สูง' : 'ปกติ'}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                      <span
                        className={`block h-full rounded-full ${full ? 'bg-danger-500' : high ? 'bg-warn-600' : 'bg-success-600'}`}
                        style={{ width: `${Math.min(wardOccupancy, 100)}%` }}
                      />
                    </span>
                    <span className="shrink-0 text-[10px] font-semibold tabular-nums text-ink-500">
                      {ward.occupied}/{ward.beds}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-ink-400">
                    {ward.nurse} · คิดเป็น {wardOccupancy}%
                  </p>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-danger-50 px-3 py-2.5 text-[10.5px] leading-relaxed text-danger-700 ring-1 ring-danger-100">
            <BedDouble className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            หอผู้ป่วยวิกฤตเต็ม 100% — ผู้ป่วยรอรับเข้า 2 รายต้องรอเตียงหรือส่งต่อ
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <SectionCard
          className="xl:col-span-7"
          index={3}
          title="อัตราครองเตียง 7 วัน"
          description="เปรียบเทียบอัตราการใช้เตียงของกลุ่มงานอายุรกรรม"
          action={<span className="pill pill-blue">เฉลี่ย 87%</span>}
        >
          <OccupancyAreaChart
            data={wardOccupancy7d}
            ariaLabel="กราฟอัตราครองเตียง 7 วัน สูงสุดวันศุกร์ 91 เปอร์เซ็นต์"
          />
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line/80 pt-3">
            {[
              { label: 'เตียงว่าง', value: String(totalBeds - totalPatients), unit: 'เตียง' },
              { label: 'รอรับเข้า', value: '7', unit: 'ราย' },
              { label: 'สูงสุดในสัปดาห์', value: '91', unit: '%' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-ink-50/70 px-3 py-2.5">
                <p className="text-[9.5px] font-medium text-ink-400">{item.label}</p>
                <p className="mt-1 text-base font-bold leading-none tabular-nums text-ink-900">
                  {item.value}
                  <span className="ml-1 text-[9.5px] font-medium text-ink-400">{item.unit}</span>
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-brand-50/70 px-3 py-2.5 text-[10.5px] leading-relaxed text-brand-700 ring-1 ring-brand-100">
            <BedDouble className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            เป้าหมายอัตราครองเตียงไม่เกิน 85% · ปัจจุบัน {occupancy}% (สูงกว่าเป้าหมาย {occupancy - 85} จุด)
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-400">
            แนวโน้มครองเตียงสูงต่อเนื่องตั้งแต่กลางสัปดาห์ ควรเตรียมแผนรองรับการรับผู้ป่วยใหม่ในช่วงสุดสัปดาห์
          </p>
        </SectionCard>

        <SectionCard
          className="xl:col-span-5"
          index={4}
          title="ผลแลปรออ่าน"
          description="รายการที่รอการยืนยันผลจากแพทย์"
          action={<span className="pill pill-blue">{labResults.length} รายการ</span>}
        >
          <ul className="space-y-2">
            {labResults.map((lab) => (
              <li key={lab.id} className="flex items-start gap-2.5 rounded-xl border border-line/80 px-3 py-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                  <FlaskConical className="size-3.5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[11.5px] font-bold text-ink-800">{lab.test}</span>
                    <span className={`pill shrink-0 ${lab.priority === 'ด่วน' ? 'pill-red' : 'pill-slate'}`}>
                      {lab.priority}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-[10.5px] text-ink-400">{lab.patient}</span>
                  <span className="mt-1 flex items-center gap-1 text-[9.5px] text-ink-300">
                    <Clock className="size-3" aria-hidden="true" />
                    เก็บตัวอย่าง {lab.collected} น.
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-ink-300">แสดง 5 รายการล่าสุดจากทั้งหมด 11 รายการ</p>
        </SectionCard>
      </div>

      <SectionCard
        index={5}
        title="ตารางตรวจเยี่ยมวันนี้"
        description="กำหนดการของทีมแพทย์และพยาบาลประจำกะเช้า"
        action={<span className="pill pill-green">กำลังดำเนินการ</span>}
      >
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {rounds.map((round) => {
            const done = round.state === 'done'
            const active = round.state === 'active'
            return (
              <li
                key={round.time}
                className={`flex h-full flex-col rounded-xl border p-3.5 ${
                  active
                    ? 'border-brand-200 bg-brand-50/70'
                    : done
                      ? 'border-success-100 bg-success-50/40'
                      : 'border-line bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[16px] font-bold tabular-nums tracking-tight text-ink-900">{round.time}</span>
                  <span className={`pill ${done ? 'pill-green' : active ? 'pill-blue' : 'pill-slate'}`}>
                    {done ? 'เสร็จสิ้น' : active ? 'กำลังดำเนินการ' : 'รอดำเนินการ'}
                  </span>
                </div>
                <p className="mt-2.5 text-[12px] font-semibold leading-snug text-ink-800">{round.title}</p>
                <p className="mt-1 text-[10.5px] leading-relaxed text-ink-400">{round.meta}</p>
                <span
                  className={`mt-auto flex items-center gap-1 pt-3 text-[10px] font-semibold ${
                    done ? 'text-success-700' : active ? 'text-brand-700' : 'text-ink-300'
                  }`}
                >
                  {done ? <Check className="size-3" aria-hidden="true" /> : <Clock className="size-3" aria-hidden="true" />}
                  {done ? 'ดำเนินการแล้ว' : active ? 'กำลังทำอยู่' : 'รอถึงกำหนด'}
                </span>
              </li>
            )
          })}
        </ol>
        <div className="mt-4 flex items-center gap-2 border-t border-line/80 pt-3 text-[10.5px] text-ink-400">
          <Stethoscope className="size-3.5 shrink-0 text-brand-500" aria-hidden="true" />
          ตรวจเยี่ยมรอบถัดไป 09:30 น. · นพ. กิตติศักดิ์
        </div>
      </SectionCard>

      {selectedPatient ? <PatientDialog patient={selectedPatient} onClose={() => setSelectedPatient(null)} /> : null}
    </div>
  )
}
