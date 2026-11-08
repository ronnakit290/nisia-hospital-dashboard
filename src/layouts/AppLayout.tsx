import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Ambulance,
  Bell,
  ChevronRight,
  LayoutDashboard,
  Menu,
  Phone,
  Pill,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { BrandMark, BrandName } from '../components/BrandMark'

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  badge?: string
  hint: string
  keywords: string
}

const navItems: NavItem[] = [
  {
    to: '/dashboard',
    label: 'ภาพรวม',
    icon: LayoutDashboard,
    end: true,
    hint: 'ภาพรวมทุกแผนก',
    keywords: 'overview dashboard ภาพรวม',
  },
  {
    to: '/dashboard/ems',
    label: 'ศูนย์ EMS',
    icon: Ambulance,
    badge: '2',
    hint: '2 เคสกำลังดำเนินการ',
    keywords: 'ems ambulance ฉุกเฉิน รถพยาบาล',
  },
  {
    to: '/dashboard/pharmacy',
    label: 'เภสัชกรรม',
    icon: Pill,
    hint: 'ใบสั่งยารอจ่าย 34 รายการ',
    keywords: 'pharmacy เภสัช ยา ใบสั่งยา',
  },
  {
    to: '/dashboard/medicine',
    label: 'เวชกรรม',
    icon: Stethoscope,
    hint: 'ผู้ป่วยใน 84 ราย',
    keywords: 'medicine ward อายุรกรรม เวชกรรม ผู้ป่วย',
  },
]

const quickFindExtras = [
  {
    to: '/dashboard/medicine',
    label: 'ผู้ป่วยเตียง 312 · นายวิชัย มั่นคง',
    hint: 'วิกฤต · ภาวะหัวใจล้มเหลว',
    icon: UserRound,
    keywords: '312 วิชัย ผู้ป่วย หัวใจ',
  },
  {
    to: '/dashboard/medicine',
    label: 'ผู้ป่วยเตียง 301 · นายสมชาย ใจดี',
    hint: 'เฝ้าระวัง · ปอดอักเสบ',
    icon: UserRound,
    keywords: '301 สมชาย ปอด',
  },
  {
    to: '/dashboard/pharmacy',
    label: 'ใบสั่งยา RX-4821',
    hint: 'ด่วน · รอจ่าย',
    icon: Pill,
    keywords: 'rx-4821 ใบสั่งยา ด่วน',
  },
]

const notifications = [
  {
    id: 'n1',
    tone: 'bg-danger-500',
    title: 'ผู้ป่วยวิกฤตใหม่ · เตียง 312',
    detail: 'SpO₂ 91% ต้องติดตามใกล้ชิด',
    time: '2 นาที',
    to: '/dashboard/medicine',
  },
  {
    id: 'n2',
    tone: 'bg-warn-600',
    title: 'Enoxaparin ต่ำกว่าจุดสั่งซื้อ',
    detail: 'คงเหลือ 18 หลอด · ต้องสั่งเพิ่ม',
    time: '12 นาที',
    to: '/dashboard/pharmacy',
  },
  {
    id: 'n3',
    tone: 'bg-brand-500',
    title: 'ผลแลป Troponin I พร้อมอ่าน',
    detail: 'นายวิชัย มั่นคง · ระดับด่วน',
    time: '21 นาที',
    to: '/dashboard/medicine',
  },
]

