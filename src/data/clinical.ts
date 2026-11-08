export type Tone = 'red' | 'amber' | 'green' | 'blue' | 'slate'

export type Triage = 'แดง' | 'ส้ม' | 'เหลือง' | 'เขียว'

export type EmsCall = {
  id: string
  time: string
  triage: Triage
  type: string
  location: string
  unit: string
  status: 'รอรับแจ้ง' | 'ออกเหตุแล้ว' | 'กำลังนำส่ง' | 'ปิดเคส'
  eta: string
}

export type Ambulance = {
  id: string
  model: string
  level: string
  status: 'พร้อมปฏิบัติการ' | 'ออกเหตุ' | 'ซ่อมบำรุง'
  crew: string
  location: string
}

export type Prescription = {
  id: string
  patient: string
  ward: string
  items: number
  priority: 'ด่วน' | 'ปกติ'
  status: 'รอจ่าย' | 'กำลังจัดยา' | 'รอตรวจสอบ' | 'จ่ายแล้ว'
  waiting: number
}

export type StockItem = {
  name: string
  detail: string
  remaining: number
  minimum: number
  unit: string
}

export type InteractionAlert = {
  id: string
  drugs: string
  patient: string
  ward: string
  severity: 'สูง' | 'กลาง'
  note: string
}

export type Ward = {
  id: string
  name: string
  occupied: number
  beds: number
  nurse: string
}

export type Patient = {
  id: string
  bed: string
  name: string
  age: number
  diagnosis: string
  doctor: string
  status: 'วิกฤต' | 'เฝ้าระวัง' | 'คงที่' | 'รอจำหน่าย'
  round: string
  admitted: string
  allergies: string
  vitals: { label: string; value: string; unit: string; tone: Tone }[]
  note: string
}

export type LabResult = {
  id: string
  patient: string
  test: string
  collected: string
  priority: 'ด่วน' | 'ปกติ'
}

export const emsCalls: EmsCall[] = [
  {
    id: 'EMS-6801',
    time: '08:42',
    triage: 'แดง',
    type: 'หัวใจหยุดเต้น / หมดสติ',
    location: 'ถ.รัตนาธิเบศร์ หมู่ 4',
    unit: 'EMS-01',
    status: 'กำลังนำส่ง',
    eta: '6 นาที',
  },
  {
    id: 'EMS-6798',
    time: '08:21',
    triage: 'ส้ม',
    type: 'อุบัติเหตุจราจร แขนหัก',
    location: 'แยกบางพลู',
    unit: 'EMS-02',
    status: 'ออกเหตุแล้ว',
    eta: '3 นาที',
  },
  {
    id: 'EMS-6795',
    time: '07:58',
    triage: 'เหลือง',
    type: 'หายใจเหนื่อย ญาติแจ้งซึม',
    location: 'ซ.เทศบาล 8',
    unit: 'EMS-03',
    status: 'ปิดเคส',
    eta: '—',
  },
  {
    id: 'EMS-6804',
    time: '09:04',
    triage: 'แดง',
    type: 'แน่นหน้าอกเฉียบพลัน',
    location: 'หมู่บ้านนครทอง เฟส 2',
    unit: 'EMS-01',
    status: 'รอรับแจ้ง',
    eta: 'รอส่ง',
  },
  {
    id: 'EMS-6806',
    time: '09:16',
    triage: 'เขียว',
    type: 'ขอรถเคลื่อนย้ายผู้ป่วย',
    location: 'รพ.สต.บางรัก',
    unit: 'EMS-02',
    status: 'รอรับแจ้ง',
    eta: 'รอส่ง',
  },
]

