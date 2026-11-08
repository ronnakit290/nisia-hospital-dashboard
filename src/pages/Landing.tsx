import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Ambulance,
  ArrowRight,
  Activity,
  Clock,
  Phone,
  Pill,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import { BrandMark, BrandName } from '../components/BrandMark'

const REDIRECT_SECONDS = 6

const departments = [
  {
    id: 'ems',
    to: '/dashboard/ems',
    name: 'ศูนย์ EMS',
    full: 'รับแจ้งเหตุและส่งต่อผู้ป่วยฉุกเฉิน',
    stat: '2 เคส',
    statLabel: 'กำลังดำเนินการ',
    icon: Ambulance,
    accent: 'text-danger-200 bg-danger-600/15 ring-danger-500/20',
    bar: 'bg-danger-500',
    load: 72,
  },
  {
    id: 'pharmacy',
    to: '/dashboard/pharmacy',
    name: 'เภสัชกรรม',
    full: 'จ่ายยา ตรวจสอบคำสั่งใช้ยา และคลังยา',
    stat: '34',
    statLabel: 'ใบสั่งยารอจ่าย',
    icon: Pill,
    accent: 'text-brand-200 bg-brand-500/15 ring-brand-400/20',
    bar: 'bg-brand-400',
    load: 58,
  },
  {
    id: 'medicine',
    to: '/dashboard/medicine',
    name: 'เวชกรรม',
    full: 'ดูแลผู้ป่วยในและติดตามผลการรักษา',
    stat: '84 ราย',
    statLabel: 'ผู้ป่วยในความดูแล',
    icon: Stethoscope,
    accent: 'text-emerald-200 bg-emerald-500/15 ring-emerald-400/20',
    bar: 'bg-emerald-400',
    load: 89,
  },
]

const previewBars = [38, 52, 44, 68, 78, 64, 56]

