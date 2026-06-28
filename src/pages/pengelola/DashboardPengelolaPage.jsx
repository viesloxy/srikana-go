import { Link } from "react-router-dom";
import PanelLayout from "../../components/common/PanelLayout";
import {
  mockKawasanStats,
  mockTopTenants,
  mockGrafikData,
  mockAllOrders,
} from "../../data/mockData";
import {
  formatRupiah,
  formatRupiahShort,
  statusColor,
  metodeBayarLabel,
  formatDateTime,
} from "../../utils/helpers";

const MAX_BAR_HEIGHT = 120;
const RANK_MEDALS = ["#", "#", "#"];

export default function DashboardPengelolaPage() {
  const maxOmzet = Math.max(...mockGrafikData.map((d) => d.omzet));
  const maxTenantOmzet = Math.max(...mockTopTenants.map((t) => t.omzet));
  const recentOrders = mockAllOrders.slice(0, 5);

  const statCards = [
    {
      icon: "bx bx-store",
      label: "Tenant Aktif",
      value: mockKawasanStats.tenant_aktif,
      color: "#011F43",
    },
    {
      icon: "bx bx-money",
      label: "Omzet Kawasan",
      value: formatRupiahShort(mockKawasanStats.omzet_hari_ini),
      color: "#16a34a",
    },
    {
      icon: "bx bx-receipt",
      label: "Order Hari Ini",
      value: mockKawasanStats.order_hari_ini,
      color: "#d97706",
    },
    {
      icon: "bx bx-credit-card",
      label: "Kartu NFC",
      value: mockKawasanStats.kartu_nfc,
      color: "#7c3aed",
    },
  ];

  const quickLinks = [
    { to: "/pengelola/tenant", icon: "bx bx-store", label: "Kelola Tenant" },
    { to: "/pengelola/nfc", icon: "bx bx-credit-card", label: "Kelola NFC" },
    { to: "/pengelola/geofence", icon: "bx bx-map", label: "Geofence" },
    { to: "/pengelola/laporan", icon: "bx bx-chart", label: "Laporan" },
  ];

  return (
    <PanelLayout role="pengelola">
      <div className="animate-fadein">
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1a5490 0%, var(--primary) 100%)",
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
            <p style={{ fontSize: 12.5, opacity: 0.8, marginBottom: 4 }}>Dashboard Pengelola</p>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>SrikanaGo Food Court</h2>
            <p style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Sabtu, 27 Juni 2026</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {quickLinks.map((ql) => (
              <Link
                key={ql.to}
                to={ql.to}
                className="btn btn-sm"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 50 }}
              >
                <i className={ql.icon} /> {ql.label}
              </Link>
            ))}
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: "1.5rem" }}>
          {/* Chart */}
          <div
            style={{
              background: "var(--bg)",
              borderRadius: 14,
              border: "1px solid var(--border-card)",
              padding: 20,
            }}
          >
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
              <i className="bx bx-bar-chart-alt-2" style={{ color: "var(--primary)", marginRight: 6 }} />
              Omzet Kawasan 7 Hari
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                height: MAX_BAR_HEIGHT + 30,
                paddingBottom: 24,
                position: "relative",
              }}
            >
              {mockGrafikData.map((d, i) => {
                const height = Math.round((d.omzet / maxOmzet) * MAX_BAR_HEIGHT);
                return (
                  <div
                    key={i}
                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}
                  >
                    <div
                      title={formatRupiah(d.omzet)}
                      style={{
                        width: "70%",
                        height,
                        background: "var(--primary-light)",
                        borderRadius: "4px 4px 0 0",
                        border: "2px solid var(--primary)",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "var(--primary-light)"; }}
                    />
                    <span style={{ position: "absolute", bottom: -20, fontSize: 10.5, color: "var(--text-muted)" }}>
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Tenants */}
          <div
            style={{
              background: "var(--bg)",
              borderRadius: 14,
              border: "1px solid var(--border-card)",
              padding: 20,
            }}
          >
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
              <i className="bx bx-trophy" style={{ color: "var(--primary)", marginRight: 6 }} />
              Top Tenant Hari Ini
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mockTopTenants.map((t, i) => {
                const progress = Math.round((t.omzet / maxTenantOmzet) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, color: i === 0 ? "#f59e0b" : i === 1 ? "#6b7280" : "#b45309", fontSize: 14 }}>#{i+1}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{t.nama}</span>
                          <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: 13 }}>
                            {formatRupiah(t.omzet)}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
                          {t.order} transaksi
                        </div>
                      </div>
                    </div>
                    <div style={{ background: "#f0f0f0", borderRadius: 4, height: 6, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${progress}%`,
                          background: i === 0 ? "var(--primary)" : i === 1 ? "var(--primary-light)" : "#e5e7eb",
                          borderRadius: 4,
                          border: `1px solid var(--primary)`,
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
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
              padding: "14px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontWeight: 600, fontSize: 14 }}>
              <i className="bx bx-list-ul" style={{ color: "var(--primary)", marginRight: 6 }} />
              Pesanan Terbaru (Semua Tenant)
            </p>
            <Link to="/pengelola/laporan" style={{ fontSize: 12.5, color: "var(--primary)", fontWeight: 500 }}>
              Lihat laporan lengkap &rarr;
            </Link>
          </div>
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Tenant</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Metode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={order.id}>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{order.tenant}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentOrders.length === 0 && (
            <div className="empty-state">
              <i className="bx bx-receipt" />
              <p>Belum ada pesanan</p>
            </div>
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