export const ambulances: Ambulance[] = [
  {
    id: 'EMS-01',
    model: 'Toyota Hilux Revo',
    level: 'ALS · ช่วยชีวิตขั้นสูง',
    status: 'ออกเหตุ',
    crew: 'ทีม A · 3 คน',
    location: 'ถ.รัตนาธิเบศร์',
  },
  {
    id: 'EMS-02',
    model: 'Isuzu D-Max',
    level: 'ALS · ช่วยชีวิตขั้นสูง',
    status: 'พร้อมปฏิบัติการ',
    crew: 'ทีม B · 3 คน',
    location: 'จอดที่ฐาน EMS',
  },
  {
    id: 'EMS-03',
    model: 'Toyota Commuter',
    level: 'BLS · เคลื่อนย้าย',
    status: 'พร้อมปฏิบัติการ',
    crew: 'ทีม C · 2 คน',
    location: 'จอดที่ฐาน EMS',
  },
  {
    id: 'EMS-04',
    model: 'Hyundai H-1',
    level: 'BLS · เคลื่อนย้าย',
    status: 'ซ่อมบำรุง',
    crew: 'ไม่พร้อมใช้งาน',
    location: 'ศูนย์ซ่อมบำรุง',
  },
]

export const prescriptions: Prescription[] = [
  { id: 'RX-4821', patient: 'นายสมชาย ใจดี', ward: 'OPD · อายุรกรรม', items: 3, priority: 'ด่วน', status: 'รอจ่าย', waiting: 12 },
  { id: 'RX-4820', patient: 'นางมาลี ศรีสุข', ward: 'IPD · ชั้น 4', items: 5, priority: 'ปกติ', status: 'กำลังจัดยา', waiting: 9 },
  { id: 'RX-4818', patient: 'นายประเสริฐ พูลผล', ward: 'IPD · ชั้น 3', items: 2, priority: 'ด่วน', status: 'รอตรวจสอบ', waiting: 18 },
  { id: 'RX-4816', patient: 'นางสาวอรุณี ทองดี', ward: 'OPD · อายุรกรรม', items: 1, priority: 'ปกติ', status: 'รอจ่าย', waiting: 6 },
  { id: 'RX-4814', patient: 'นายวิชัย มั่นคง', ward: 'IPD · ชั้น 5', items: 4, priority: 'ปกติ', status: 'จ่ายแล้ว', waiting: 0 },
  { id: 'RX-4812', patient: 'นางบุญเรือน แก้วใส', ward: 'OPD · คลินิกพิเศษ', items: 2, priority: 'ปกติ', status: 'จ่ายแล้ว', waiting: 0 },
]

export const stockAlerts: StockItem[] = [
  { name: 'Paracetamol 500 mg', detail: 'ยาเม็ด · LOT P-2411', remaining: 120, minimum: 500, unit: 'เม็ด' },
  { name: 'Omeprazole 20 mg', detail: 'แคปซูล · LOT O-8832', remaining: 84, minimum: 300, unit: 'แคปซูล' },
  { name: 'Ceftriaxone 1 g', detail: 'ยาฉีด · LOT C-1190', remaining: 32, minimum: 120, unit: 'ขวด' },
  { name: 'NSS 0.9% 500 mL', detail: 'น้ำเกลือ · LOT N-5521', remaining: 96, minimum: 200, unit: 'ถุง' },
  { name: 'Enoxaparin 40 mg', detail: 'ยาฉีด · LOT E-3302', remaining: 18, minimum: 60, unit: 'หลอด' },
]

export const interactionAlerts: InteractionAlert[] = [
  {
    id: 'DDI-01',
    drugs: 'Warfarin + Aspirin',
    patient: 'นายประเสริฐ พูลผล',
    ward: 'อายุรกรรม ชั้น 3',
    severity: 'สูง',
    note: 'เพิ่มความเสี่ยงเลือดออก ควรตรวจ INR และยืนยันคำสั่งแพทย์ก่อนจ่าย',
  },
  {
    id: 'DDI-02',
    drugs: 'Simvastatin + Clarithromycin',
    patient: 'นางมาลี ศรีสุข',
    ward: 'อายุรกรรม ชั้น 4',
    severity: 'กลาง',
    note: 'เพิ่มระดับยาในเลือด อาจเกิดกล้ามเนื้ออักเสบ ควรติดตามอาการ',
  },
]

export const wards: Ward[] = [
  { id: 'W1', name: 'อายุรกรรมชาย 3', occupied: 24, beds: 30, nurse: 'พย. สุนิสา' },
  { id: 'W2', name: 'อายุรกรรมหญิง 4', occupied: 30, beds: 32, nurse: 'พย. กมลชนก' },
  { id: 'W3', name: 'หอผู้ป่วยพิเศษ 5', occupied: 22, beds: 24, nurse: 'พย. ชลิตา' },
  { id: 'W4', name: 'อายุรกรรมวิกฤต', occupied: 8, beds: 8, nurse: 'พย. ปวีณา' },
]