// The demo dataset is a fixed 09:24 morning snapshot, so the header clock is
// pinned to the same time to keep every timestamp on screen consistent.
const DEMO_TIME = '09:24'

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink-950/50 backdrop-blur-[2px] transition-opacity print:hidden lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col overflow-hidden bg-ink-950 text-white transition-transform duration-300 ease-out print:hidden lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="เมนูหลัก"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-brand-600/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 size-56 rounded-full bg-danger-600/10 blur-3xl" aria-hidden="true" />

        <div className="relative flex items-center gap-3 px-5 pb-5 pt-5">
          <BrandMark />
          <BrandName onDark />
          <button type="button" onClick={onClose} className="ml-auto grid size-8 cursor-pointer place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white lg:hidden" aria-label="ปิดเมนู">
            <X className="size-4.5" />
          </button>
        </div>

        <nav className="relative flex-1 overflow-y-auto px-3 pb-4 scroll-thin" aria-label="เมนูแดชบอร์ด">
          <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
            ศูนย์ควบคุมโรงพยาบาล
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition ${
                      isActive
                        ? 'bg-white/[0.11] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                        : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`grid size-8 place-items-center rounded-lg transition ${
                          isActive ? 'bg-brand-500 text-white' : 'bg-white/[0.06] text-white/55 group-hover:text-white'
                        }`}
                      >
                        <item.icon className="size-4" strokeWidth={1.9} />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge ? (
                        <span className="grid min-w-5 place-items-center rounded-full bg-danger-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      ) : isActive ? (
                        <ChevronRight className="size-3.5 text-white/40" aria-hidden="true" />
                      ) : null}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-danger-600/90 text-white">
                <Phone className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">สายด่วนฉุกเฉิน</p>
                <a href="tel:1669" className="text-base font-bold tracking-wide text-white hover:text-danger-200">
                  1669
                </a>
              </div>
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-white/40">
              ศูนย์รับแจ้งเหตุฉุกเฉิน 24 ชั่วโมง
            </p>
          </div>
        </nav>

        <div className="relative border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-2 text-[11px] font-medium text-white/55">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-success-600 opacity-70 animate-soft-pulse" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            ระบบทำงานปกติ
            <ShieldCheck className="ml-auto size-3.5 text-white/30" aria-hidden="true" />
          </div>
          <p className="mt-1 text-[10px] text-white/25">HIS Core v4.2 · อัปเดตล่าสุด 09:24</p>
        </div>
      </aside>
    </>
  )
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [readNotifications, setReadNotifications] = useState<string[]>([])
  const searchRef = useRef<HTMLInputElement>(null)
  const mobileSearchRef = useRef<HTMLInputElement>(null)
  const searchWrapRef = useRef<HTMLDivElement>(null)
  const mobileSearchWrapRef = useRef<HTMLDivElement>(null)
  const notifWrapRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  const current = navItems.find((item) => item.to === location.pathname) ?? navItems[0]
  const unreadCount = notifications.filter((item) => !readNotifications.includes(item.id)).length
  const dateLabel = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      const insideDesktopSearch = searchWrapRef.current?.contains(target)
      const insideMobileSearch = mobileSearchWrapRef.current?.contains(target)
      if (!insideDesktopSearch && !insideMobileSearch) {
        setSearchOpen(false)
        setMobileSearchOpen(false)
      }
      if (notifWrapRef.current && !notifWrapRef.current.contains(target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable
      if (event.key === '/' && !typing) {
        event.preventDefault()
        setSearchOpen(true)
        setNotifOpen(false)
        if (window.matchMedia('(min-width: 768px)').matches) {
          searchRef.current?.focus()
        } else {
          setMobileSearchOpen(true)
          window.setTimeout(() => mobileSearchRef.current?.focus(), 0)
        }
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setNotifOpen(false)
        setMobileSearchOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const quickItems = [...navItems, ...quickFindExtras].filter((item) => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return true
    return `${item.label} ${item.hint} ${item.keywords}`.toLowerCase().includes(query)
  })

  function goTo(to: string) {
    navigate(to)
    setSearchOpen(false)
    setSearchQuery('')
    setMobileSearchOpen(false)
    setNotifOpen(false)
  }

  return (
    <div className="min-h-dvh bg-canvas">
      <a
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById('main-content')?.focus()
        }}
        className="fixed left-3 top-3 z-[60] -translate-y-20 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink-900 shadow-float transition focus:translate-y-0"
      >
        ข้ามไปยังเนื้อหาหลัก
      </a>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="print:pl-0 lg:pl-[264px]">
        <header className="sticky top-0 z-30 border-b border-line/80 bg-white/88 backdrop-blur-md print:hidden">
          <div className="flex h-16 items-center gap-2 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="icon-btn -ml-1 lg:hidden"
              aria-label="เปิดเมนู"
              aria-expanded={sidebarOpen}
            >
              <Menu className="size-5" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-400">
                <span className="hidden sm:inline">ศูนย์ควบคุม</span>
                <ChevronRight className="hidden size-3 sm:inline" aria-hidden="true" />
                <span className="text-ink-700">{current.label}</span>
              </div>
              <p className="mt-0.5 hidden text-[11px] text-ink-400 sm:block">
                {dateLabel} · กะเช้า 08:00–16:00
              </p>
            </div>

            <div className="hidden items-center gap-1.5 rounded-xl border border-line bg-ink-50/60 px-3 py-2 text-xs font-semibold text-ink-600 xl:flex">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full rounded-full bg-success-600 opacity-70 animate-soft-pulse" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              ระบบออนไลน์
              <span className="mx-1 h-3.5 w-px bg-line-strong" aria-hidden="true" />
              <span className="tabular-nums text-ink-800">{DEMO_TIME}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen((open) => !open)
                setSearchOpen(true)
                window.setTimeout(() => mobileSearchRef.current?.focus(), 0)
              }}
              className="icon-btn md:hidden"
              aria-label="ค้นหา"
              aria-expanded={mobileSearchOpen}
            >
              <Search className="size-5" />
            </button>

            <div ref={searchWrapRef} className="relative hidden md:block">
              <label htmlFor="global-search" className="sr-only">
                ค้นหาผู้ป่วย แผนก หรือใบสั่งยา
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 transition focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100">
                <Search className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
                <input
                  id="global-search"
                  ref={searchRef}
                  type="search"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value)
                    setSearchOpen(true)
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="ค้นหาผู้ป่วย แผนก ยา…"
                  className="w-40 bg-transparent text-[13px] text-ink-800 placeholder:text-ink-400 focus:outline-none lg:w-52"
                  autoComplete="off"
                />
                <kbd className="hidden rounded border border-line bg-ink-50 px-1.5 py-0.5 text-[10px] font-semibold text-ink-400 lg:inline">
                  /
                </kbd>
              </div>

              {searchOpen ? (
                <div className="absolute right-0 top-full z-50 mt-2 w-[340px] overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-float">
                  <p className="px-2.5 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-400">
                    {searchQuery ? 'ผลการค้นหา' : 'ทางลัด'}
                  </p>
                  {quickItems.length ? (
                    <ul className="max-h-[320px] overflow-y-auto scroll-thin">
                      {quickItems.slice(0, 6).map((item) => (
                        <li key={`${item.to}-${item.label}`}>
                          <button
                            type="button"
                            onClick={() => goTo(item.to)}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-left transition hover:bg-ink-50"
                          >
                            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                              <item.icon className="size-4" strokeWidth={1.9} />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-[13px] font-semibold text-ink-800">{item.label}</span>
                              <span className="block truncate text-[11px] text-ink-400">{item.hint}</span>
                            </span>
                            <ChevronRight className="ml-auto size-3.5 shrink-0 text-ink-300" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-3 py-6 text-center text-xs text-ink-400">
                      ไม่พบผลลัพธ์สำหรับ “{searchQuery}”
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            <div ref={notifWrapRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((open) => !open)
                  setSearchOpen(false)
                }}
                className="icon-btn relative"
                aria-label={unreadCount ? `การแจ้งเตือน ${unreadCount} รายการใหม่` : 'การแจ้งเตือน'}
                aria-expanded={notifOpen}
              >
                <Bell className="size-5" />
                {unreadCount ? (
                  <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-danger-600 text-[9px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                ) : null}
              </button>

              {notifOpen ? (
                <div className="absolute right-0 top-full z-50 mt-2 w-[min(92vw,340px)] overflow-hidden rounded-2xl border border-line bg-white shadow-float">
                  <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <p className="text-sm font-bold text-ink-900">การแจ้งเตือน</p>
                    <button
                      type="button"
                      onClick={() => setReadNotifications(notifications.map((item) => item.id))}
                      className="cursor-pointer rounded-md px-1.5 py-1 text-[11px] font-semibold text-brand-600 hover:bg-brand-50"
                    >
                      อ่านทั้งหมด
                    </button>
                  </div>
                  <ul className="divide-y divide-line/70">
                    {notifications.map((item) => {
                      const isUnread = !readNotifications.includes(item.id)
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setReadNotifications((read) => [...read, item.id])
                              goTo(item.to)
                            }}
                            className={`flex w-full cursor-pointer gap-3 px-4 py-3 text-left transition hover:bg-ink-50 ${
                              isUnread ? 'bg-brand-50/30' : ''
                            }`}
                          >
                            <span className={`mt-1.5 size-2 shrink-0 rounded-full ${item.tone}`} aria-hidden="true" />
                            <span className="min-w-0">
                              <span className="block text-[13px] font-semibold leading-snug text-ink-800">{item.title}</span>
                              <span className="mt-0.5 block text-[11px] text-ink-400">{item.detail}</span>
                              <span className="mt-1 block text-[10px] font-medium text-ink-300">{item.time}</span>
                            </span>
                            {isUnread ? <span className="sr-only">ยังไม่ได้อ่าน</span> : null}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="ml-1 flex items-center gap-2.5 border-l border-line pl-2.5 sm:pl-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                ก
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-xs font-bold leading-tight text-ink-900">นพ. กิตติศักดิ์</span>
                <span className="mt-0.5 block truncate text-[10px] text-ink-400">อายุรแพทย์ · เวรเช้า</span>
              </span>
            </div>
          </div>

          {mobileSearchOpen ? (
            <div ref={mobileSearchWrapRef} className="border-t border-line/70 px-4 py-2 md:hidden">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                <input
                  ref={mobileSearchRef}
                  type="search"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value)
                    setSearchOpen(true)
                  }}
                  placeholder="ค้นหาผู้ป่วย แผนก ยา…"
                  className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  aria-label="ค้นหาผู้ป่วย แผนก หรือใบสั่งยา"
                  autoComplete="off"
                />
              </div>
              {searchOpen ? (
                <div className="mt-2 overflow-hidden rounded-xl border border-line bg-white p-1">
                  {quickItems.slice(0, 6).map((item) => (
                    <button
                      key={`${item.to}-${item.label}-m`}
                      type="button"
                      onClick={() => goTo(item.to)}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-ink-50"
                    >
                      <item.icon className="size-4 shrink-0 text-brand-600" strokeWidth={1.9} />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold text-ink-800">{item.label}</span>
                        <span className="block truncate text-[10px] text-ink-400">{item.hint}</span>
                      </span>
                    </button>
                  ))}
                  {quickItems.length === 0 ? (
                    <p className="px-3 py-5 text-center text-xs text-ink-400">ไม่พบผลลัพธ์</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1440px] px-4 py-5 outline-none print:max-w-none print:px-0 print:py-0 sm:px-6 lg:px-8 lg:py-7"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
