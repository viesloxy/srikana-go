import { useState } from "react";
import PanelLayout from "../../components/common/PanelLayout";
import { mockTenants } from "../../data/mockData";

const BASE_THRESHOLD = 100;

export default function GeofencePage() {
  const [tenants, setTenants] = useState(
    mockTenants.map((t) => ({ ...t, geofenceActive: true }))
  );
  const [globalThreshold, setGlobalThreshold] = useState(BASE_THRESHOLD);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [testModal, setTestModal] = useState(null);
  const [testLat, setTestLat] = useState("");
  const [testLng, setTestLng] = useState("");
  const [testResult, setTestResult] = useState(null);

  const haversine = (lat1, lng1, lat2, lng2) => {
    const R = 6371000;
    const toRad = (x) => (x * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const openEdit = (t) => {
    setEditingId(t.id);
    setEditForm({ latitude: t.latitude, longitude: t.longitude, accuracy: t.accuracy, geofenceActive: t.geofenceActive });
  };

  const saveEdit = () => {
    setTenants((prev) => prev.map((t) => t.id === editingId ? { ...t, ...editForm, latitude: parseFloat(editForm.latitude), longitude: parseFloat(editForm.longitude), accuracy: parseInt(editForm.accuracy) } : t));
    setEditingId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleGeofence = (id) => {
    setTenants((prev) => prev.map((t) => t.id === id ? { ...t, geofenceActive: !t.geofenceActive } : t));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation tidak didukung");
    navigator.geolocation.getCurrentPosition(
      (pos) => setEditForm((f) => ({ ...f, latitude: pos.coords.latitude.toFixed(7), longitude: pos.coords.longitude.toFixed(7) })),
      () => alert("Gagal mendapatkan lokasi"),
      { enableHighAccuracy: true }
    );
  };

  const runTest = () => {
    if (!testModal || !testLat || !testLng) return;
    const lat = parseFloat(testLat);
    const lng = parseFloat(testLng);
    const tenant = tenants.find((t) => t.id === testModal.id);
    const dist = haversine(lat, lng, tenant.latitude, tenant.longitude);
    const threshold = globalThreshold + tenant.accuracy;
    setTestResult({ distance: dist, threshold, accepted: dist <= threshold });
  };

  return (
    <PanelLayout role="pengelola" userName="Pengelola">
      <div className="page-header">
        <h1 className="page-title"><i className="bx bx-map-pin" /> Pengaturan Geofence</h1>
      </div>

      {saved && <div className="alert alert-success" style={{ marginBottom: "1rem" }}><i className="bx bx-check-circle" /> Perubahan berhasil disimpan!</div>}

      {/* Global Settings */}
      <div className="product-card" style={{ cursor: "default", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "1rem" }}><i className="bx bx-cog" style={{ color: "var(--primary)", marginRight: 6 }} />Pengaturan Global</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Threshold Dasar (meter)</label>
            <input
              type="number"
              className="form-input"
              value={globalThreshold}
              min={10}
              max={500}
              onChange={(e) => setGlobalThreshold(Number(e.target.value))}
            />
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
              Threshold efektif = threshold dasar + akurasi GPS tenant + akurasi GPS user
            </p>
          </div>
          <div className="alert alert-info" style={{ alignSelf: "center" }}>
            <i className="bx bx-info-circle" />
            <div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>Cara kerja geofence:</p>
              <p style={{ fontSize: 12, lineHeight: 1.6 }}>Customer harus berada dalam radius <strong>{globalThreshold}m + akurasi tenant + akurasi GPS</strong> dari tenant. Verifikasi dilakukan saat checkout.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Geofence Table */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Koordinat Pusat</th>
              <th>Akurasi Tambahan</th>
              <th>Threshold Efektif</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={t.foto} alt={t.nama} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 13.5 }}>{t.nama}</p>
                      <p style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{t.kategori}</p>
                    </div>
                  </div>
                </td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>
                  {editingId === t.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <input className="form-input" style={{ fontSize: 12, padding: "4px 8px" }} value={editForm.latitude} onChange={(e) => setEditForm((f) => ({ ...f, latitude: e.target.value }))} placeholder="Latitude" />
                      <input className="form-input" style={{ fontSize: 12, padding: "4px 8px" }} value={editForm.longitude} onChange={(e) => setEditForm((f) => ({ ...f, longitude: e.target.value }))} placeholder="Longitude" />
                      <button className="btn btn-sm btn-outline" style={{ fontSize: 11 }} onClick={useCurrentLocation}><i className="bx bx-current-location" /> Lokasi Saya</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ color: "var(--primary)" }}>{t.latitude.toFixed(6)}</div>
                      <div style={{ color: "var(--text-muted)" }}>{t.longitude.toFixed(6)}</div>
                    </>
                  )}
                </td>
                <td>
                  {editingId === t.id ? (
                    <input type="number" className="form-input" style={{ width: 80, fontSize: 12, padding: "4px 8px" }} value={editForm.accuracy} onChange={(e) => setEditForm((f) => ({ ...f, accuracy: e.target.value }))} />
                  ) : (
                    <span style={{ fontWeight: 600 }}>±{t.accuracy}m</span>
                  )}
                </td>
                <td>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "var(--primary)" }}>~{globalThreshold + t.accuracy}m</span>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>+ akurasi GPS user</p>
                </td>
                <td>
                  {editingId === t.id ? (
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                      <input type="checkbox" checked={editForm.geofenceActive} onChange={(e) => setEditForm((f) => ({ ...f, geofenceActive: e.target.checked }))} />
                      Aktif
                    </label>
                  ) : (
                    <span className={`badge ${t.geofenceActive ? "badge-success" : "badge-muted"}`}>
                      {t.geofenceActive ? "Aktif" : "Nonaktif"}
                    </span>
                  )}
                </td>
                <td>
                  {editingId === t.id ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-sm btn-primary" onClick={saveEdit}><i className="bx bx-save" /> Simpan</button>
                      <button className="btn btn-sm btn-outline" onClick={() => setEditingId(null)}>Batal</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(t)}><i className="bx bx-edit" /> Edit</button>
                      <button className="btn btn-sm btn-outline" onClick={() => { setTestModal(t); setTestResult(null); setTestLat(""); setTestLng(""); }}>
                        <i className="bx bx-test-tube" /> Test
                      </button>
                      <button className={`btn btn-sm ${t.geofenceActive ? "btn-outline-danger" : "btn-outline"}`} onClick={() => toggleGeofence(t.id)}>
                        <i className={`bx ${t.geofenceActive ? "bx-pause" : "bx-play"}`} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Map Visualization */}
      <div className="product-card" style={{ cursor: "default", marginTop: "1.5rem" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "1rem" }}><i className="bx bx-map" style={{ color: "var(--primary)", marginRight: 6 }} />Visualisasi Peta (Simulasi)</h3>
        <div style={{ background: "#e8f4f8", borderRadius: 12, height: 320, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", border: "1.5px solid var(--border-card)" }}>
          {/* Simulated map grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(1,31,67,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(1,31,67,0.08) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div style={{ textAlign: "center", zIndex: 1 }}>
            <i className="bx bx-map-alt" style={{ fontSize: 48, color: "var(--primary)", opacity: 0.5 }} />
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 8 }}>Integrasi Google Maps / Leaflet.js</p>
            <p style={{ color: "var(--text-muted)", fontSize: 12 }}>Visualisasi radius geofence per tenant</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
              {tenants.slice(0, 4).map((t) => (
                <div key={t.id} style={{ fontSize: 11, background: "#fff", border: "1px solid var(--border-card)", borderRadius: 6, padding: "3px 8px", color: "var(--primary)", fontWeight: 500, display: "flex", alignItems: "center" }}>
                  <i className="bx bx-map-pin" style={{ marginRight: 4 }} />{t.nama}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>Kawasan SWK Srikana Food Walk — koordinat pusat: -7.2660, 112.7523</p>
      </div>

      {/* Modal Test Geofence */}
      {testModal && (
        <div className="modal-overlay" onClick={() => setTestModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title"><i className="bx bx-test-tube" style={{ color: "var(--primary)", marginRight: 6 }} />Test Geofence — {testModal.nama}</span>
              <button className="modal-close" onClick={() => setTestModal(null)}><i className="bx bx-x" /></button>
            </div>
            <div className="modal-body">
              <div className="alert alert-info" style={{ marginBottom: "1rem" }}>
                <i className="bx bx-map-pin" />
                <div>
                  <p>Pusat tenant: <strong style={{ fontFamily: "monospace" }}>{testModal.latitude.toFixed(6)}, {testModal.longitude.toFixed(6)}</strong></p>
                  <p style={{ fontSize: 12 }}>Threshold efektif: <strong>~{globalThreshold + testModal.accuracy}m + akurasi user</strong></p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Latitude User</label>
                  <input className="form-input" type="number" step="0.0001" placeholder="-7.266000" value={testLat} onChange={(e) => { setTestLat(e.target.value); setTestResult(null); }} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Longitude User</label>
                  <input className="form-input" type="number" step="0.0001" placeholder="112.752300" value={testLng} onChange={(e) => { setTestLng(e.target.value); setTestResult(null); }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
                <button className="btn btn-outline btn-sm" onClick={() => { setTestLat("-7.2660"); setTestLng("112.7523"); setTestResult(null); }}>
                  <i className="bx bx-map-pin" /> Dalam Kawasan (demo)
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => { setTestLat("-7.2800"); setTestLng("112.7400"); setTestResult(null); }}>
                  <i className="bx bx-x-circle" /> Luar Kawasan (demo)
                </button>
              </div>
              <button className="btn btn-primary btn-full" onClick={runTest} disabled={!testLat || !testLng}>
                <i className="bx bx-run" /> Jalankan Test
              </button>

              {testResult && (
                <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: 10, border: `2px solid ${testResult.accepted ? "var(--success)" : "var(--danger)"}`, background: testResult.accepted ? "#f0fdf4" : "#fef2f2", textAlign: "center" }}>
                  {testResult.accepted
                    ? <i className="bx bx-check-circle" style={{ fontSize: 36, color: "var(--success)", marginBottom: 6 }} />
                    : <i className="bx bx-x-circle" style={{ fontSize: 36, color: "var(--danger)", marginBottom: 6 }} />
                  }
                  <p style={{ fontWeight: 700, fontSize: 16, color: testResult.accepted ? "var(--success)" : "var(--danger)" }}>
                    {testResult.accepted ? "DALAM AREA" : "DI LUAR AREA"}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, textAlign: "center" }}>
                    <div>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Jarak</p>
                      <p style={{ fontWeight: 700, fontSize: 18, color: testResult.accepted ? "var(--success)" : "var(--danger)" }}>{testResult.distance}m</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Threshold</p>
                      <p style={{ fontWeight: 700, fontSize: 18 }}>{testResult.threshold}m</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PanelLayout>
  );
}