export const patients: Patient[] = [
  {
    id: 'HN-6721',
    bed: '301',
    name: 'นายสมชาย ใจดี',
    age: 67,
    diagnosis: 'ปอดอักเสบรุนแรง',
    doctor: 'นพ. กิตติศักดิ์',
    status: 'เฝ้าระวัง',
    round: '09:30',
    admitted: '6 พ.ย. 2569',
    allergies: 'เพนิซิลลิน',
    vitals: [
      { label: 'อุณหภูมิ', value: '38.4', unit: '°C', tone: 'red' },
      { label: 'ความดัน', value: '138/86', unit: 'mmHg', tone: 'amber' },
      { label: 'ชีพจร', value: '98', unit: 'bpm', tone: 'amber' },
      { label: 'SpO₂', value: '94', unit: '%', tone: 'green' },
    ],
    note: 'ให้ออกซิเจน 3 L/min ผ่าน nasal cannula ติดตาม SpO₂ ทุก 2 ชั่วโมง',
  },
  {
    id: 'HN-6648',
    bed: '305',
    name: 'นางมาลี ศรีสุข',
    age: 54,
    diagnosis: 'เบาหวานชนิดที่ 2',
    doctor: 'นพ. ปรีชา',
    status: 'คงที่',
    round: '10:00',
    admitted: '4 พ.ย. 2569',
    allergies: 'ไม่มี',
    vitals: [
      { label: 'น้ำตาลปลายนิ้ว', value: '132', unit: 'mg/dL', tone: 'green' },
      { label: 'ความดัน', value: '124/78', unit: 'mmHg', tone: 'green' },
      { label: 'ชีพจร', value: '76', unit: 'bpm', tone: 'green' },
      { label: 'SpO₂', value: '99', unit: '%', tone: 'green' },
    ],
    note: 'ควบคุมอาหารและติดตามระดับน้ำตาลก่อนอาหารเช้า–เย็น',
  },
  {
    id: 'HN-6803',
    bed: '312',
    name: 'นายวิชัย มั่นคง',
    age: 72,
    diagnosis: 'ภาวะหัวใจล้มเหลว',
    doctor: 'นพ. กิตติศักดิ์',
    status: 'วิกฤต',
    round: '08:45',
    admitted: '7 พ.ย. 2569',
    allergies: 'ซัลฟา',
    vitals: [
      { label: 'ความดัน', value: '86/54', unit: 'mmHg', tone: 'red' },
      { label: 'ชีพจร', value: '112', unit: 'bpm', tone: 'red' },
      { label: 'SpO₂', value: '91', unit: '%', tone: 'red' },
      { label: 'หายใจ', value: '26', unit: '/นาที', tone: 'amber' },
    ],
    note: 'ติดตามสัญญาณชีพทุก 1 ชั่วโมง บันทึก intake–output และแจ้งแพทย์เมื่อความดันต่ำกว่า 90/60',
  },
  {
    id: 'HN-6590',
    bed: '405',
    name: 'นางสาวอรุณี ทองดี',
    age: 38,
    diagnosis: 'ไตวายเฉียบพลัน',
    doctor: 'นพ. ธีรวัฒน์',
    status: 'เฝ้าระวัง',
    round: '10:30',
    admitted: '5 พ.ย. 2569',
    allergies: 'NSAIDs',
    vitals: [
      { label: 'ความดัน', value: '146/92', unit: 'mmHg', tone: 'amber' },
      { label: 'ชีพจร', value: '88', unit: 'bpm', tone: 'green' },
      { label: 'BUN', value: '42', unit: 'mg/dL', tone: 'amber' },
      { label: 'Creatinine', value: '2.4', unit: 'mg/dL', tone: 'red' },
    ],
    note: 'จำกัดน้ำ 1,500 mL/วัน รอผลไตซ้ำและประเมินการฟอกเลือด',
  },
  {
    id: 'HN-6710',
    bed: '410',
    name: 'นายบุญมี ทองสุข',
    age: 61,
    diagnosis: 'ตับแข็งจากสุรา',
    doctor: 'นพ. ปรีชา',
    status: 'คงที่',
    round: '11:00',
    admitted: '6 พ.ย. 2569',
    allergies: 'ไม่มี',
    vitals: [
      { label: 'อุณหภูมิ', value: '37.1', unit: '°C', tone: 'green' },
      { label: 'ความดัน', value: '118/72', unit: 'mmHg', tone: 'green' },
      { label: 'ชีพจร', value: '82', unit: 'bpm', tone: 'green' },
      { label: 'SpO₂', value: '97', unit: '%', tone: 'green' },
    ],
    note: 'งดแอลกอฮอล์ ให้วิตามินบีรวม และติดตามอาการบวมท้อง',
  },
  {
    id: 'HN-6835',
    bed: '508',
    name: 'นางบุญเรือน แก้วใส',
    age: 70,
    diagnosis: 'ติดเชื้อทางเดินปัสสาวะ',
    doctor: 'นพ. ธีรวัฒน์',
    status: 'รอจำหน่าย',
    round: '09:00',
    admitted: '3 พ.ย. 2569',
    allergies: 'เพนิซิลลิน',
    vitals: [
      { label: 'อุณหภูมิ', value: '36.8', unit: '°C', tone: 'green' },
      { label: 'ความดัน', value: '126/74', unit: 'mmHg', tone: 'green' },
      { label: 'ชีพจร', value: '78', unit: 'bpm', tone: 'green' },
      { label: 'SpO₂', value: '98', unit: '%', tone: 'green' },
    ],
    note: 'ครบกำหนดยาปฏิชีวนะ เตรียมเอกสารและนัดติดตามที่ OPD อายุรกรรม',
  },
]

