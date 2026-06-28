import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomerNavbar from "../../components/common/CustomerNavbar";
import { mockAntrian } from "../../data/mockData";
import { statusColor } from "../../utils/helpers";

const MY_NUMBER = 132;

export default function StatusAntrianPage() {
  const [queue, setQueue] = useState(mockAntrian);
  const [calledNumber, setCalledNumber] = useState(131);
  const [connected, setConnected] = useState(true);
  const [animating, setAnimating] = useState(false);

  const myItem = queue.find((q) => q.nomor_antrian === MY_NUMBER);
  const beforeMe = queue.filter((q) => q.nomor_antrian < MY_NUMBER && q.status === "menunggu").length;

  // Simulate SSE
  useEffect(() => {
    const timer = setTimeout(() => {
      setCalledNumber(132);
      setAnimating(true);
      setQueue((prev) => prev.map((q) => q.nomor_antrian === 131 ? { ...q, status: "diambil" } : q.nomor_antrian === 132 ? { ...q, status: "dipanggil" } : q));
      setTimeout(() => setAnimating(false), 1500);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const isMyCalled = calledNumber === MY_NUMBER;

  const statusLabel = { menunggu: "Menunggu", dipanggil: "Dipanggil", diambil: "Diambil", terlewat: "Terlewat" };

  return (
    <div>
      <CustomerNavbar user="Ikhsan" />
      <div className="section-container" style={{ paddingTop: "2rem", maxWidth: 700 }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 className="page-title"><i className="bx bx-list-ol" /> Status Antrian</h1>
          <div className={`live-badge${connected ? "" : " disconnected"}`}>
            <span className="live-dot" />
            {connected ? "Live" : "Reconnecting..."}
          </div>
        </div>

        {/* Card Nomor Saya */}
        <div className={`product-card animate-fadein ${isMyCalled ? "animate-pulse" : ""}`} style={{ cursor: "default", border: isMyCalled ? "3px solid #16a34a" : "1px solid var(--border-card)", background: isMyCalled ? "#dcfce7" : "#fff", transition: "all 0.5s" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Nomor Antrian Anda</p>
            <div style={{ fontSize: "4.5rem", fontWeight: 900, color: isMyCalled ? "#16a34a" : "var(--primary)", lineHeight: 1, animation: animating ? "scaleBounce 0.6s ease" : "none" }}>
              #{MY_NUMBER}
            </div>
            <p style={{ marginTop: 6, fontWeight: 600, fontSize: 15 }}>Muhammad Ikhsan</p>
            {isMyCalled && (
              <div className="alert alert-success" style={{ justifyContent: "center", marginTop: "1rem", animation: "fadeInUp 0.4s ease" }}>
                <i className="bx bx-party" style={{ marginRight: 4 }} /> Giliran Anda! Segera ambil pesanan.
              </div>
            )}
          </div>

          <div style={{ borderTop: "1.5px dashed #e5e5e5", paddingTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "center" }}>
            <div>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Sedang Dipanggil</p>
              <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "#16a34a" }}>#{calledNumber}</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Sebelum Anda</p>
              <p style={{ fontSize: "1.75rem", fontWeight: 800, color: beforeMe > 0 ? "var(--primary)" : "#16a34a" }}>
                {beforeMe}
              </p>
              <p style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{beforeMe > 0 ? `~${beforeMe * 2} menit` : "Giliran berikutnya!"}</p>
            </div>
          </div>
        </div>

        {/* Daftar Antrian */}
        <div style={{ marginTop: "1.5rem" }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: "0.875rem" }}>Antrian Saat Ini</h3>
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr><th>No.</th><th>Nama</th><th>Tenant</th><th>Status</th></tr>
              </thead>
              <tbody>
                {queue.map((q) => (
                  <tr key={q.id} style={{ background: q.nomor_antrian === MY_NUMBER ? "var(--primary-light)" : undefined }}>
                    <td style={{ fontWeight: 700, fontSize: 15, color: q.nomor_antrian === MY_NUMBER ? "var(--primary)" : "#333" }}>
                      #{q.nomor_antrian}
                      {q.nomor_antrian === MY_NUMBER && <span style={{ fontSize: 10, background: "var(--primary)", color: "#fff", padding: "1px 6px", borderRadius: 4, marginLeft: 6 }}>ANDA</span>}
                    </td>
                    <td style={{ fontWeight: q.nomor_antrian === MY_NUMBER ? 600 : 400 }}>{q.nama}</td>
                    <td style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{q.tenant}</td>
                    <td>
                      <span className={`badge ${statusColor(q.status)}`}>{statusLabel[q.status]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: "1.5rem", flexWrap: "wrap" }}>
          <button className="btn btn-outline" onClick={() => Notification.requestPermission()}>
            <i className="bx bx-bell" /> Aktifkan Notifikasi
          </button>
          <Link to="/order/132/confirm">
            <button className="btn btn-outline"><i className="bx bx-receipt" /> Lihat Detail Pesanan</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
