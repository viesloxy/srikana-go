import { useState, useEffect, useRef } from "react";
import PanelLayout from "../../components/common/PanelLayout";
import { mockOrders, mockMenus } from "../../data/mockData";
import { formatRupiah, formatDateTime } from "../../utils/helpers";

const SCAN_DELAY = 2000;

export default function ScanQrPage() {
  const [mode, setMode] = useState("qr");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [pesananData, setPesananData] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle");
  const timerRef = useRef(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  function startScan() {
    setScanning(true);
    setScanResult(null);
    setPesananData(null);
    setMenuData(null);
    setScanStatus("scanning");

    timerRef.current = setTimeout(() => {
      if (mode === "qr") {
        const order = mockOrders[0];
        setScanResult(order.id);
        setPesananData(order);
      } else {
        const menu = mockMenus[0];
        setScanResult(menu.id_menu);
        setMenuData(menu);
      }
      setScanning(false);
      setScanStatus("success");
    }, SCAN_DELAY);
  }

  function stopScan() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setScanning(false);
    setScanStatus("idle");
  }

  function resetScan() {
    setScanResult(null);
    setPesananData(null);
    setMenuData(null);
    setScanStatus("idle");
    setScanning(false);
  }

  function handleModeChange(m) {
    resetScan();
    setMode(m);
  }

  function handleTandaiDiambil() {
    setScanStatus("marked");
    setTimeout(() => resetScan(), 1200);
  }

  return (
    <PanelLayout role="tenant">
      <div className="animate-fadein">
        <div className="page-header">
          <h1 className="page-title">
            <i className="bx bx-qr-scan" /> Scan QR / Barcode
          </h1>
        </div>

        {/* Mode Toggle */}
        <div className="tab-pills" style={{ marginBottom: "1.5rem" }}>
          <button
            className={`tab-pill ${mode === "qr" ? "active" : ""}`}
            onClick={() => handleModeChange("qr")}
          >
            <i className="bx bx-qr" /> QR Pesanan
          </button>
          <button
            className={`tab-pill ${mode === "barcode" ? "active" : ""}`}
            onClick={() => handleModeChange("barcode")}
          >
            <i className="bx bx-barcode" /> Barcode Menu
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "flex-start" }}>
          {/* Scanner Box */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            {/* Camera Viewport */}
            <div
              style={{
                width: 300,
                height: 300,
                background: "#111",
                borderRadius: 16,
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
              }}
            >
              {/* Corner guides */}
              {[
                { top: 16, left: 16, borderTop: "3px solid", borderLeft: "3px solid" },
                { top: 16, right: 16, borderTop: "3px solid", borderRight: "3px solid" },
                { bottom: 16, left: 16, borderBottom: "3px solid", borderLeft: "3px solid" },
                { bottom: 16, right: 16, borderBottom: "3px solid", borderRight: "3px solid" },
              ].map((style, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 28,
                    height: 28,
                    borderColor: mode === "qr" ? "#ef4444" : "#011F43",
                    ...style,
                  }}
                />
              ))}

              {/* Scan line animation */}
              {scanning && (
                <div
                  style={{
                    position: "absolute",
                    left: 20,
                    right: 20,
                    height: 2,
                    background: mode === "qr" ? "#ef4444" : "var(--primary)",
                    boxShadow: `0 0 8px ${mode === "qr" ? "#ef4444" : "var(--primary)"}`,
                    animation: "scanLine 1.5s ease-in-out infinite alternate",
                    top: "50%",
                  }}
                />
              )}

              <style>{`
                @keyframes scanLine {
                  from { transform: translateY(-100px); }
                  to   { transform: translateY(100px); }
                }
              `}</style>

              {/* Status Center */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {scanStatus === "idle" && (
                  <div style={{ textAlign: "center", color: "#888" }}>
                    <i className="bx bx-qr-scan" style={{ fontSize: 40, display: "block", marginBottom: 8 }} />
                    <span style={{ fontSize: 12 }}>Siap untuk scan</span>
                  </div>
                )}
                {scanStatus === "scanning" && (
                  <div style={{ textAlign: "center", color: "#fff" }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        border: "3px solid rgba(255,255,255,0.2)",
                        borderTop: "3px solid #fff",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        margin: "0 auto 8px",
                      }}
                    />
                    <span style={{ fontSize: 12 }}>Mendeteksi...</span>
                  </div>
                )}
                {scanStatus === "success" && (
                  <div style={{ textAlign: "center", color: "#4ade80" }}>
                    <i className="bx bx-check-circle" style={{ fontSize: 44, display: "block", marginBottom: 6 }} />
                    <span style={{ fontSize: 12 }}>Berhasil!</span>
                  </div>
                )}
                {scanStatus === "marked" && (
                  <div style={{ textAlign: "center", color: "#4ade80" }}>
                    <i className="bx bx-badge-check" style={{ fontSize: 44, display: "block", marginBottom: 6 }} />
                    <span style={{ fontSize: 12 }}>Tandai berhasil!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Scan Controls */}
            <div style={{ display: "flex", gap: 10 }}>
              {!scanning && scanStatus === "idle" && (
                <button className="btn btn-primary" onClick={startScan}>
                  <i className="bx bx-play" /> Start Scan
                </button>
              )}
              {scanning && (
                <button className="btn btn-danger" onClick={stopScan}>
                  <i className="bx bx-stop" /> Stop Scan
                </button>
              )}
              {scanResult && (
                <button className="btn btn-outline" onClick={resetScan}>
                  <i className="bx bx-refresh" /> Scan Berikutnya
                </button>
              )}
            </div>

            <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
              {mode === "qr"
                ? "Arahkan kamera ke QR Code pesanan pelanggan"
                : "Arahkan kamera ke barcode label harga menu"}
            </p>
          </div>

          {/* Result Panel */}
          <div>
            {!scanResult && (
              <div
                style={{
                  background: "var(--bg)",
                  borderRadius: 14,
                  border: "1.5px dashed var(--border)",
                  padding: "3rem 2rem",
                  textAlign: "center",
                  color: "var(--text-muted)",
                }}
              >
                <i className="bx bx-qr-scan" style={{ fontSize: 48, opacity: 0.3, display: "block", marginBottom: 12 }} />
                <p style={{ fontSize: 14 }}>Hasil scan akan muncul di sini</p>
                <p style={{ fontSize: 12, marginTop: 6 }}>
                  Mode: <strong>{mode === "qr" ? "QR Pesanan" : "Barcode Menu"}</strong>
                </p>
              </div>
            )}

            {/* Mode QR: Hasil pesanan */}
            {scanResult && mode === "qr" && pesananData && (
              <div className="animate-slideUp" style={{ background: "var(--bg)", borderRadius: 14, border: "1px solid var(--border-card)", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", background: "var(--primary-light)", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <i className="bx bx-receipt" style={{ color: "var(--primary)", fontSize: 20 }} />
                    <span style={{ fontWeight: 600, color: "var(--primary)", fontSize: 14 }}>Detail Pesanan</span>
                  </div>
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    {[
                      { label: "ID Pesanan", value: pesananData.id },
                      { label: "Tenant", value: pesananData.tenant },
                      { label: "Customer", value: pesananData.customer },
                      { label: "Metode Bayar", value: pesananData.metode_bayar?.toUpperCase() || "-" },
                      { label: "Status Bayar", value: pesananData.status_bayar },
                      { label: "No. Antrian", value: `#${pesananData.nomor_antrian}` },
                    ].map((info, i) => (
                      <div key={i}>
                        <p style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{info.label}</p>
                        <p style={{ fontSize: 13.5, fontWeight: 600 }}>{info.value}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: "var(--bg-muted)", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                    <p style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>Item Pesanan:</p>
                    {pesananData.items?.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                        <span>{item.nama} ×{item.qty}</span>
                        <span style={{ fontWeight: 600 }}>{formatRupiah(item.subtotal)}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid var(--border)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                      <span>Total</span>
                      <span style={{ color: "var(--primary)" }}>{formatRupiah(pesananData.total)}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
                    Waktu: {formatDateTime(pesananData.created_at)}
                  </p>

                  <button className="btn btn-primary btn-full" onClick={handleTandaiDiambil}>
                    <i className="bx bx-check-circle" /> Tandai Sudah Diambil
                  </button>
                </div>
              </div>
            )}

            {/* Mode Barcode: Hasil menu */}
            {scanResult && mode === "barcode" && menuData && (
              <div className="animate-slideUp" style={{ background: "var(--bg)", borderRadius: 14, border: "1px solid var(--border-card)", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", background: "var(--primary-light)", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <i className="bx bx-barcode" style={{ color: "var(--primary)", fontSize: 20 }} />
                    <span style={{ fontWeight: 600, color: "var(--primary)", fontSize: 14 }}>Info Menu</span>
                  </div>
                </div>
                <div style={{ padding: "16px 18px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <img
                    src={menuData.foto}
                    alt={menuData.nama}
                    style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 10, border: "1px solid var(--border)" }}
                    onError={(e) => { e.target.src = "https://placehold.co/90x90?text=No+Img"; }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, fontFamily: "monospace", background: "var(--bg-muted)", display: "inline-block", padding: "1px 7px", borderRadius: 4, marginBottom: 6 }}>
                      {menuData.id_menu}
                    </p>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{menuData.nama}</h3>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <span className="badge badge-primary">{menuData.kategori}</span>
                      <span className={`badge ${menuData.tersedia ? "badge-success" : "badge-muted"}`}>
                        {menuData.tersedia ? "Tersedia" : "Habis"}
                      </span>
                    </div>
                    <p style={{ fontSize: 20, fontWeight: 700, color: "var(--primary)" }}>
                      {formatRupiah(menuData.harga)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