export const labResults: LabResult[] = [
  { id: 'LB-9012', patient: 'นายวิชัย มั่นคง', test: 'Troponin I', collected: '08:30', priority: 'ด่วน' },
  { id: 'LB-9009', patient: 'นางสาวอรุณี ทองดี', test: 'BUN / Creatinine', collected: '08:10', priority: 'ด่วน' },
  { id: 'LB-9007', patient: 'นายสมชาย ใจดี', test: 'CBC', collected: '07:55', priority: 'ปกติ' },
  { id: 'LB-9004', patient: 'นางมาลี ศรีสุข', test: 'HbA1c', collected: '07:30', priority: 'ปกติ' },
  { id: 'LB-9001', patient: 'นายบุญมี ทองสุข', test: 'Liver function', collected: '07:15', priority: 'ปกติ' },
]

export const activityFeed = [
  { time: '08:52', title: 'EMS-01 รับผู้ป่วยวิกฤตจากถ.รัตนาธิเบศร์', meta: 'นำส่งห้องฉุกเฉิน · ทีม A', tone: 'red' as Tone },
  { time: '08:40', title: 'เภสัชกรรมจ่ายยาใบสั่ง RX-4812 สำเร็จ', meta: 'นางบุญเรือน แก้วใส · OPD พิเศษ', tone: 'green' as Tone },
  { time: '08:25', title: 'อายุรกรรมรับผู้ป่วยใหม่เข้าหอผู้ป่วย 4', meta: 'เตียง 405 · เฝ้าระวังภาวะไต', tone: 'blue' as Tone },
  { time: '08:05', title: 'EMS-03 กลับถึงฐานหลังปิดเคส', meta: 'ใช้เวลาปฏิบัติการ 42 นาที', tone: 'slate' as Tone },
  { time: '07:48', title: 'คลังยาแจ้งเตือน Enoxaparin ต่ำกว่าจุดสั่งซื้อ', meta: 'คงเหลือ 18 หลอด · ต้องสั่งเพิ่ม', tone: 'amber' as Tone },
]

export const staffOnDuty = [
  { name: 'นพ. กิตติศักดิ์', role: 'อายุรแพทย์', initials: 'ก', color: '#2F6BEA' },
  { name: 'พย. สุนิสา', role: 'หัวหน้าเวร', initials: 'ส', color: '#0E9F6E' },
  { name: 'ภก. ณัฐพล', role: 'เภสัชกร', initials: 'ณ', color: '#7C3AED' },
  { name: 'พย. กมลชนก', role: 'พยาบาล', initials: 'ก', color: '#D92D3C' },
  { name: 'นพ. ธีรวัฒน์', role: 'อายุรแพทย์', initials: 'ธ', color: '#C2740B' },
]

