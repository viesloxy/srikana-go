export const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

export const formatRupiahShort = (amount) => {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)} Jt`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)} rb`;
  return String(amount);
};

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
};

export const formatDateTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

export const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

export const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export const generateMenuId = (kategori, existingIds) => {
  const prefixMap = {
    "Makanan Berat": "MB",
    Minuman: "MN",
    Camilan: "CA",
    Dessert: "DS",
  };
  const prefix = prefixMap[kategori] || "XX";
  const existing = (existingIds || []).filter((id) => id.startsWith(prefix));
  const seq = (existing.length + 1).toString().padStart(4, "0");
  return `${prefix}-${seq}`;
};

export const getGridPosition = (index, startX, startY) => {
  const startIndex = (startY - 1) * 5 + (startX - 1);
  const actualIndex = startIndex + index;
  if (actualIndex >= 40) return null;
  return { row: Math.floor(actualIndex / 5) + 1, col: (actualIndex % 5) + 1 };
};

export const numberToWords = (n) => {
  const ones = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan",
    "sepuluh", "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas", "enam belas",
    "tujuh belas", "delapan belas", "sembilan belas"];
  const tens = ["", "", "dua puluh", "tiga puluh", "empat puluh", "lima puluh",
    "enam puluh", "tujuh puluh", "delapan puluh", "sembilan puluh"];
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  if (n < 200) return "seratus" + (n % 100 ? " " + numberToWords(n % 100) : "");
  return Math.floor(n / 100) + " ratus" + (n % 100 ? " " + numberToWords(n % 100) : "");
};

export const statusColor = (status) => ({
  lunas: "badge-success",
  pending: "badge-warning",
  batal: "badge-danger",
  menunggu: "badge-muted",
  dipanggil: "badge-success",
  diambil: "badge-primary",
  terlewat: "badge-danger",
  aktif: "badge-success",
  nonaktif: "badge-muted",
  blokir: "badge-danger",
  topup: "badge-success",
  bayar: "badge-danger",
  refund: "badge-primary",
  diterima: "badge-success",
  ditolak: "badge-danger",
}[status] || "badge-muted");

export const metodeBayarLabel = (metode) => ({
  va: "Virtual Account",
  qris: "QRIS",
  nfc: "Kartu NFC",
}[metode] || metode);
