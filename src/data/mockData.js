export const mockTenants = [
  {
    id: 1,
    nama: "Warung Bu Sri",
    deskripsi: "Masakan rumahan khas Jawa Timur dengan cita rasa autentik sejak 1995",
    foto: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    kategori: "Makanan Berat",
    rating: 4.8,
    jumlah_menu: 15,
    status: "aktif",
    latitude: -7.265774,
    longitude: 112.752174,
    accuracy: 15,
    barcode: "TN-001",
  },
  {
    id: 2,
    nama: "Es Teh Pak Budi",
    deskripsi: "Minuman segar es teh dan jus buah pilihan dengan harga pelajar",
    foto: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
    kategori: "Minuman",
    rating: 4.6,
    jumlah_menu: 12,
    status: "aktif",
    latitude: -7.265900,
    longitude: 112.752300,
    accuracy: 20,
    barcode: "TN-002",
  },
  {
    id: 3,
    nama: "Ayam Penyet Mbak Dewi",
    deskripsi: "Ayam penyet original dengan sambal terasi yang menggugah selera",
    foto: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    kategori: "Makanan Berat",
    rating: 4.9,
    jumlah_menu: 20,
    status: "aktif",
    latitude: -7.266000,
    longitude: 112.752100,
    accuracy: 12,
    barcode: "TN-003",
  },
  {
    id: 4,
    nama: "Bakso Pak Hendra",
    deskripsi: "Bakso sapi asli dengan kuah kaldu bening yang menyegarkan",
    foto: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
    kategori: "Makanan Berat",
    rating: 4.7,
    jumlah_menu: 8,
    status: "aktif",
    latitude: -7.265650,
    longitude: 112.752400,
    accuracy: 18,
    barcode: "TN-004",
  },
  {
    id: 5,
    nama: "Soto Lamongan Bu Yanti",
    deskripsi: "Soto Lamongan otentik dengan bumbu rempah pilihan berkualitas tinggi",
    foto: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=800&q=80",
    kategori: "Makanan Berat",
    rating: 4.5,
    jumlah_menu: 10,
    status: "aktif",
    latitude: -7.265800,
    longitude: 112.752000,
    accuracy: 25,
    barcode: "TN-005",
  },
  {
    id: 6,
    nama: "Camilan Kak Rina",
    deskripsi: "Aneka camilan gorengan dan jajan pasar tradisional khas Surabaya",
    foto: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
    kategori: "Camilan",
    rating: 4.4,
    jumlah_menu: 18,
    status: "aktif",
    latitude: -7.266100,
    longitude: 112.752500,
    accuracy: 22,
    barcode: "TN-006",
  },
  {
    id: 7,
    nama: "Dessert Corner",
    deskripsi: "Dessert modern dengan sentuhan tradisional: es krim, pudding, dan crepes",
    foto: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
    kategori: "Dessert",
    rating: 4.6,
    jumlah_menu: 14,
    status: "aktif",
    latitude: -7.265500,
    longitude: 112.752600,
    accuracy: 16,
    barcode: "TN-007",
  },
  {
    id: 8,
    nama: "Nasi Goreng Pak Slamet",
    deskripsi: "Nasi goreng special dengan berbagai pilihan topping sesuai selera",
    foto: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    kategori: "Makanan Berat",
    rating: 4.8,
    jumlah_menu: 11,
    status: "aktif",
    latitude: -7.265700,
    longitude: 112.751900,
    accuracy: 14,
    barcode: "TN-008",
  },
];