export const admissions7d = [
  { day: 'จ.', admitted: 212, discharged: 194 },
  { day: 'อ.', admitted: 236, discharged: 205 },
  { day: 'พ.', admitted: 198, discharged: 210 },
  { day: 'พฤ.', admitted: 258, discharged: 228 },
  { day: 'ศ.', admitted: 274, discharged: 246 },
  { day: 'ส.', admitted: 248, discharged: 232 },
  { day: 'อา.', admitted: 226, discharged: 238 },
]

export const admissions30d = Array.from({ length: 30 }, (_, index) => {
  const day = index + 1
  return {
    day: String(day),
    admitted: 190 + ((day * 17) % 86),
    discharged: 178 + ((day * 13) % 74),
  }
})

export const triageBreakdown = [
  { name: 'แดง · วิกฤต', value: 3, color: '#D92D3C' },
  { name: 'ส้ม · เร่งด่วน', value: 5, color: '#EA580C' },
  { name: 'เหลือง · เฝ้าระวัง', value: 8, color: '#D9A406' },
  { name: 'เขียว · ไม่เร่งด่วน', value: 14, color: '#0E9F6E' },
]

export const responseTimes = [
  { hour: '00:00', minutes: 6.2 },
  { hour: '03:00', minutes: 5.6 },
  { hour: '06:00', minutes: 6.8 },
  { hour: '09:00', minutes: 8.4 },
  { hour: '12:00', minutes: 10.6 },
  { hour: '15:00', minutes: 9.1 },
  { hour: '18:00', minutes: 7.4 },
  { hour: '21:00', minutes: 6.1 },
]

export const dispense7d = [
  { day: 'จ.', count: 168 },
  { day: 'อ.', count: 184 },
  { day: 'พ.', count: 172 },
  { day: 'พฤ.', count: 196 },
  { day: 'ศ.', count: 212 },
  { day: 'ส.', count: 154 },
  { day: 'อา.', count: 143 },
]

export const wardOccupancy7d = [
  { day: 'จ.', occupancy: 84 },
  { day: 'อ.', occupancy: 87 },
  { day: 'พ.', occupancy: 82 },
  { day: 'พฤ.', occupancy: 89 },
  { day: 'ศ.', occupancy: 91 },
  { day: 'ส.', occupancy: 88 },
  { day: 'อา.', occupancy: 89 },
]

export const rounds = [
  { time: '07:30', title: 'รับเวรและตรวจสอบผู้ป่วยวิกฤต', meta: 'พยาบาลเวรเช้า · หอผู้ป่วย 3–5', state: 'done' },
  { time: '09:30', title: 'ตรวจเยี่ยมผู้ป่วย (Ward Round)', meta: 'นพ. กิตติศักดิ์ · ชั้น 3', state: 'active' },
  { time: '11:00', title: 'ประชุมปรึกษาเคสอายุรกรรม', meta: 'ห้องประชุมอายุรกรรม · 7 เคส', state: 'next' },
  { time: '13:00', title: 'ทบทวนผลแลปและปรับแผนการรักษา', meta: 'ทีมแพทย์ · หอผู้ป่วย 4–5', state: 'next' },
  { time: '15:30', title: 'ส่งเวรรอบบ่าย', meta: 'พยาบาลเวรบ่าย · ทุกหอผู้ป่วย', state: 'next' },
]

export const departmentStatus = [
  { id: 'ems', name: 'ศูนย์รับแจ้งเหตุฉุกเฉิน', short: 'EMS', load: 72, detail: '2 เคสกำลังดำเนินการ', tone: 'red' as Tone },
  { id: 'pharmacy', name: 'งานเภสัชกรรม', short: 'เภสัชกรรม', load: 58, detail: '34 ใบสั่งยารอดำเนินการ', tone: 'amber' as Tone },
  { id: 'medicine', name: 'กลุ่มงานอายุรกรรม', short: 'เวชกรรม', load: 89, detail: 'เตียงว่าง 10 จาก 94 เตียง', tone: 'blue' as Tone },
]
