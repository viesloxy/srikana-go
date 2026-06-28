import { useState } from "react";
import { Link } from "react-router-dom";
import CustomerNavbar from "../../components/common/CustomerNavbar";
import { mockTenants } from "../../data/mockData";
import { haversine } from "../../utils/helpers";

const BASE_THRESHOLD = 100;

export default function VerifikasiLokasiPage() {
  const [step, setStep] = useState(1);
  const [scannedTenant, setScannedTenant] = useState(null);
  const [manualCode, setManualCode] = useState("");
  const [userPos, setUserPos] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [loadingGps, setLoadingGps] = useState(false);
  const [gpsProgress, setGpsProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleScan = (code) => {
    const tenant = mockTenants.find((t) => t.barcode === code || `TN-00${t.id}` === code);
    if (tenant) { setScannedTenant(tenant); setStep(2); getGps(tenant); }
    else alert("Barcode tenant tidak ditemukan");
  };

  const getGps = (tenant) => {
    setLoadingGps(true);
    setGpsProgress(0);
    const interval = setInterval(() => setGpsProgress((p) => Math.min(p + 12, 90)), 500);
    if (!navigator.geolocation) {
      clearInterval(interval);
      setLoadingGps(false);
      simulateResult(tenant, -7.2660, 112.7523, 15);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearInterval(interval);
        setGpsProgress(100);
        setLoadingGps(false);
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setAccuracy(Math.round(pos.coords.accuracy));
        computeResult(tenant, pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
      },
      () => {
        clearInterval(interval);
        setLoadingGps(false);
        simulateResult(tenant, -7.2658, 112.7522, 12);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const simulateResult = (tenant, lat, lng, acc) => {
    setUserPos({ lat, lng });
    setAccuracy(acc);
    computeResult(tenant, lat, lng, acc);
  };

  const computeResult = (tenant, lat, lng, acc) => {
    const dist = haversine(lat, lng, tenant.latitude, tenant.longitude);
    const threshold = BASE_THRESHOLD + tenant.accuracy + Math.round(acc);
    setResult({ distance: dist, threshold, accepted: dist <= threshold });
    setStep(3);
  };

  return (
    <div>
      <CustomerNavbar user="Ikhsan" />
      <div className="section-container" style={{ paddingTop: "2rem", maxWidth: 640 }}>
        <h1 className="page-title" style={{ marginBottom: "0.5rem" }}><i className="bx bx-map-pin" /> Verifikasi Lokasi</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 13.5, marginBottom: "1.75rem" }}>Konfirmasi kehadiran Anda di kawasan SWK Srikana Food Walk</p>

        {/* Stepper */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
          {[{ n: 1, label: "Scan Barcode" }, { n: 2, label: "Ambil GPS" }, { n: 3, label: "Hasil" }].map((s, i) => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : undefined }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: step >= s.n ? "var(--primary)" : "#e5e5e5", color: step >= s.n ? "#fff" : "#aaa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, transition: "all 0.3s" }}>
                  {step > s.n ? <i className="bx bx-check" /> : s.n}
                </div>
                <span style={{ fontSize: 11, color: step >= s.n ? "var(--primary)" : "var(--text-muted)", fontWeight: step === s.n ? 600 : 400 }}>{s.label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: step > s.n ? "var(--primary)" : "#e5e5e5", margin: "0 8px", marginBottom: 18, transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>

        {/* Step 1: Scan Barcode */}
        {step === 1 && (
          <div className="product-card animate-fadein" style={{ cursor: "default" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "1.25rem" }}>
              <i className="bx bx-scan" style={{ color: "var(--primary)", marginRight: 6 }} />Langkah 1: Scan Barcode Tenant
            </h3>
            {/* Simulated scanner */}
            <div style={{ background: "#111", borderRadius: 12, height: 240, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", marginBottom: "1rem" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 1px, transparent 0, transparent 50%)", backgroundSize: "100% 4px" }} />
              <div style={{ width: 180, height: 180, position: "relative" }}>
                {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
                  <div key={pos} style={{ position: "absolute", width: 20, height: 20, borderColor: "#011F43", borderStyle: "solid", borderWidth: 0, ...(pos.includes("top") ? { top: 0, borderTopWidth: 3 } : { bottom: 0, borderBottomWidth: 3 }), ...(pos.includes("left") ? { left: 0, borderLeftWidth: 3 } : { right: 0, borderRightWidth: 3 }) }} />
                ))}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="bx bx-scan" style={{ fontSize: 48, color: "rgba(1,31,67,0.8)" }} />
                </div>
              </div>
              <div style={{ position: "absolute", bottom: 12, color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Arahkan ke barcode tenant</div>
            </div>

            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: "1rem" }}>Scan barcode yang tertempel di meja atau loket tenant</p>

            <div className="divider">atau masukkan kode manual</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
              <input className="form-input" placeholder="Kode tenant (mis. TN-001)" value={manualCode} onChange={(e) => setManualCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleScan(manualCode)} />
              <button className="btn btn-primary" onClick={() => handleScan(manualCode)}><i className="bx bx-check" /></button>
            </div>

            <div style={{ marginTop: "0.875rem" }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Tenant tersedia (demo):</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {mockTenants.slice(0, 4).map((t) => (
                  <button key={t.id} className="btn btn-sm btn-outline" onClick={() => handleScan(t.barcode)}>{t.barcode} – {t.nama}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: GPS */}
        {step === 2 && (
          <div className="product-card animate-fadein" style={{ cursor: "default" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "1.25rem" }}>
              <i className="bx bx-current-location" style={{ color: "var(--primary)", marginRight: 6 }} />Langkah 2: Mengambil Posisi GPS
            </h3>
            {scannedTenant && (
              <div className="alert alert-info" style={{ marginBottom: "1rem" }}>
                <i className="bx bx-store" /> Tenant: <strong>{scannedTenant.nama}</strong>
              </div>
            )}
            {loadingGps && (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <i className="bx bx-map-pin" style={{ fontSize: 48, color: "var(--primary)", marginBottom: "0.875rem" }} />
                <p style={{ fontWeight: 600, marginBottom: 8 }}>Mencari posisi terbaik...</p>
                <div style={{ background: "#e5e5e5", borderRadius: 999, height: 8, overflow: "hidden", maxWidth: 300, margin: "0 auto" }}>
                  <div style={{ height: "100%", background: "var(--primary)", borderRadius: 999, width: `${gpsProgress}%`, transition: "width 0.4s ease" }} />
                </div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>Memilih akurasi GPS terbaik</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && result && (
          <div className={`product-card animate-fadein ${result.accepted ? "" : ""}`} style={{ cursor: "default", border: `2px solid ${result.accepted ? "var(--success)" : "var(--danger)"}` }}>
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              {result.accepted
                ? <i className="bx bx-check-circle" style={{ fontSize: 60, color: "var(--success)" }} />
                : <i className="bx bx-x-circle" style={{ fontSize: 60, color: "var(--danger)" }} />
              }
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: result.accepted ? "var(--success)" : "var(--danger)" }}>
                {result.accepted ? "DITERIMA" : "DILUAR AREA"}
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.6 }}>
                {result.accepted
                  ? `Anda berada di kawasan Srikana (jarak: ${result.distance}m dari ${scannedTenant?.nama})`
                  : `Anda terlalu jauh dari ${scannedTenant?.nama}. Silakan datang ke kawasan Srikana secara fisik.`
                }
              </p>
            </div>

            <div style={{ background: "var(--bg-muted)", borderRadius: 10, padding: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "center" }}>
              <div><p style={{ fontSize: 12, color: "var(--text-muted)" }}>Jarak Terukur</p><p style={{ fontWeight: 700, fontSize: 18, color: result.accepted ? "var(--success)" : "var(--danger)" }}>{result.distance}m</p></div>
              <div><p style={{ fontSize: 12, color: "var(--text-muted)" }}>Threshold Efektif</p><p style={{ fontWeight: 700, fontSize: 18 }}>{result.threshold}m</p></div>
              {userPos && <><div><p style={{ fontSize: 12, color: "var(--text-muted)" }}>Posisi GPS</p><p style={{ fontFamily: "monospace", fontSize: 11 }}>{userPos.lat.toFixed(6)}</p></div><div><p style={{ fontSize: 12, color: "var(--text-muted)" }}>Akurasi</p><p style={{ fontWeight: 600 }}>±{accuracy}m</p></div></>}
            </div>

            <div style={{ marginTop: "1.25rem", display: "flex", gap: 10, flexWrap: "wrap" }}>
              {result.accepted ? (
                <Link to="/cart" style={{ flex: 1 }}>
                  <button className="btn btn-primary btn-full btn-lg"><i className="bx bx-cart" /> Lanjut ke Keranjang</button>
                </Link>
              ) : (
                <button className="btn btn-outline btn-full" onClick={() => { setStep(1); setResult(null); setScannedTenant(null); }}>
                  <i className="bx bx-refresh" /> Coba Lagi
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
