<img src="public/logo.svg" alt="SrikanaGo Logo" width="72" />

# SrikanaGo — UI Prototype

**Sistem Informasi Terpadu Sentra Kuliner SWK Srikana Food Walk, Universitas Airlangga**

Frontend prototype interaktif yang mengimplementasikan **11 modul** Mata Kuliah Workshop Pengembangan Perangkat Lunak WEB (Framework) — DIV Teknik Informatika, UNAIR — dalam satu skenario nyata berbasis studi kasus kawasan kuliner kampus.

[![Netlify Status](https://api.netlify.com/api/v1/badges/placeholder/deploy-status)](https://srikanago.netlify.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)

---

## Live Demo

**[https://srikanago.netlify.app](https://srikanago.netlify.app)**

> Semua 25 halaman dapat diakses langsung via URL tanpa login. Tidak ada validasi session.

---

## Tentang Proyek

SWK Srikana Food Walk adalah sentra kuliner populer di kawasan Kampus UNAIR Surabaya. **SrikanaGo** hadir sebagai platform web terpadu yang menyatukan:

- Pemesanan makanan multi-tenant dalam satu antarmuka
- Pembayaran online (Virtual Account & QRIS) dan kartu NFC cashless tap-to-pay
- Antrian real-time berbasis Server-Sent Events + pengumuman suara (Web Speech API)
- Verifikasi lokasi dengan Geolocation API dan formula Haversine
- Laporan dan settlement terpusat untuk pengelola kawasan

### Peran Pengguna

| Peran | Deskripsi |
|---|---|
| **Customer** | Memesan menu, membayar, memantau antrian, kelola profil & kartu NFC |
| **Tenant** | Mengelola menu, kasir POS, menerima pesanan lunas, memanggil antrian, cetak tag harga |
| **Pengelola** | Mengawasi seluruh tenant, kelola kartu NFC, laporan & settlement kawasan |
| **Papan Antrian** | Layar publik kawasan — menampilkan nomor & suara panggilan otomatis |

---

## Tech Stack

| Teknologi | Versi | Kegunaan |
|---|---|---|
| [React](https://react.dev) | 19 | UI library utama |
| [Vite](https://vite.dev) | 8 | Build tool & dev server |
| [React Router DOM](https://reactrouter.com) | 7 | Client-side routing (25 halaman) |
| [Axios](https://axios-http.com) | 1.18 | HTTP client (simulasi AJAX — Modul 5) |
| [qrcode.react](https://github.com/zpao/qrcode.react) | 4.2 | Generate QR Code pesanan (Modul 7) |
| [JsBarcode](https://github.com/lindell/JsBarcode) | 3.12 | Generate barcode tag harga (Modul 7) |
| [html5-qrcode](https://github.com/mebjas/html5-qrcode) | 2.3 | Scanner QR & barcode (Modul 8) |
| [Recharts](https://recharts.org) | 3.9 | Bar chart dashboard pengelola |
| **CSS Plain** | — | Styling tanpa framework CSS, custom properties |
| [Boxicons](https://boxicons.com) | 2.1.4 | Icon library (via CDN `<link>`) |
| [Poppins](https://fonts.google.com/specimen/Poppins) | — | Font utama (Google Fonts) |
| **Web APIs** | — | Geolocation · MediaDevices · NDEFReader · EventSource · SpeechSynthesis |

---

## Pemetaan 11 Modul

| Modul | Nama Resmi | Halaman |
|---|---|---|
| M1 | Layouting dan Laravel Login | H03, H13, H20 |
| M2 | Login Berbasis Google dan PDF Generator | H01, H02, H08, H19, H24 |
| M3 | Tag Harga dengan Kertas TnJ | H14, H15 |
| M4 | Javascript dan jQuery HTML DOM | H14, H16, H21 |
| M5 | AJAX jQuery dan Axios | H05, H06, H07, H16 |
| M6 | Payment Gateway | H04, H05, H07, H17 |
| M7 | Barcode, QRcode dan Akses Kamera | H10, H15 |
| M8 | Barcode dan QRcode Reader | H18 |
| M9 | Geolocation | H12, H21, H23 |
| M10 | Server-Sent Events — Sistem Antrian Real-Time | H09, H17, H25 |
| M11 | Web NFC API | H07, H11, H22 |

---

## Daftar 25 Halaman

### Autentikasi

| # | Halaman | Route | Modul |
|---|---|---|---|
| H01 | Login | `/login` | M1, M2 |
| H02 | Verifikasi OTP | `/otp` | M2 |

### Customer

| # | Halaman | Route | Modul |
|---|---|---|---|
| H03 | Beranda | `/beranda` | M1 |
| H04 | Katalog Tenant | `/tenant` | M1, M6 |
| H05 | Detail Tenant & Menu | `/tenant/:id` | M5, M6 |
| H06 | Keranjang | `/cart` | M4, M5 |
| H07 | Checkout & Metode Bayar | `/checkout` | M5, M11 |
| H08 | Konfirmasi Pesanan (Struk + QR + Antrian) | `/order/:id/confirm` | M2, M7, M10 |
| H09 | Status Antrian Real-Time | `/antrian` | M10 |
| H10 | Profil Customer | `/profil` | M4, M7 |
| H11 | Kartu Cashless NFC | `/kartu-nfc` | M11 |
| H12 | Verifikasi Lokasi (Check-in) | `/verifikasi-lokasi` | M9 |

### Panel Tenant

| # | Halaman | Route | Modul |
|---|---|---|---|
| H13 | Dashboard Tenant | `/tenant-panel/dashboard` | M1 |
| H14 | CRUD Menu (DataTables + Auto ID) | `/tenant-panel/menu` | M3, M4 |
| H15 | Cetak Tag Harga (Grid TnJ No.108) | `/tenant-panel/cetak-tag` | M3, M7 |
| H16 | Kasir / POS On-site | `/tenant-panel/kasir` | M4, M5 |
| H17 | Pesanan Lunas & Panel Antrian | `/tenant-panel/pesanan` | M6, M10 |
| H18 | Scan QR Pengambilan | `/tenant-panel/scan-qr` | M8 |
| H19 | Laporan Penjualan Tenant | `/tenant-panel/laporan` | M2 |

### Panel Pengelola

| # | Halaman | Route | Modul |
|---|---|---|---|
| H20 | Dashboard Pengelola Kawasan | `/pengelola/dashboard` | M1 |
| H21 | Kelola Tenant | `/pengelola/tenant` | M1, M9 |
| H22 | Kelola Kartu NFC | `/pengelola/kartu-nfc` | M11 |
| H23 | Pengaturan Geofence | `/pengelola/geofence` | M9 |
| H24 | Laporan & Settlement Kawasan | `/pengelola/laporan` | M2 |

### Publik

| # | Halaman | Route | Modul |
|---|---|---|---|
| H25 | Papan Antrian Publik | `/papan-antrian` | M10 |

---

## Fitur Web API Browser

| API | Halaman | Keterangan |
|---|---|---|
| `Geolocation.getCurrentPosition()` | H12, H21, H23 | Ambil posisi GPS, kalkulasi jarak Haversine |
| `MediaDevices.getUserMedia()` | H10 | Live preview kamera, capture foto ke canvas |
| `canvas.drawImage()` | H10 | Capture frame video → gambar (dua varian: blob & file path) |
| `NDEFReader` (Web NFC) | H11, H22 | Baca serial kartu NFC; fallback simulasi di non-Android |
| `EventSource` (SSE) | H09, H17, H25 | Menerima push antrian real-time dari server |
| `SpeechSynthesis` (Web Speech) | H25 | Pengumuman suara nomor antrian bahasa Indonesia |

> **Web NFC** hanya tersedia di **Android Chrome ≥ 89** dengan HTTPS. Di browser lain akan muncul simulasi fallback — serial acak otomatis setelah 2 detik.

> **SSE** diimplementasikan via `setTimeout` simulasi karena proyek ini adalah frontend-only prototype. Pada implementasi Laravel sesungguhnya menggunakan `Response::stream()` + `EventSource`.

---

## Struktur Folder

```
srikanago-ui/
├── public/
│   └── logo.svg                        ← Logo SrikanaGo (SVG, juga sebagai favicon)
│
├── src/
│   ├── App.jsx                         ← Root routing — 25 routes + catch-all → /beranda
│   ├── main.jsx                        ← Entry point, CartProvider wrapper
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx           ← H01 — Login + Google OAuth UI + fadeInUp
│   │   │   └── OtpPage.jsx             ← H02 — 6 kotak OTP, auto-advance, countdown
│   │   │
│   │   ├── customer/
│   │   │   ├── BerandaPage.jsx         ← H03 — Hero, grid tenant, CTA
│   │   │   ├── KatalogTenantPage.jsx   ← H04 — Filter kategori, search real-time
│   │   │   ├── DetailTenantPage.jsx    ← H05 — Tab menu, floating cart bar
│   │   │   ├── KeranjangPage.jsx       ← H06 — Stepper qty, update total, Fetch/Axios toggle
│   │   │   ├── CheckoutPage.jsx        ← H07 — Cascading select Provinsi→Kota, metode bayar NFC
│   │   │   ├── KonfirmasiPesananPage.jsx ← H08 — Struk berkop, QRCodeSVG, nomor antrian
│   │   │   ├── StatusAntrianPage.jsx   ← H09 — SSE live badge, scaleBounce, alert giliran
│   │   │   ├── ProfilPage.jsx          ← H10 — getUserMedia, canvas capture, blob vs file
│   │   │   ├── KartuNfcPage.jsx        ← H11 — NDEFReader, kartu visual, top-up
│   │   │   └── VerifikasiLokasiPage.jsx ← H12 — Wizard 3-step GPS + Haversine
│   │   │
│   │   ├── tenant/
│   │   │   ├── DashboardTenantPage.jsx  ← H13 — Stat cards, tabel pesanan terbaru
│   │   │   ├── CrudMenuPage.jsx         ← H14 — DataTables, auto ID trigger, modal edit
│   │   │   ├── CetakTagHargaPage.jsx    ← H15 — Grid TnJ 108 (5×8), JsBarcode, offset X,Y
│   │   │   ├── KasirPosPage.jsx         ← H16 — POS 2-panel, toggle Fetch vs Axios
│   │   │   ├── PesananAntrianPage.jsx   ← H17 — SSE pesanan masuk, tab antrian/terlewat
│   │   │   ├── ScanQrPage.jsx           ← H18 — html5-qrcode reader, toggle QR/barcode
│   │   │   └── LaporanTenantPage.jsx    ← H19 — Filter periode, PDF portrait preview
│   │   │
│   │   ├── pengelola/
│   │   │   ├── DashboardPengelolaPage.jsx  ← H20 — Bar chart Recharts, top tenant ranking
│   │   │   ├── KelolaTenantPage.jsx     ← H21 — Grid card CRUD tenant + GPS koordinat
│   │   │   ├── KelolaKartuNfcPage.jsx   ← H22 — Stat cards, bind/blokir kartu NFC
│   │   │   ├── GeofencePage.jsx         ← H23 — Tabel koordinat, test Haversine inline
│   │   │   └── LaporanSettlementPage.jsx ← H24 — PDF portrait + landscape preview
│   │   │
│   │   └── papan/
│   │       └── PapanAntrianPage.jsx     ← H25 — Fullscreen dark, SSE + SpeechSynthesis TTS
│   │
│   ├── components/
│   │   └── common/
│   │       ├── CustomerNavbar.jsx       ← Navbar sticky customer (logo + nav + cart icon)
│   │       ├── PanelNavbar.jsx          ← Navbar panel tenant/pengelola
│   │       ├── PanelSidebar.jsx         ← Sidebar persisten 240px, active link highlight
│   │       └── PanelLayout.jsx          ← Wrapper PanelNavbar + PanelSidebar + konten
│   │
│   ├── context/
│   │   └── CartContext.jsx              ← State keranjang global (Context API + localStorage)
│   │
│   ├── data/
│   │   └── mockData.js                  ← Semua data simulasi: tenant, menu, pesanan, kartu NFC
│   │
│   ├── utils/
│   │   └── helpers.js                   ← formatRupiah(), haversine(), generateMenuId(), dll.
│   │
│   └── styles/
│       └── global.css                   ← CSS custom properties, keyframe animasi, layout global
│
├── index.html                           ← Entry HTML — title, favicon /logo.svg, Boxicons CDN
├── vite.config.js
└── package.json
```

---

## Menjalankan Lokal

### Prasyarat

- **Node.js** ≥ 18
- **npm** ≥ 9

### Langkah

```bash
# 1. Clone repository
git clone https://github.com/<username>/srikanago-ui.git
cd srikanago-ui

# 2. Install dependencies
npm install

# 3. Jalankan dev server
npm run dev
```

Buka **[http://localhost:5173](http://localhost:5173)** di browser.

> Untuk fitur **Web NFC**, buka dari **Android Chrome ≥ 89** via HTTPS atau gunakan ngrok untuk tunneling localhost.  
> Untuk fitur **Kamera & Geolocation**, izinkan akses saat browser meminta.

### Perintah Lain

```bash
npm run build      # Build produksi → folder dist/
npm run preview    # Preview hasil build lokal
npm run lint       # Lint dengan oxlint
```

---

## Desain System

| Token | Nilai |
|---|---|
| **Primary** | `#011F43` (navy) |
| **Primary Hover** | `#032d5e` |
| **Primary Light** | `#e8edf5` |
| **Success** | `#16a34a` |
| **Danger** | `#dc2626` |
| **Background** | `#ffffff` |
| **Background Muted** | `#f9fafb` |
| **Font** | Poppins (300 · 400 · 500 · 600 · 700) |
| **Icon Library** | Boxicons `bx bx-*` |
| **Border Radius Card** | `12px` |
| **Sidebar Width** | `240px` |
| **Animasi** | `fadeInUp` · `scaleBounce` · `glowPulse` · `shake` |

---

## Catatan Implementasi

- **Tidak ada backend** — seluruh data bersumber dari `src/data/mockData.js`. Proyek ini adalah frontend-only prototype untuk keperluan demonstrasi mata kuliah.
- **Tidak ada autentikasi** — semua route dapat diakses langsung via URL tanpa sesi login.
- **SSE disimulasikan** via `setTimeout` — pada implementasi Laravel sesungguhnya menggunakan `Response::stream()` dan `EventSource`.
- **Payment Gateway** — direpresentasikan via UI pilihan VA/QRIS; pada implementasi nyata terhubung ke Midtrans Snap API dengan callback server-side.
- **Database Trigger** — penomoran `id_menu` otomatis disimulasikan di frontend; pada implementasi MySQL sesungguhnya menggunakan `BEFORE INSERT` trigger.

---

## Lisensi

Proyek ini dibuat untuk keperluan akademik — Tugas Akhir (UAS) Mata Kuliah Workshop Pengembangan Perangkat Lunak WEB (Framework), DIV Teknik Informatika, Universitas Airlangga.

---

<div align="center">
  <img src="public/logo.svg" alt="SrikanaGo" width="36" /><br/>
  <sub><b>SrikanaGo</b> — Satu aplikasi, satu kartu — semua tenant Srikana.</sub>
</div>