export const mockMenus = [
  // Warung Bu Sri (tenant 1)
  { id_menu: "MB-0001", tenant_id: 1, nama: "Nasi Goreng Spesial", kategori: "Makanan Berat", harga: 15000, foto: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&q=80", tersedia: true },
  { id_menu: "MB-0002", tenant_id: 1, nama: "Ayam Penyet Sambal Ijo", kategori: "Makanan Berat", harga: 18000, foto: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&q=80", tersedia: true },
  { id_menu: "MB-0003", tenant_id: 1, nama: "Soto Ayam Lamongan", kategori: "Makanan Berat", harga: 14000, foto: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&q=80", tersedia: true },
  { id_menu: "MN-0001", tenant_id: 1, nama: "Es Teh Manis", kategori: "Minuman", harga: 5000, foto: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80", tersedia: true },
  { id_menu: "MN-0002", tenant_id: 1, nama: "Es Jeruk Peras", kategori: "Minuman", harga: 7000, foto: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&q=80", tersedia: false },
  { id_menu: "MB-0004", tenant_id: 1, nama: "Rawon Daging", kategori: "Makanan Berat", harga: 20000, foto: "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80", tersedia: true },
  // Es Teh Pak Budi (tenant 2)
  { id_menu: "MN-0003", tenant_id: 2, nama: "Es Teh Original", kategori: "Minuman", harga: 4000, foto: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80", tersedia: true },
  { id_menu: "MN-0004", tenant_id: 2, nama: "Es Teh Lemon", kategori: "Minuman", harga: 6000, foto: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80", tersedia: true },
  { id_menu: "MN-0005", tenant_id: 2, nama: "Jus Alpukat", kategori: "Minuman", harga: 10000, foto: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80", tersedia: true },
  { id_menu: "MN-0006", tenant_id: 2, nama: "Jus Mangga", kategori: "Minuman", harga: 10000, foto: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=300&q=80", tersedia: true },
];

export const mockKategori = ["Makanan Berat", "Minuman", "Camilan", "Dessert"];

export const mockCart = [];

export const mockOrders = [
  {
    id: "ORD-000132",
    id_pesanan: 132,
    tenant_id: 1,
    tenant: "Warung Bu Sri",
    customer: "Muhammad Ikhsan",
    items: [
      { nama: "Nasi Goreng Spesial", qty: 2, harga: 15000, subtotal: 30000 },
      { nama: "Ayam Penyet Sambal Ijo", qty: 1, harga: 18000, subtotal: 18000 },
    ],
    total: 48000,
    metode_bayar: "qris",
    status_bayar: "lunas",
    nomor_antrian: 132,
    created_at: "2026-06-27T10:30:00",
  },
];

export const mockAntrian = [
  { id: 1, nomor_antrian: 130, nama: "Andi", tenant: "Warung Bu Sri", status: "diambil" },
  { id: 2, nomor_antrian: 131, nama: "Sari", tenant: "Warung Bu Sri", status: "dipanggil" },
  { id: 3, nomor_antrian: 132, nama: "Muhammad Ikhsan", tenant: "Warung Bu Sri", status: "menunggu" },
  { id: 4, nomor_antrian: 133, nama: "Doni", tenant: "Warung Bu Sri", status: "menunggu" },
  { id: 5, nomor_antrian: 134, nama: "Rina", tenant: "Warung Bu Sri", status: "menunggu" },
];

export const mockNfcCard = {
  id: 1,
  serial_number: "A1:B2:C3:D4",
  saldo: 25000,
  status: "aktif",
  registered_at: "2026-06-01",
};

export const mockTransaksiSaldo = [
  { id: 1, jenis: "topup", nominal: 50000, saldo_akhir: 75000, created_at: "2026-06-27T08:00:00" },
  { id: 2, jenis: "bayar", nominal: 15000, saldo_akhir: 60000, created_at: "2026-06-26T13:00:00" },
  { id: 3, jenis: "bayar", nominal: 35000, saldo_akhir: 25000, created_at: "2026-06-26T11:30:00" },
];

export const mockKawasanStats = {
  tenant_aktif: 8,
  omzet_hari_ini: 5000000,
  order_hari_ini: 89,
  kartu_nfc: 34,
};

export const mockTopTenants = [
  { rank: 1, nama: "Warung Bu Sri", omzet: 480000, order: 32 },
  { rank: 2, nama: "Es Teh Pak Budi", omzet: 210000, order: 28 },
  { rank: 3, nama: "Ayam Penyet Mbak Dewi", omzet: 190000, order: 18 },
];

export const mockGrafikData = [
  { label: "Sen", omzet: 320000 },
  { label: "Sel", omzet: 480000 },
  { label: "Rab", omzet: 390000 },
  { label: "Kam", omzet: 520000 },
  { label: "Jum", omzet: 610000 },
  { label: "Sab", omzet: 780000 },
  { label: "Min", omzet: 450000 },
];

export const mockAllOrders = [
  { id: "ORD-000132", tenant: "Warung Bu Sri", customer: "Muhammad Ikhsan", total: 48000, metode: "qris", status: "lunas", waktu: "2026-06-28T10:30:00" },
  { id: "ORD-000131", tenant: "Es Teh Pak Budi", customer: "Sari Dewi", total: 12000, metode: "va", status: "lunas", waktu: "2026-06-28T10:20:00" },
  { id: "ORD-000130", tenant: "Ayam Penyet Mbak Dewi", customer: "Budi Santoso", total: 35000, metode: "nfc", status: "lunas", waktu: "2026-06-28T10:10:00" },
  { id: "ORD-000129", tenant: "Bakso Pak Hendra", customer: "Rina Anggraini", total: 27000, metode: "qris", status: "lunas", waktu: "2026-06-28T09:55:00" },
  { id: "ORD-000128", tenant: "Warung Bu Sri", customer: "Dimas Pratama", total: 55000, metode: "va", status: "lunas", waktu: "2026-06-28T09:40:00" },
  { id: "ORD-000127", tenant: "Es Teh Pak Budi", customer: "Ayu Lestari", total: 9000, metode: "nfc", status: "lunas", waktu: "2026-06-28T09:30:00" },
  { id: "ORD-000126", tenant: "Mie Ayam Pak Eko", customer: "Fajar Nugroho", total: 22000, metode: "qris", status: "lunas", waktu: "2026-06-27T16:45:00" },
  { id: "ORD-000125", tenant: "Ayam Penyet Mbak Dewi", customer: "Siti Rahayu", total: 40000, metode: "va", status: "lunas", waktu: "2026-06-27T16:30:00" },
  { id: "ORD-000124", tenant: "Kopi Nusantara", customer: "Reza Firmansyah", total: 18000, metode: "qris", status: "lunas", waktu: "2026-06-27T16:00:00" },
  { id: "ORD-000123", tenant: "Warung Bu Sri", customer: "Dewi Kusuma", total: 31000, metode: "nfc", status: "lunas", waktu: "2026-06-27T15:30:00" },
  { id: "ORD-000122", tenant: "Bakso Pak Hendra", customer: "Andi Wijaya", total: 24000, metode: "va", status: "lunas", waktu: "2026-06-27T15:00:00" },
  { id: "ORD-000121", tenant: "Es Teh Pak Budi", customer: "Ninda Safitri", total: 15000, metode: "qris", status: "lunas", waktu: "2026-06-27T14:45:00" },
  { id: "ORD-000120", tenant: "Mie Ayam Pak Eko", customer: "Hendra Gunawan", total: 20000, metode: "nfc", status: "lunas", waktu: "2026-06-27T14:00:00" },
  { id: "ORD-000119", tenant: "Kopi Nusantara", customer: "Lina Marlina", total: 25000, metode: "va", status: "lunas", waktu: "2026-06-27T13:30:00" },
  { id: "ORD-000118", tenant: "Ayam Penyet Mbak Dewi", customer: "Muhammad Ikhsan", total: 38000, metode: "qris", status: "lunas", waktu: "2026-06-27T12:00:00" },
];

export const mockKartuNfcAll = [
  { id: 1, serial: "A1:B2:C3:D4", customer: "Muhammad Ikhsan", email: "ikhsan@email.com", saldo: 25000, status: "aktif" },
  { id: 2, serial: "E5:F6:G7:H8", customer: "Sari Dewi", email: "sari@email.com", saldo: 50000, status: "aktif" },
  { id: 3, serial: "I9:J0:K1:L2", customer: null, email: null, saldo: 0, status: "aktif" },
  { id: 4, serial: "M3:N4:O5:P6", customer: "Budi Santoso", email: "budi@email.com", saldo: 15000, status: "blokir" },
];
