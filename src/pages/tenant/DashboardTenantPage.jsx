import { Link } from "react-router-dom";
import PanelLayout from "../../components/common/PanelLayout";
import { mockAllOrders, mockTenants } from "../../data/mockData";
import { formatRupiah, formatDateTime, statusColor, metodeBayarLabel } from "../../utils/helpers";

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function todayLabel() {
  const d = new Date("2026-06-27");
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

const statCards = [
  { icon: "bx bx-receipt", label: "Pesanan Hari Ini", value: "12", color: "#011F43" },
  { icon: "bx bx-money", label: "Pendapatan", value: "Rp480.000", color: "#16a34a" },
  { icon: "bx bx-dish", label: "Menu Aktif", value: "15", color: "#d97706" },
  { icon: "bx bx-time-five", label: "Antrian Menunggu", value: "3", color: "#dc2626" },
];

export default function DashboardTenantPage() {
  const tenant = mockTenants.find((t) => t.id === 1);
  const recentOrders = mockAllOrders.slice(0, 5);

  return (
    <PanelLayout role="tenant" tenantName="Warung Bu Sri">
      <div className="animate-fadein">
        {/* Greeting */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--primary) 0%, #2568a8 100%)",
            borderRadius: 16,
            padding: "20px 24px",
            color: "#fff",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>Selamat datang kembali</p>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>Warung Bu Sri!</h2>
            <p style={{ fontSize: 12.5, opacity: 0.8, marginTop: 4 }}>{todayLabel()}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/tenant/kasir" className="btn btn-sm" style={{ background: "#fff", color: "var(--primary)", border: "none", borderRadius: 50 }}>
              <i className="bx bx-store" /> Buka Kasir POS
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: "1.5rem",
          }}
        >
          {statCards.map((s, i) => (
            <div className="stat-card animate-slideUp" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="stat-icon" style={{ background: `${s.color}18`, color: s.color }}>
                <i className={s.icon} />
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: "var(--bg)",
            borderRadius: 14,
            border: "1px solid var(--border-card)",
            padding: "16px 20px",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "#0e1422" }}>
            <i className="bx bx-zap" style={{ color: "var(--primary)", marginRight: 6 }} />
            Aksi Cepat
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/tenant/kasir" className="btn btn-primary btn-sm">
              <i className="bx bx-store" /> Buka Kasir POS
            </Link>
            <Link to="/tenant/scan-qr" className="btn btn-outline btn-sm">
              <i className="bx bx-qr-scan" /> Scan QR
            </Link>
            <Link to="/tenant/cetak-tag" className="btn btn-outline btn-sm">
              <i className="bx bx-printer" /> Cetak Tag Harga
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div
          style={{
            background: "var(--bg)",
            borderRadius: 14,
            border: "1px solid var(--border-card)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontWeight: 600, fontSize: 14, color: "#0e1422" }}>
              <i className="bx bx-list-ul" style={{ color: "var(--primary)", marginRight: 6 }} />
              Pesanan Terbaru
            </p>
            <Link to="/tenant/pesanan" style={{ fontSize: 12.5, color: "var(--primary)", fontWeight: 500 }}>
              Lihat semua &rarr;
            </Link>
          </div>
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>ID Pesanan</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Metode</th>
                  <th>Status</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: "var(--primary)", fontSize: 12.5 }}>
                        {order.id}
                      </span>
                    </td>
                    <td>{order.customer}</td>
                    <td style={{ fontWeight: 600 }}>{formatRupiah(order.total)}</td>
                    <td>
                      <span className="badge badge-primary">{metodeBayarLabel(order.metode)}</span>
                    </td>
                    <td>
                      <span className={`badge ${statusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>
                      {formatDateTime(order.waktu)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentOrders.length === 0 && (
            <div className="empty-state">
              <i className="bx bx-receipt" />
              <p>Belum ada pesanan hari ini</p>
            </div>
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
