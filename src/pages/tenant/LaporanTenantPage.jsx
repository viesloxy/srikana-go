import { useState, useMemo } from "react";
import PanelLayout from "../../components/common/PanelLayout";
import { mockAllOrders, mockGrafikData } from "../../data/mockData";
import { formatRupiah, formatDateTime, statusColor, metodeBayarLabel } from "../../utils/helpers";

const PER_PAGE = 3;
const MAX_BAR_HEIGHT = 150;

export default function LaporanTenantPage() {
  const [dateFrom, setDateFrom] = useState("2026-06-21");
  const [dateTo, setDateTo] = useState("2026-06-27");
  const [chartType, setChartType] = useState("bar");
  const [page, setPage] = useState(1);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [activeBar, setActiveBar] = useState(null);

  const orders = useMemo(() => mockAllOrders, []);
  const totalOmzet = useMemo(() => orders.reduce((s, o) => s + o.total, 0), [orders]);
  const menuTerlaris = "Nasi Goreng Spesial";

  const maxOmzet = Math.max(...mockGrafikData.map((d) => d.omzet));
  const totalPages = Math.max(1, Math.ceil(orders.length / PER_PAGE));
  const paginated = orders.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function reset() {
    setDateFrom("2026-06-21");
    setDateTo("2026-06-27");
    setPage(1);
  }

  return (
    <PanelLayout role="tenant">
      <div className="animate-fadein">
        <div className="page-header">
          <h1 className="page-title">
            <i className="bx bx-chart" /> Laporan Penjualan
          </h1>
          <div className="page-actions">
            <button className="btn btn-primary btn-sm" onClick={() => setShowPdfModal(true)}>
              <i className="bx bx-file-pdf" /> Unduh PDF
            </button>
          </div>
        </div>

        {/* Filter Periode */}
        <div
          style={{
            background: "var(--bg)",
            borderRadius: 14,
            border: "1px solid var(--border-card)",
            padding: "16px 20px",
            marginBottom: "1.5rem",
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Dari Tanggal</label>
            <input
              type="date"
              className="form-input"
              style={{ width: 180 }}
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Sampai Tanggal</label>
            <input
              type="date"
              className="form-input"
              style={{ width: 180 }}
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            />
          </div>
          <button className="btn btn-primary btn-sm">
            <i className="bx bx-filter" /> Filter
          </button>
          <button className="btn btn-outline btn-sm" onClick={reset}>
            <i className="bx bx-reset" /> Reset
          </button>
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
          {[
            { icon: "bx bx-money", label: "Total Omzet", value: formatRupiah(totalOmzet), color: "#16a34a" },
            { icon: "bx bx-receipt", label: "Total Transaksi", value: `${orders.length} pesanan`, color: "#011F43" },
            { icon: "bx bx-star", label: "Menu Terlaris", value: menuTerlaris, color: "#d97706", small: true },
          ].map((s, i) => (
            <div className="stat-card animate-slideUp" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="stat-icon" style={{ background: `${s.color}18`, color: s.color }}>
                <i className={s.icon} />
              </div>
              <div className={`stat-value ${s.small ? "" : ""}`} style={{ fontSize: s.small ? "1rem" : undefined }}>
                {s.value}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div
          style={{
            background: "var(--bg)",
            borderRadius: 14,
            border: "1px solid var(--border-card)",
            padding: "20px",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <p style={{ fontWeight: 600, fontSize: 14 }}>
              <i className="bx bx-bar-chart-alt-2" style={{ color: "var(--primary)", marginRight: 6 }} />
              Grafik Omzet 7 Hari Terakhir
            </p>
            <div style={{ display: "flex", gap: 6 }}>
              {["bar", "line"].map((t) => (
                <button
                  key={t}
                  className={`tab-pill ${chartType === t ? "active" : ""}`}
                  style={{ padding: "4px 14px", fontSize: 12 }}
                  onClick={() => setChartType(t)}
                >
                  <i className={t === "bar" ? "bx bx-bar-chart-alt-2" : "bx bx-line-chart"} />
                  {" "}{t === "bar" ? "Bar" : "Line"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: MAX_BAR_HEIGHT + 40, paddingBottom: 30, position: "relative" }}>
            {/* Y-axis guide lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <div
                key={ratio}
                style={{
                  position: "absolute",
                  bottom: 30 + ratio * MAX_BAR_HEIGHT,
                  left: 0,
                  right: 0,
                  borderTop: "1px dashed #eee",
                  zIndex: 0,
                }}
              />
            ))}

            {mockGrafikData.map((d, i) => {
              const height = Math.round((d.omzet / maxOmzet) * MAX_BAR_HEIGHT);
              const isActive = activeBar === i;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {/* Tooltip */}
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: height + 12,
                        background: "#333",
                        color: "#fff",
                        fontSize: 11,
                        padding: "4px 8px",
                        borderRadius: 6,
                        whiteSpace: "nowrap",
                        zIndex: 10,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      {formatRupiah(d.omzet)}
                    </div>
                  )}

                  {chartType === "bar" ? (
                    <div
                      onMouseEnter={() => setActiveBar(i)}
                      onMouseLeave={() => setActiveBar(null)}
                      style={{
                        width: "70%",
                        height,
                        background: isActive
                          ? "var(--primary)"
                          : "var(--primary-light)",
                        borderRadius: "4px 4px 0 0",
                        cursor: "pointer",
                        transition: "background 0.2s, height 0.3s",
                        border: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                      }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: MAX_BAR_HEIGHT, position: "relative" }}>
                      <div
                        onMouseEnter={() => setActiveBar(i)}
                        onMouseLeave={() => setActiveBar(null)}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: isActive ? "var(--primary)" : "var(--primary-light)",
                          border: "2px solid var(--primary)",
                          cursor: "pointer",
                          bottom: height - 6,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          width: 2,
                          height,
                          background: "var(--primary-light)",
                          transform: "translateX(-50%)",
                        }}
                      />
                    </div>
                  )}
                  <span style={{ fontSize: 11, color: "var(--text-muted)", position: "absolute", bottom: 8 }}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Table Transaksi */}
        <div style={{ background: "var(--bg)", borderRadius: 14, border: "1px solid var(--border-card)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontWeight: 600, fontSize: 14 }}>
              <i className="bx bx-list-ul" style={{ color: "var(--primary)", marginRight: 6 }} />
              Riwayat Transaksi
            </p>
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
                {paginated.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: "var(--primary)", fontSize: 12.5 }}>{order.id}</span>
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
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{formatDateTime(order.waktu)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="empty-state">
              <i className="bx bx-receipt" />
              <p>Tidak ada transaksi dalam periode ini</p>
            </div>
          )}
          <div className="pagination">
            <span>Menampilkan {Math.min((page - 1) * PER_PAGE + 1, orders.length)}–{Math.min(page * PER_PAGE, orders.length)} dari {orders.length} transaksi</span>
            <div className="pagination-pages">
              <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <i className="bx bx-chevron-left" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>
                  {p}
                </button>
              ))}
              <button className="page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <i className="bx bx-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPdfModal && (
        <div className="modal-overlay" onClick={() => setShowPdfModal(false)}>
          <div className="modal-box" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                <i className="bx bx-file-pdf" style={{ marginRight: 6, color: "var(--danger)" }} />
                Preview Laporan PDF
              </span>
              <button className="modal-close" onClick={() => setShowPdfModal(false)}>
                <i className="bx bx-x" />
              </button>
            </div>
            <div className="modal-body">
              <div
                style={{
                  border: "2px dashed #ccc",
                  borderRadius: 10,
                  padding: "20px 24px",
                  fontFamily: "monospace",
                  fontSize: 12.5,
                  lineHeight: 1.8,
                  background: "#fafafa",
                }}
              >
                <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                  ═══════════════════════════
                </div>
                <div style={{ textAlign: "center", fontWeight: 700, fontSize: 13 }}>SRIKANAGO FOOD COURT</div>
                <div style={{ textAlign: "center", fontSize: 11, color: "#888" }}>Laporan Penjualan Tenant</div>
                <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, marginTop: 4 }}>
                  ═══════════════════════════
                </div>
                <div style={{ marginTop: 8 }}>
                  <div>Tenant      : Warung Bu Sri</div>
                  <div>Periode     : {dateFrom} s/d {dateTo}</div>
                  <div>Tanggal Cetak: 27 Juni 2026</div>
                </div>
                <div style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
                {orders.map((o) => (
                  <div key={o.id} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{o.id}</span>
                    <span>{formatRupiah(o.total)}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                  <span>TOTAL</span>
                  <span>{formatRupiah(totalOmzet)}</span>
                </div>
                <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, marginTop: 8 }}>
                  ═══════════════════════════
                </div>
                <div style={{ textAlign: "center", fontSize: 11, color: "#888" }}>
                  Dicetak oleh sistem SrikanaGo
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline btn-sm" onClick={() => setShowPdfModal(false)}>Tutup</button>
              <button className="btn btn-primary btn-sm" onClick={() => alert("PDF akan diunduh...")}>
                <i className="bx bx-download" /> Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </PanelLayout>
  );
}
