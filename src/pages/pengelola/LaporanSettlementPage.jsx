import { useState } from "react";
import PanelLayout from "../../components/common/PanelLayout";
import { mockAllOrders, mockTenants } from "../../data/mockData";
import { formatRupiah, formatDate, statusColor } from "../../utils/helpers";

const ITEMS_PER_PAGE = 10;

const periodeOptions = [
  { label: "Hari Ini", value: "today" },
  { label: "7 Hari Terakhir", value: "7d" },
  { label: "30 Hari Terakhir", value: "30d" },
  { label: "Bulan Ini", value: "thisMonth" },
];

export default function LaporanSettlementPage() {
  const [periode, setPeriode] = useState("30d");
  const [tanggalDari, setTanggalDari] = useState("2025-01-01");
  const [tanggalSampai, setTanggalSampai] = useState("2025-01-31");
  const [filterTenant, setFilterTenant] = useState("all");
  const [page, setPage] = useState(1);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfOrientation, setPdfOrientation] = useState("portrait");

  const orders = mockAllOrders;

  const filteredOrders = filterTenant === "all"
    ? orders
    : orders.filter((o) => o.tenant === mockTenants.find((t) => t.id.toString() === filterTenant)?.nama);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalPendapatan = filteredOrders.reduce((s, o) => s + o.total, 0);
  const totalFee = Math.round(totalPendapatan * 0.025);
  const totalSettlement = totalPendapatan - totalFee;

  const settlementPerTenant = mockTenants.map((t) => {
    const tenantOrders = orders.filter((o) => o.tenant === t.nama);
    const pendapatan = tenantOrders.reduce((s, o) => s + o.total, 0);
    const fee = Math.round(pendapatan * 0.025);
    return { ...t, pendapatan, fee, settlement: pendapatan - fee, jumlahOrder: tenantOrders.length };
  });

  return (
    <PanelLayout role="pengelola" userName="Pengelola">
      <div className="page-header">
        <h1 className="page-title"><i className="bx bx-bar-chart-alt-2" /> Laporan & Settlement</h1>
        <div className="page-actions">
          <button className="btn btn-outline" onClick={() => { setPdfOrientation("portrait"); setShowPdfPreview(true); }}>
            <i className="bx bx-file" /> Preview PDF Portrait
          </button>
          <button className="btn btn-primary" onClick={() => { setPdfOrientation("landscape"); setShowPdfPreview(true); }}>
            <i className="bx bx-printer" /> Preview PDF Landscape
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-section" style={{ marginBottom: "1.5rem" }}>
        <div className="filter-section-container" style={{ flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <select className="dropdown-btn" value={periode} onChange={(e) => setPeriode(e.target.value)}>
              {periodeOptions.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              <option value="custom">Kustom</option>
            </select>
            {periode === "custom" && (
              <>
                <input type="date" className="form-input" style={{ width: 150 }} value={tanggalDari} onChange={(e) => setTanggalDari(e.target.value)} />
                <span style={{ color: "var(--text-muted)", fontSize: 13 }}>s/d</span>
                <input type="date" className="form-input" style={{ width: 150 }} value={tanggalSampai} onChange={(e) => setTanggalSampai(e.target.value)} />
              </>
            )}
          </div>
          <div className="filter-right">
            <select className="dropdown-btn" value={filterTenant} onChange={(e) => { setFilterTenant(e.target.value); setPage(1); }}>
              <option value="all">Semua Tenant</option>
              {mockTenants.map((t) => <option key={t.id} value={t.id.toString()}>{t.nama}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: "1.5rem" }}>
        {[
          { label: "Total Transaksi", val: filteredOrders.length, icon: "bx bx-receipt", color: "var(--primary)", isNum: true },
          { label: "Total Pendapatan", val: formatRupiah(totalPendapatan), icon: "bx bx-money", color: "var(--success)" },
          { label: "Fee Platform (2.5%)", val: formatRupiah(totalFee), icon: "bx bx-percent", color: "var(--warning)" },
          { label: "Total Settlement", val: formatRupiah(totalSettlement), icon: "bx bx-transfer", color: "var(--primary)" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: `${s.color}18`, color: s.color }}><i className={s.icon} /></div>
            <div className="stat-value" style={{ fontSize: s.isNum ? "2rem" : "1.1rem" }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Settlement per Tenant */}
      <div className="product-card" style={{ cursor: "default", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "1rem" }}><i className="bx bx-store" style={{ color: "var(--primary)", marginRight: 6 }} />Settlement per Tenant</h3>
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Jumlah Order</th>
                <th>Pendapatan Kotor</th>
                <th>Fee (2.5%)</th>
                <th>Settlement Bersih</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {settlementPerTenant.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={t.foto} alt={t.nama} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }} />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 13 }}>{t.nama}</p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.kategori}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{t.jumlahOrder}</td>
                  <td style={{ fontWeight: 600 }}>{formatRupiah(t.pendapatan)}</td>
                  <td style={{ color: "var(--warning)", fontWeight: 500 }}>{formatRupiah(t.fee)}</td>
                  <td style={{ fontWeight: 700, color: "var(--success)", fontSize: 14 }}>{formatRupiah(t.settlement)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline">
                      <i className="bx bx-download" /> Unduh
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "var(--primary-light)", fontWeight: 700 }}>
                <td colSpan={2} style={{ color: "var(--primary)", paddingLeft: 16 }}>Total</td>
                <td>{formatRupiah(totalPendapatan)}</td>
                <td style={{ color: "var(--warning)" }}>{formatRupiah(totalFee)}</td>
                <td style={{ color: "var(--success)", fontSize: 15 }}>{formatRupiah(totalSettlement)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="product-card" style={{ cursor: "default", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "1rem" }}><i className="bx bx-bar-chart" style={{ color: "var(--primary)", marginRight: 6 }} />Grafik Pendapatan per Tenant</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 180, padding: "0 1rem" }}>
          {settlementPerTenant.map((t) => {
            const maxVal = Math.max(...settlementPerTenant.map((x) => x.pendapatan));
            const pct = maxVal ? (t.pendapatan / maxVal) * 100 : 0;
            return (
              <div key={t.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <p style={{ fontSize: 10, color: "var(--primary)", fontWeight: 700 }}>{formatRupiah(t.pendapatan).replace("Rp ", "Rp ").replace(".000", "K")}</p>
                <div style={{ width: "100%", height: `${pct}%`, background: "linear-gradient(180deg, #011F43, #6366f1)", borderRadius: "4px 4px 0 0", minHeight: 4, transition: "height 0.3s" }} />
                <p style={{ fontSize: 9, color: "var(--text-muted)", textAlign: "center", wordBreak: "break-word" }}>{t.nama.split(" ")[0]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Semua Transaksi */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>Detail Transaksi ({filteredOrders.length})</h3>
        <div className="info-alert"><i className="bx bx-info-circle" />Halaman {page} / {totalPages}</div>
      </div>
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Customer</th>
              <th>Tenant</th>
              <th>Total</th>
              <th>Metode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((o, i) => (
              <tr key={o.id}>
                <td style={{ color: "var(--text-muted)" }}>{(page - 1) * ITEMS_PER_PAGE + i + 1}</td>
                <td style={{ fontSize: 12.5 }}>{formatDate(o.waktu)}</td>
                <td style={{ fontWeight: 500 }}>{o.customer}</td>
                <td style={{ fontSize: 13, color: "var(--text-muted)" }}>{o.tenant}</td>
                <td style={{ fontWeight: 700 }}>{formatRupiah(o.total)}</td>
                <td>
                  <span className="badge badge-info" style={{ fontSize: 11 }}>
                    {o.metode === "nfc" ? "Kartu NFC" : o.metode === "qris" ? "QRIS" : "VA"}
                  </span>
                </td>
                <td>
                  <span className={`badge ${statusColor(o.status)}`}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: "1rem" }}>
          <button className="btn btn-sm btn-outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><i className="bx bx-chevron-left" /></button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pg = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
            return (
              <button key={pg} className={`btn btn-sm ${page === pg ? "btn-primary" : "btn-outline"}`} onClick={() => setPage(pg)}>{pg}</button>
            );
          })}
          <button className="btn btn-sm btn-outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><i className="bx bx-chevron-right" /></button>
        </div>
      )}

      {/* Modal PDF Preview */}
      {showPdfPreview && (
        <div className="modal-overlay" onClick={() => setShowPdfPreview(false)}>
          <div
            className="modal-box"
            style={{ maxWidth: pdfOrientation === "landscape" ? 860 : 560, width: "95vw" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-title">
                <i className="bx bx-file" style={{ color: "var(--primary)", marginRight: 6 }} />
                Preview PDF — {pdfOrientation === "landscape" ? "Landscape" : "Portrait"}
              </span>
              <button className="modal-close" onClick={() => setShowPdfPreview(false)}><i className="bx bx-x" /></button>
            </div>
            <div className="modal-body">
              {/* PDF Paper Simulation */}
              <div style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "1.5rem",
                fontFamily: "serif",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                aspectRatio: pdfOrientation === "landscape" ? "297/210" : "210/297",
                overflowY: "auto",
                maxHeight: 480,
              }}>
                {/* Kop Surat */}
                <div style={{ textAlign: "center", borderBottom: "2px solid #011F43", paddingBottom: "0.875rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 2 }}>
                    <img src="/logo.svg" alt="" style={{ height: 28, marginRight: 6 }} />
                    <span style={{ fontSize: 18, fontWeight: 800, color: "#011F43" }}>SrikanaGo</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#555" }}>SWK Srikana Food Walk — Universitas Airlangga</p>
                  <p style={{ fontSize: 11, color: "#777" }}>Jl. Dharmahusada No.3, Surabaya, Jawa Timur</p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>LAPORAN SETTLEMENT</p>
                    <p style={{ fontSize: 11, color: "#555" }}>Periode: {periodeOptions.find((p) => p.value === periode)?.label || "Kustom"}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 11, color: "#555" }}>Dicetak: {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
                    <p style={{ fontSize: 11, color: "#555" }}>Halaman: 1 / 1</p>
                  </div>
                </div>

                {/* Summary */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem", fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: "#011F43", color: "#fff" }}>
                      <th style={{ padding: "5px 8px", textAlign: "left" }}>Tenant</th>
                      <th style={{ padding: "5px 8px", textAlign: "right" }}>Order</th>
                      <th style={{ padding: "5px 8px", textAlign: "right" }}>Pendapatan</th>
                      <th style={{ padding: "5px 8px", textAlign: "right" }}>Fee (2.5%)</th>
                      <th style={{ padding: "5px 8px", textAlign: "right" }}>Settlement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settlementPerTenant.map((t, i) => (
                      <tr key={t.id} style={{ background: i % 2 === 0 ? "#f8f9fa" : "#fff" }}>
                        <td style={{ padding: "4px 8px" }}>{t.nama}</td>
                        <td style={{ padding: "4px 8px", textAlign: "right" }}>{t.jumlahOrder}</td>
                        <td style={{ padding: "4px 8px", textAlign: "right" }}>{formatRupiah(t.pendapatan)}</td>
                        <td style={{ padding: "4px 8px", textAlign: "right", color: "#b45309" }}>{formatRupiah(t.fee)}</td>
                        <td style={{ padding: "4px 8px", textAlign: "right", fontWeight: 700, color: "#15803d" }}>{formatRupiah(t.settlement)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#dbeafe", fontWeight: 700 }}>
                      <td style={{ padding: "5px 8px" }} colSpan={2}>TOTAL</td>
                      <td style={{ padding: "5px 8px", textAlign: "right" }}>{formatRupiah(totalPendapatan)}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", color: "#b45309" }}>{formatRupiah(totalFee)}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", color: "#15803d" }}>{formatRupiah(totalSettlement)}</td>
                    </tr>
                  </tfoot>
                </table>

                <p style={{ fontSize: 10, color: "#999", textAlign: "center", marginTop: "1rem" }}>
                  Dokumen ini digenerate secara otomatis oleh sistem SrikanaGo. Laporan ini merupakan rekap resmi untuk keperluan settlement kawasan.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowPdfPreview(false)}>Tutup</button>
              <button className="btn btn-primary"><i className="bx bx-download" /> Unduh PDF</button>
            </div>
          </div>
        </div>
      )}
    </PanelLayout>
  );
}
