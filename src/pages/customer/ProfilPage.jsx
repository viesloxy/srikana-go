import { useState, useRef, useEffect } from "react";
import CustomerNavbar from "../../components/common/CustomerNavbar";

const provinsi = ["Jawa Timur", "Jawa Barat", "DKI Jakarta"];
const kotaMap = { "Jawa Timur": ["Surabaya", "Malang"], "Jawa Barat": ["Bandung", "Bekasi"], "DKI Jakarta": ["Jakarta Pusat", "Jakarta Selatan"] };

export default function ProfilPage() {
  const [form, setForm] = useState({ nama: "Muhammad Ikhsan", hp: "081234567890", email: "ikhsan@email.com" });
  const [address, setAddress] = useState({ provinsi: "Jawa Timur", kota: "Surabaya", kecamatan: "", kelurahan: "", detail: "" });
  const [photoMode, setPhotoMode] = useState("blob");
  const [photo, setPhoto] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80");
  const [showCamera, setShowCamera] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCapturing(true);
    } catch { alert("Akses kamera ditolak. Izinkan di pengaturan browser."); }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCapturing(false);
  };

  useEffect(() => { if (showCamera) startCamera(); else stopCamera(); return () => stopCamera(); }, [showCamera]);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setCapturedPhoto(canvas.toDataURL("image/jpeg"));
    stopCamera();
  };

  const usePhoto = () => { setPhoto(capturedPhoto); setCapturedPhoto(null); setShowCamera(false); };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <CustomerNavbar user="Ikhsan" />
      <div className="section-container" style={{ paddingTop: "2rem", maxWidth: 720 }}>
        <h1 className="page-title" style={{ marginBottom: "1.5rem" }}><i className="bx bx-user-circle" /> Profil Saya</h1>

        {saved && <div className="alert alert-success"><i className="bx bx-check-circle" /> Profil berhasil disimpan!</div>}

        <form onSubmit={handleSave}>
          {/* Foto Profil */}
          <div className="product-card" style={{ cursor: "default", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: "1.25rem" }}><i className="bx bx-camera" style={{ color: "var(--primary)", marginRight: 6 }} />Foto Profil</h3>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 110, height: 110, borderRadius: "50%", border: "3px solid var(--primary)", overflow: "hidden" }}>
                  <img src={photo} alt="Foto Profil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 10, marginBottom: "0.875rem", flexWrap: "wrap" }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowCamera(true)}>
                    <i className="bx bx-camera" /> Ambil Foto (Kamera)
                  </button>
                  <label className="btn btn-outline btn-sm" style={{ cursor: "pointer" }}>
                    <i className="bx bx-upload" /> Upload File
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; if (f) { const url = URL.createObjectURL(f); setPhoto(url); } }} />
                  </label>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Simpan sebagai:</span>
                  {[{ id: "blob", label: "Blob (Database)" }, { id: "file", label: "File + Path" }].map((m) => (
                    <label key={m.id} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                      <input type="radio" name="photoMode" value={m.id} checked={photoMode === m.id} onChange={() => setPhotoMode(m.id)} />
                      {m.label}
                    </label>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>Mode: <strong>{photoMode === "blob" ? "Disimpan sebagai binary di database" : "Disimpan sebagai file, path di database"}</strong></p>
              </div>
            </div>
          </div>

          {/* Data Diri */}
          <div className="product-card" style={{ cursor: "default", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: "1.25rem" }}><i className="bx bx-user" style={{ color: "var(--primary)", marginRight: 6 }} />Data Diri</h3>
            <div style={{ display: "grid", gap: "0.875rem" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Nama Lengkap</label>
                <div className="form-input-icon"><i className="bx bx-user icon" /><input className="form-input" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Nomor HP</label>
                  <div className="form-input-icon"><i className="bx bx-phone icon" /><input type="tel" className="form-input" value={form.hp} onChange={(e) => setForm({ ...form, hp: e.target.value })} /></div>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email</label>
                  <div className="form-input-icon"><i className="bx bx-envelope icon" /><input type="email" className="form-input" value={form.email} readOnly style={{ background: "var(--bg-muted)", cursor: "not-allowed" }} /></div>
                </div>
              </div>
            </div>
          </div>

          {/* Alamat */}
          <div className="product-card" style={{ cursor: "default", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 700, marginBottom: "1.25rem" }}><i className="bx bx-map" style={{ color: "var(--primary)", marginRight: 6 }} />Alamat</h3>
            <div style={{ display: "grid", gap: "0.875rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                <div><label className="form-label">Provinsi</label><select className="form-select" value={address.provinsi} onChange={(e) => setAddress({ ...address, provinsi: e.target.value, kota: "" })}><option value="">Pilih</option>{provinsi.map((p) => <option key={p}>{p}</option>)}</select></div>
                <div><label className="form-label">Kota / Kabupaten</label><select className="form-select" value={address.kota} onChange={(e) => setAddress({ ...address, kota: e.target.value })} disabled={!address.provinsi}><option value="">Pilih</option>{(kotaMap[address.provinsi] || []).map((k) => <option key={k}>{k}</option>)}</select></div>
              </div>
              <div><label className="form-label">Detail Alamat</label><textarea className="form-textarea" value={address.detail} onChange={(e) => setAddress({ ...address, detail: e.target.value })} placeholder="Nama jalan, nomor rumah, RT/RW..." /></div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <><span className="spinner" /> Menyimpan...</> : <><i className="bx bx-save" /> Simpan Perubahan</>}
          </button>
        </form>

        {/* Modal Kamera */}
        {showCamera && (
          <div className="modal-overlay" onClick={() => setShowCamera(false)}>
            <div className="modal-box" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <span className="modal-title"><i className="bx bx-camera" style={{ marginRight: 6, color: "var(--primary)" }} />Ambil Foto Profil</span>
                <button className="modal-close" onClick={() => setShowCamera(false)}><i className="bx bx-x" /></button>
              </div>
              <div className="modal-body" style={{ textAlign: "center" }}>
                {!capturedPhoto ? (
                  <>
                    <div style={{ borderRadius: 12, overflow: "hidden", background: "#000", marginBottom: "1rem", aspectRatio: "4/3" }}>
                      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <button className="btn btn-primary" onClick={capturePhoto} disabled={!capturing}>
                      <i className="bx bx-camera" /> Ambil Foto
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: "1rem" }}>
                      <img src={capturedPhoto} alt="Captured" style={{ width: "100%", borderRadius: 12 }} />
                    </div>
                    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                      <button className="btn btn-outline" onClick={() => { setCapturedPhoto(null); startCamera(); }}>
                        <i className="bx bx-refresh" /> Ulangi
                      </button>
                      <button className="btn btn-primary" onClick={usePhoto}>
                        <i className="bx bx-check" /> Pakai Foto
                      </button>
                    </div>
                  </>
                )}
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
