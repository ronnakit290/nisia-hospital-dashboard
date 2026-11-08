import type { Tone } from '../data/clinical'

export const tonePill: Record<Tone, string> = {
  red: 'pill-red',
  amber: 'pill-amber',
  green: 'pill-green',
  blue: 'pill-blue',
  slate: 'pill-slate',
}

export const toneDot: Record<Tone, string> = {
  red: 'bg-danger-500',
  amber: 'bg-warn-600',
  green: 'bg-success-600',
  blue: 'bg-brand-500',
  slate: 'bg-ink-300',
}

export const toneBar: Record<Tone, string> = {
  red: 'bg-danger-500',
  amber: 'bg-warn-600',
  green: 'bg-success-600',
  blue: 'bg-brand-500',
  slate: 'bg-ink-300',
}

export const toneChip: Record<Tone, string> = {
  red: 'bg-danger-50 text-danger-600 ring-danger-100',
  amber: 'bg-warn-50 text-warn-600 ring-warn-100',
  green: 'bg-success-50 text-success-600 ring-success-100',
  blue: 'bg-brand-50 text-brand-600 ring-brand-100',
  slate: 'bg-ink-50 text-ink-600 ring-line',
}

export const triageTone: Record<string, Tone> = {
  แดง: 'red',
  ส้ม: 'amber',
  เหลือง: 'amber',
  เขียว: 'green',
}

export const statusTone: Record<string, Tone> = {
  // EMS calls
  กำลังนำส่ง: 'red',
  ออกเหตุแล้ว: 'amber',
  รอรับแจ้ง: 'blue',
  ปิดเคส: 'green',
  // Ambulances
  พร้อมปฏิบัติการ: 'green',
  ออกเหตุ: 'red',
  ซ่อมบำรุง: 'slate',
  // Prescriptions
  รอจ่าย: 'amber',
  กำลังจัดยา: 'blue',
  รอตรวจสอบ: 'red',
  จ่ายแล้ว: 'green',
  // Patients
  วิกฤต: 'red',
  เฝ้าระวัง: 'amber',
  คงที่: 'green',
  รอจำหน่าย: 'blue',
}

export function percent(value: number, total: number) {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('th-TH').format(value)
}
