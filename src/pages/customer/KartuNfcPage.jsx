import { useState } from "react";
import CustomerNavbar from "../../components/common/CustomerNavbar";
import { mockNfcCard, mockTransaksiSaldo } from "../../data/mockData";
import { formatRupiah, formatDateTime, statusColor } from "../../utils/helpers";

export default function KartuNfcPage() {
  const [card] = useState(mockNfcCard);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showScanNfc, setShowScanNfc] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scannedSerial, setScannedSerial] = useState("");
  const [nfcStatus, setNfcStatus] = useState("idle");

  const quickAmounts = [10000, 25000, 50000, 100000];

  const startNfcScan = async () => {
    setNfcStatus("scanning");
    if (!("NDEFReader" in window)) {
      await new Promise((r) => setTimeout(r, 2000));
      setScannedSerial("A1:B2:C3:D4");
      setNfcStatus("found");
      return;
    }
    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      ndef.onreading = ({ serialNumber }) => { setScannedSerial(serialNumber); setNfcStatus("found"); };
    } catch { setNfcStatus("error"); }
  };

  return (
    <div>
      <CustomerNavbar user="Ikhsan" />
      <div className="section-container" style={{ paddingTop: "2rem", maxWidth: 700 }}>
        <h1 className="page-title" style={{ marginBottom: "1.5rem" }}><i className="bx bx-credit-card" /> Kartu Cashless Srikana</h1>

        {/* Visual Kartu */}
        <div className="animate-fadein" style={{ background: "linear-gradient(135deg, #011F43 0%, #6366f1 100%)", borderRadius: 20, padding: "2rem", color: "#fff", marginBottom: "1.5rem", boxShadow: "0 20px 40px rgba(1,31,67,0.35)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, background: "rgba(255,255,255,0.07)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: -40, left: -20, width: 120, height: 120, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, letterSpacing: 0.5 }}>
              <img src="/logo.svg" alt="" style={{ height: 24, filter: "brightness(0) invert(1)" }} />
              SrikanaGo
            </div>
            <i className="bx bx-chip" style={{ fontSize: 32, opacity: 0.9 }} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Saldo</p>
            <p style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: -0.5 }}>{formatRupiah(card.saldo)}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>Serial Number</p>
              <p style={{ fontFamily: "monospace", fontSize: 14, letterSpacing: 2 }}>{card.serial_number}</p>
            </div>
            <span className="badge badge-success" style={{ background: "rgba(22,163,74,0.2)", color: "#86efac" }}>{card.status}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.5rem" }}>
          <button className="btn btn-primary btn-lg" onClick={() => setShowTopUp(true)}>
            <i className="bx bx-plus-circle" /> Top-Up Saldo
          </button>
          <button className="btn btn-outline btn-lg" onClick={() => setShowScanNfc(true)}>
            <i className="bx bx-wifi" /> Daftarkan Kartu Baru
          </button>
        </div>

        {/* Riwayat Transaksi */}
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "0.875rem" }}>Riwayat Transaksi</h3>
        <div className="table-container">
          <table className="modern-table">
            <thead><tr><th>Tanggal</th><th>Jenis</th><th>Nominal</th><th>Saldo Akhir</th></tr></thead>
            <tbody>
              {mockTransaksiSaldo.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontSize: 12.5 }}>{formatDateTime(t.created_at)}</td>
                  <td><span className={`badge ${statusColor(t.jenis)}`}>{t.jenis.charAt(0).toUpperCase() + t.jenis.slice(1)}</span></td>
                  <td style={{ fontWeight: 600, color: t.jenis === "bayar" ? "var(--danger)" : "var(--success)" }}>
                    {t.jenis === "bayar" ? "-" : "+"}{formatRupiah(t.nominal)}
                  </td>
                  <td style={{ fontWeight: 500 }}>{formatRupiah(t.saldo_akhir)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Top-Up */}
        {showTopUp && (
          <div className="modal-overlay" onClick={() => setShowTopUp(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title"><i className="bx bx-plus-circle" style={{ color: "var(--primary)", marginRight: 6 }} />Top-Up Saldo</span>
                <button className="modal-close" onClick={() => setShowTopUp(false)}><i className="bx bx-x" /></button>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: "1rem" }}>Saldo saat ini: <strong>{formatRupiah(card.saldo)}</strong></p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1rem" }}>
                  {quickAmounts.map((a) => (
                    <button key={a} className={`btn btn-sm${topUpAmount === a ? " btn-primary" : " btn-outline"}`} onClick={() => setTopUpAmount(a)}>
                      {formatRupiah(a)}
                    </button>
                  ))}
                </div>
                <div className="form-group"><label className="form-label">Nominal Lain</label><input type="number" className="form-input" placeholder="Rp 0" value={topUpAmount || ""} onChange={(e) => setTopUpAmount(Number(e.target.value))} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: "1rem" }}>
                  <button className="btn btn-outline" onClick={() => setShowTopUp(false)}><i className="bx bx-bank" /> Virtual Account</button>
                  <button className="btn btn-primary" onClick={() => setShowTopUp(false)}><i className="bx bx-qr" /> QRIS</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Scan NFC */}
        {showScanNfc && (
          <div className="modal-overlay" onClick={() => { setShowScanNfc(false); setNfcStatus("idle"); }}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title"><i className="bx bx-wifi" style={{ color: "var(--primary)", marginRight: 6 }} />Daftarkan Kartu NFC</span>
                <button className="modal-close" onClick={() => { setShowScanNfc(false); setNfcStatus("idle"); }}><i className="bx bx-x" /></button>
              </div>
              <div className="modal-body" style={{ textAlign: "center" }}>
                {nfcStatus === "idle" && (
                  <>
                    <i className="bx bx-wifi" style={{ fontSize: 60, color: "var(--primary)", margin: "1rem 0" }} />
                    <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: 14 }}>Siapkan kartu NFC Anda dan dekatkan ke bagian belakang HP (Android Chrome ≥ 89)</p>
                    <button className="btn btn-primary btn-lg" onClick={startNfcScan}><i className="bx bx-scan" /> Mulai Scan NFC</button>
                    <div className="alert alert-warning" style={{ marginTop: "1rem", textAlign: "left" }}>
                      <i className="bx bx-info-circle" /> Fitur ini hanya berfungsi di <strong>Android Chrome ≥ 89</strong> via HTTPS
                    </div>
                  </>
                )}
                {nfcStatus === "scanning" && (
                  <>
                    <i className="bx bx-loader" style={{ fontSize: 60, color: "var(--primary)", animation: "spin 2s linear infinite", margin: "1rem 0" }} />
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>Menunggu kartu NFC...</p>
                    <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Dekatkan kartu ke belakang HP</p>
                  </>
                )}
                {nfcStatus === "found" && (
                  <>
                    <i className="bx bx-check-circle" style={{ fontSize: 48, color: "var(--success)", margin: "1rem 0" }} />
                    <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Kartu Terdeteksi!</p>
                    <p style={{ fontFamily: "monospace", fontSize: 16, color: "var(--primary)", letterSpacing: 2, marginBottom: "1.5rem" }}>{scannedSerial}</p>
                    <button className="btn btn-primary btn-full" onClick={() => { setShowScanNfc(false); setNfcStatus("idle"); }}>
                      <i className="bx bx-check" /> Simpan & Daftarkan
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
