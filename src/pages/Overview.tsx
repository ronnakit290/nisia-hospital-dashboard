import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Ambulance,
  ArrowRight,
  BedDouble,
  Clock,
  MapPin,
  Pill,
  Printer,
  Siren,
  Stethoscope,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  activityFeed,
  admissions7d,
  admissions30d,
  ambulances,
  departmentStatus,
  staffOnDuty,
  triageBreakdown,
} from '../data/clinical'
import { AdmissionsChart, TriageDonut } from '../components/charts'
import { PageHeader, SectionCard, Segmented, StatCard, ViewAllLink } from '../components/ui'
import { formatNumber, percent, statusTone, toneDot, tonePill } from '../lib/ui'

const deptIcons: Record<string, LucideIcon> = {
  ems: Ambulance,
  pharmacy: Pill,
  medicine: Stethoscope,
}

type Period = '7d' | '30d'

export default function Overview() {
  const [period, setPeriod] = useState<Period>('7d')
  const navigate = useNavigate()

  const chartData = period === '7d' ? admissions7d : admissions30d
  const admittedTotal = chartData.reduce((sum, item) => sum + item.admitted, 0)
  const dischargedTotal = chartData.reduce((sum, item) => sum + item.discharged, 0)

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="ศูนย์ควบคุม · ภาพรวม"
        title="ภาพรวมโรงพยาบาล"
        description="สถานะผู้ป่วย ภาระงาน และทรัพยากรของทุกแผนก ณ วันที่ 8 พฤศจิกายน 2569 · กะเช้า"
        actions={
          <>
            <span className="hidden items-center gap-1.5 rounded-full border border-line bg-white px-3 py-2 text-[11px] font-semibold text-ink-500 sm:inline-flex">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full rounded-full bg-success-600 opacity-70 animate-soft-pulse" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              ข้อมูลสด · 09:24
            </span>
            <button type="button" onClick={() => window.print()} className="btn btn-ghost">
              <Printer className="size-4" aria-hidden="true" />
              พิมพ์รายงาน
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label="ผู้ป่วยในความดูแล"
          value="248"
          unit="ราย"
          icon={Users}
          tone="blue"
          trend={{ value: '+12 ราย', direction: 'up', positive: true }}
          detail="จากเมื่อวาน"
        />
        <StatCard
          index={1}
          label="ผู้ป่วยฉุกเฉินรอรับบริการ"
          value="12"
          unit="ราย"
          icon={Siren}
          tone="red"
          detail="3 ราย ระดับแดง · ต้องประเมินทันที"
        />
        <StatCard
          index={2}
          label="ใบสั่งยารอดำเนินการ"
          value="34"
          unit="รายการ"
          icon={Pill}
          tone="amber"
          trend={{ value: '−6 รายการ', direction: 'down', positive: true }}
          detail="จากรอบตรวจสอบก่อนหน้า"
        />
        <StatCard
          index={3}
          label="เตียงว่าง"
          value="26"
          unit="/ 186 เตียง"
          icon={BedDouble}
          tone="green"
          detail="อัตราครองเตียง 86%"
          progress={{ value: 86, label: 'อัตราครองเตียง', tone: 'blue' }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <SectionCard
          className="xl:col-span-8"
          index={1}
          title="ภาพรวมผู้ป่วยรับเข้า–จำหน่าย"
          description="จำนวนผู้ป่วยรับใหม่และจำหน่ายออก เปรียบเทียบรายวัน"
          action={
            <Segmented
              label="ช่วงเวลาของกราฟ"
              value={period}
              onChange={setPeriod}
              options={[
                { value: '7d', label: '7 วัน' },
                { value: '30d', label: '30 วัน' },
              ]}
            />
          }
        >
          <AdmissionsChart
            data={chartData}
            ariaLabel={`กราฟผู้ป่วยรับใหม่และจำหน่าย ${
              period === '7d' ? '7 วัน' : '30 วัน'
            } รวมรับใหม่ ${admittedTotal} ราย จำหน่าย ${dischargedTotal} ราย`}
          />
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line/80 pt-3.5 text-xs">
            <span className="text-ink-400">
              รับใหม่รวม <span className="font-bold text-ink-800">{formatNumber(admittedTotal)}</span> ราย
            </span>
            <span className="text-ink-400">
              จำหน่ายรวม <span className="font-bold text-ink-800">{formatNumber(dischargedTotal)}</span> ราย
            </span>
            <span className="ml-auto inline-flex items-center gap-1 font-semibold text-brand-600">
              <Clock className="size-3.5" aria-hidden="true" />
              ข้อมูลทุก 15 นาที
            </span>
          </div>
        </SectionCard>

        <SectionCard
          className="xl:col-span-4"
          index={2}
          title="คัดกรองผู้ป่วยฉุกเฉิน"
          description="จำนวนผู้ป่วยในห้องฉุกเฉินแยกตามระดับคัดกรอง"
          action={<ViewAllLink onClick={() => navigate('/dashboard/ems')} label="ดู EMS" />}
        >
          <TriageDonut
            data={triageBreakdown}
            ariaLabel="ผู้ป่วยฉุกเฉิน 30 ราย แดง 3 ราย ส้ม 5 ราย เหลือง 8 ราย เขียว 14 ราย"
          />
          <div className="mt-4 rounded-xl bg-danger-50 px-3.5 py-3 ring-1 ring-danger-100">
            <p className="flex items-start gap-2 text-[11px] font-medium leading-relaxed text-danger-700">
              <Siren className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              มีผู้ป่วยระดับแดง 3 ราย ต้องได้รับการประเมินโดยแพทย์ภายใน 10 นาที
            </p>
          </div>
        </SectionCard>

        <SectionCard
          className="xl:col-span-4"
          index={3}
          title="สถานะแผนก"
          description="ภาระงานเทียบกับกำลังคนในกะปัจจุบัน"
        >
          <ul className="space-y-1">
            {departmentStatus.map((dept) => {
              const Icon = deptIcons[dept.id]
              const ToneDot = toneDot[dept.tone]
              return (
                <li key={dept.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/${dept.id}`)}
                    className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-ink-50"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-ink-50 text-ink-600 ring-1 ring-line">
                      <Icon className="size-4" strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px] font-semibold text-ink-800">{dept.name}</span>
                        <span className="shrink-0 text-[11px] font-bold tabular-nums text-ink-500">{dept.load}%</span>
                      </span>
                      <span className="mt-1.5 flex items-center gap-2">
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                          <span
                            className={`block h-full rounded-full ${ToneDot}`}
                            style={{ width: `${dept.load}%` }}
                          />
                        </span>
                        <span className="shrink-0 text-[10px] text-ink-400">{dept.detail}</span>
                      </span>
                    </span>
                    <ArrowRight className="size-3.5 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-ink-500" aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 rounded-xl border border-dashed border-line px-3.5 py-2.5">
            <p className="text-[11px] leading-relaxed text-ink-400">
              <span className="font-semibold text-ink-600">ข้อสังเกต:</span> เวชกรรมมีภาระงานสูง
              ควรพิจารณาเพิ่มพยาบาลในกะบ่าย
            </p>
          </div>
        </SectionCard>

        <SectionCard
          className="xl:col-span-4"
          index={4}
          title="รถพยาบาล"
          description="สถานะรถและทีมปฏิบัติการในปัจจุบัน"
          action={<ViewAllLink onClick={() => navigate('/dashboard/ems')} />}
        >
          <ul className="space-y-2">
            {ambulances.map((unit) => {
              const tone = statusTone[unit.status]
              return (
                <li
                  key={unit.id}
                  className="flex items-center gap-3 rounded-xl border border-line/80 px-3 py-2.5"
                >
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                      unit.status === 'ซ่อมบำรุง' ? 'bg-ink-50 text-ink-400' : 'bg-brand-50 text-brand-600'
                    }`}
                  >
                    <Ambulance className="size-4" strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-ink-800">{unit.id}</span>
                      <span className={`pill ${tonePill[tone]}`}>{unit.status}</span>
                    </span>
                    <span className="mt-1 flex items-center gap-1 truncate text-[10.5px] text-ink-400">
                      <MapPin className="size-3 shrink-0" aria-hidden="true" />
                      {unit.location}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        </SectionCard>

        <SectionCard
          className="xl:col-span-4"
          index={5}
          title="กิจกรรมล่าสุด"
          description="เหตุการณ์สำคัญจากทุกแผนก"
        >
          <ol className="relative">
            {activityFeed.map((item, index) => (
              <li key={`${item.time}-${item.title}`} className="relative flex gap-3 pb-4 last:pb-0">
                {index < activityFeed.length - 1 ? (
                  <span
                    className="absolute left-[5px] top-3 h-full w-px bg-line"
                    aria-hidden="true"
                  />
                ) : null}
                <span className={`relative mt-1.5 size-[11px] shrink-0 rounded-full ring-4 ring-white ${toneDot[item.tone]}`} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold leading-snug text-ink-800">{item.title}</p>
                  <p className="mt-0.5 truncate text-[10.5px] text-ink-400">{item.meta}</p>
                </div>
                <time className="shrink-0 pt-0.5 text-[10px] font-medium tabular-nums text-ink-300">{item.time}</time>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>

      <SectionCard
        index={6}
        title="ทีมเวรวันนี้"
        description="บุคลากรที่ปฏิบัติงานในกะเช้า 08:00–16:00"
        action={<span className="pill pill-blue">ผลัดถัดไป 16:00</span>}
      >
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {staffOnDuty.map((person) => (
            <div key={person.name} className="flex items-center gap-2.5 rounded-xl border border-line/80 bg-ink-50/40 px-3 py-2.5">
              <span
                className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: person.color }}
                aria-hidden="true"
              >
                {person.initials}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-bold text-ink-800">{person.name}</span>
                <span className="mt-0.5 block truncate text-[10px] text-ink-400">{person.role}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line/80 pt-3.5 text-[11px] text-ink-400">
          <span>
            เตียงว่างแยกตามกลุ่มงาน:{' '}
            <span className="font-semibold text-ink-700">อายุรกรรม 10 · อื่น ๆ 16</span>
          </span>
          <span>
            อัตราครองเตียงเฉลี่ย:{' '}
            <span className="font-semibold text-ink-700">{percent(160, 186)}%</span>
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="ml-auto inline-flex cursor-pointer items-center gap-1 font-semibold text-brand-600 transition hover:text-brand-700"
          >
            พิมพ์รายงานประจำวัน
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </SectionCard>
    </div>
  )
}
