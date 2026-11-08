# โรงพยาบาลนิเซีย · ศูนย์ปฏิบัติการโรงพยาบาล

แดชบอร์ดสำหรับศูนย์ควบคุมโรงพยาบาล ครอบคลุม 3 แผนกหลัก — **EMS**, **เภสัชกรรม** และ **เวชกรรม** — พร้อมหน้า Landing Page ที่พาเข้าสู่แดชบอร์ดอัตโนมัติ

> ข้อมูลทั้งหมดเป็นข้อมูลตัวอย่างสำหรับสาธิตระบบ ไม่ใช่ข้อมูลผู้ป่วยจริง

## หน้าในระบบ

| เส้นทาง | หน้า |
| --- | --- |
| `/` | Landing Page (นับถอยหลัง 6 วินาทีแล้วพาเข้าสู่แดชบอร์ด) |
| `/#/dashboard` | ภาพรวมโรงพยาบาล |
| `/#/dashboard/ems` | ศูนย์รับแจ้งเหตุฉุกเฉิน (EMS) |
| `/#/dashboard/pharmacy` | งานเภสัชกรรม |
| `/#/dashboard/medicine` | กลุ่มงานอายุรกรรม |

## ฟีเจอร์

- ธีมน้ำเงิน แดง ขาว อ่านง่าย รองรับหน้าจอ 390px ถึง 1440px
- กราฟผู้ป่วยรับเข้า–จำหน่าย, คัดกรองผู้ป่วย, เวลาตอบสนอง EMS, การจ่ายยา และอัตราครองเตียง
- ค้นหาผู้ป่วย/แผนก/ใบสั่งยา จากแถบด้านบน (กด `/`)
- ตัวกรองสถานะ, ค้นหาในตาราง, ปุ่มจ่ายยาที่อัปเดตคิวจริง, รายละเอียดเคส EMS และข้อมูลผู้ป่วย
- รายการแบบการ์ดบนมือถือ, แถบเมนูแบบเลื่อนออก, รองรับ Escape และ keyboard focus
- พิมพ์รายงานได้จากทุกหน้า

## เทคโนโลยี

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- React Router (HashRouter — ทำงานบน GitHub Pages ได้โดยไม่ต้องตั้งค่า rewrite)
- Recharts + Lucide Icons
- Google Fonts: Figtree + Noto Sans Thai

## รันในเครื่อง

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

Push ไปที่ branch `main` — GitHub Actions (`.github/workflows/deploy.yml`) จะ build และเผยแพร่ขึ้น GitHub Pages อัตโนมัติ

เว็บไซต์: https://ronnakit290.github.io/nisia-hospital-dashboard/