export default function Landing() {
  const navigate = useNavigate()
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    if (secondsLeft <= 0) {
      navigate('/dashboard', { replace: true })
      return
    }
    const timer = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [secondsLeft, paused, navigate])

  const progress = paused ? 0 : ((REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS) * 100

  return (
    <div className="relative min-h-dvh overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-32 -top-40 size-[560px] rounded-full bg-brand-600/25 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-48 -left-32 size-[520px] rounded-full bg-danger-700/20 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <BrandMark />
          <BrandName onDark />
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-medium text-white/60 sm:inline-flex">
            <ShieldCheck className="size-3.5 text-emerald-300" />
            สำหรับบุคลากรทางการแพทย์
          </span>
          <a
            href="tel:1669"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-[11px] font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <Phone className="size-3.5 text-danger-300" />
            สายด่วน 1669
          </a>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 pt-4 sm:px-8 sm:pt-8 lg:pt-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold text-white/65">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 animate-soft-pulse" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
              </span>
              ศูนย์ปฏิบัติการโรงพยาบาล · ระบบทำงานปกติ
            </span>

            <h1 className="mt-5 text-balance text-[38px] font-bold leading-[1.12] tracking-tight sm:text-[52px] lg:text-[56px]">
              ทุกเคส ทุกแผนก
              <br />
              อยู่ใน
              <span className="relative whitespace-nowrap text-brand-200">
                ภาพเดียว
                <svg
                  className="absolute -bottom-2 left-0 h-2.5 w-full text-danger-500"
                  viewBox="0 0 200 10"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M2 7c42-4 90-5 196-2" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/55 sm:text-base">
              แดชบอร์ดสำหรับทีม <span className="font-semibold text-white/80">EMS เภสัชกรรม และเวชกรรม</span>{' '}
              เห็นสถานะผู้ป่วย ทรัพยากร และงานที่ต้องทำได้ทันที ในหน้าจอเดียวที่อ่านง่าย
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="group inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-white px-5 py-3 text-sm font-bold text-ink-950 shadow-float transition hover:bg-brand-50 focus-visible:outline-white"
              >
                เข้าสู่แดชบอร์ด
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('departments')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/75 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
              >
                ดูภาพรวมแต่ละแผนก
              </button>
            </div>

            <div className="mt-7 max-w-md">
              {paused ? (
                <div className="flex items-center gap-2 text-[11px] text-white/45">
                  <Clock className="size-3.5" />
                  หยุดการเปลี่ยนหน้าอัตโนมัติแล้ว — เลือกเข้าสู่แดชบอร์ดได้ทุกเมื่อ
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4 text-[11px] text-white/45">
                    <span>กำลังพาเข้าสู่แดชบอร์ดใน {secondsLeft} วินาที</span>
                    <button
                      type="button"
                      onClick={() => setPaused(true)}
                      className="cursor-pointer rounded-md px-1.5 py-0.5 font-semibold text-white/60 underline decoration-white/20 underline-offset-2 transition hover:text-white"
                    >
                      หยุด
                    </button>
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-200 transition-[width] duration-1000 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:150ms]">
            <div className="mx-auto w-full max-w-[460px] rounded-[26px] border border-white/10 bg-white/[0.06] p-2 shadow-float backdrop-blur-xl">
              <div className="rounded-[20px] bg-ink-950/70 p-5 ring-1 ring-white/[0.06] sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">ภาพรวมวันนี้</p>
                    <p className="mt-1 text-lg font-bold tracking-tight text-white">ศูนย์ควบคุมโรงพยาบาล</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-400/20">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    LIVE
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2.5">
                  {[
                    { value: '248', label: 'ผู้ป่วยใน', tone: 'text-white' },
                    { value: '2', label: 'EMS กำลังออกเหตุ', tone: 'text-danger-300' },
                    { value: '34', label: 'รอจ่ายยา', tone: 'text-brand-200' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-3">
                      <p className={`text-xl font-bold leading-none tracking-tight ${item.tone}`}>{item.value}</p>
                      <p className="mt-1.5 text-[9.5px] font-medium leading-tight text-white/40">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-white/55">ผู้ป่วยรับใหม่ 7 วัน</p>
                    <p className="text-[10px] font-semibold text-emerald-300">+8.4%</p>
                  </div>
                  <div className="mt-3 flex h-[74px] items-end gap-1.5" aria-hidden="true">
                    {previewBars.map((height, index) => (
                      <div
                        key={index}
                        className={`flex-1 rounded-t-[3px] ${
                          index === previewBars.length - 2 ? 'bg-danger-400/80' : 'bg-brand-400/65'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-[9px] font-medium text-white/25">
                    <span>จ.</span>
                    <span>อ.</span>
                    <span>พ.</span>
                    <span>พฤ.</span>
                    <span>ศ.</span>
                    <span>ส.</span>
                    <span>อา.</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  {departments.map((dept) => (
                    <div key={dept.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                      <span className={`grid size-7 place-items-center rounded-lg ring-1 ${dept.accent}`}>
                        <dept.icon className="size-3.5" strokeWidth={2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-white/70">{dept.name}</span>
                          <span className="text-[10px] font-bold text-white/40">{dept.load}%</span>
                        </span>
                        <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-white/10">
                          <span className={`block h-full rounded-full ${dept.bar}`} style={{ width: `${dept.load}%` }} />
                        </span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3 text-[9.5px] text-white/30">
                  <span className="inline-flex items-center gap-1.5">
                    <Activity className="size-3" />
                    อัปเดตล่าสุด 09:24
                  </span>
                  <span>Nisia HIS Core</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="departments" className="mt-14 scroll-mt-8 sm:mt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">แผนกหลัก</p>
              <h2 className="mt-1.5 text-lg font-bold tracking-tight text-white sm:text-xl">เลือกแผนกที่ต้องการดู</h2>
            </div>
            <p className="hidden text-[11px] text-white/30 sm:block">ข้อมูลตัวอย่างสำหรับสาธิตระบบ</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {departments.map((dept, index) => (
              <button
                key={dept.id}
                type="button"
                onClick={() => navigate(dept.to)}
                className="group animate-fade-up cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] sm:p-5"
                style={{ animationDelay: `${index * 70 + 200}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`grid size-10 place-items-center rounded-xl ring-1 ${dept.accent}`}>
                    <dept.icon className="size-5" strokeWidth={1.9} />
                  </span>
                  <span className="text-right">
                    <span className="block text-lg font-bold leading-none text-white">{dept.stat}</span>
                    <span className="mt-1 block text-[9.5px] text-white/35">{dept.statLabel}</span>
                  </span>
                </div>
                <p className="mt-4 flex items-center gap-1.5 text-sm font-bold text-white">
                  {dept.name}
                  <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/40">{dept.full}</p>
                <span className="mt-4 block h-1 overflow-hidden rounded-full bg-white/10">
                  <span className={`block h-full rounded-full ${dept.bar}`} style={{ width: `${dept.load}%` }} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-2 px-5 py-5 text-[10px] text-white/30 sm:flex-row sm:items-center sm:px-8">
          <p>© 2569 โรงพยาบาลนิเซีย · ระบบสารสนเทศภายในสำหรับบุคลากร</p>
          <p>Nisia Hospital Operations · Demo data only</p>
        </div>
      </footer>
    </div>
  )
}
