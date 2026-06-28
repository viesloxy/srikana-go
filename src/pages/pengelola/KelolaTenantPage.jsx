import { useState } from "react";
import PanelLayout from "../../components/common/PanelLayout";
import { mockTenants } from "../../data/mockData";
import { formatRupiah } from "../../utils/helpers";

const emptyForm = {
  nama: "",
  deskripsi: "",
  kategori: "Makanan Berat",
  status: "aktif",
  pemilik: "",
};

const emptyLokasi = {
  latitude: "",
  longitude: "",
  accuracy: "",
  threshold: 50,
};

export default function KelolaTenantPage() {
  const [tenants, setTenants] = useState(mockTenants);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLokasiModal, setShowLokasiModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [deleteTenant, setDeleteTenant] = useState(null);
  const [lokasiTenant, setLokasiTenant] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [lokasiForm, setLokasiForm] = useState(emptyLokasi);
  const [gpsLoading, setGpsLoading] = useState(false);

  const filtered = tenants.filter((t) =>
    t.nama.toLowerCase().includes(search.toLowerCase())
  );

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleLokasiChange(e) {
    const { name, value } = e.target;
    setLokasiForm((f) => ({ ...f, [name]: value }));
  }

  function openAdd() {
    setForm(emptyForm);
    setShowAddModal(true);
  }

  function openEdit(tenant) {
    setEditingTenant(tenant);
    setForm({
      nama: tenant.nama,
      deskripsi: tenant.deskripsi,
      kategori: tenant.kategori,
      status: tenant.status,
      pemilik: "",
    });
    setShowEditModal(true);
  }

  function openLokasi(tenant) {
    setLokasiTenant(tenant);
    setLokasiForm({
      latitude: tenant.latitude ?? "",
      longitude: tenant.longitude ?? "",
      accuracy: tenant.accuracy ?? "",
      threshold: 50,
    });
    setShowLokasiModal(true);
  }

  function openDelete(tenant) {
    setDeleteTenant(tenant);
    setShowDeleteModal(true);
  }

  function handleAdd() {
    if (!form.nama) return;
    const newTenant = {
      id: tenants.length + 1,
      nama: form.nama,
      deskripsi: form.deskripsi,
      foto: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
      kategori: form.kategori,
      rating: 4.5,
      jumlah_menu: 0,
      status: form.status,
      latitude: null,
      longitude: null,
      accuracy: null,
      barcode: `TN-00${tenants.length + 1}`,
    };
    setTenants((prev) => [...prev, newTenant]);
    setShowAddModal(false);
  }

  function handleEdit() {
    if (!form.nama) return;
    setTenants((prev) =>
      prev.map((t) =>
        t.id === editingTenant.id
          ? { ...t, nama: form.nama, deskripsi: form.deskripsi, kategori: form.kategori, status: form.status }
          : t
      )
    );
    setShowEditModal(false);
    setEditingTenant(null);
  }

  function handleDelete() {
    setTenants((prev) => prev.filter((t) => t.id !== deleteTenant.id));
    setShowDeleteModal(false);
    setDeleteTenant(null);
  }

  function handleSaveLokasi() {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === lokasiTenant.id
          ? {
              ...t,
              latitude: Number(lokasiForm.latitude),
              longitude: Number(lokasiForm.longitude),
              accuracy: Number(lokasiForm.accuracy),
            }
          : t
      )
    );
    setShowLokasiModal(false);
    setLokasiTenant(null);
  }

  function simulateGPS() {
    setGpsLoading(true);
    setTimeout(() => {
      setLokasiForm({
        latitude: (-7.265774 + (Math.random() - 0.5) * 0.001).toFixed(6),
        longitude: (112.752174 + (Math.random() - 0.5) * 0.001).toFixed(6),
        accuracy: Math.floor(10 + Math.random() * 20),
        threshold: lokasiForm.threshold,
      });
      setGpsLoading(false);
    }, 1500);
  }

  const TenantFormModal = ({ title, onSave, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}><i className="bx bx-x" /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Nama Tenant</label>
            <input className="form-input" name="nama" placeholder="Nama warung / tenant" value={form.nama} onChange={handleFormChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Deskripsi</label>
            <textarea
              className="form-textarea"
              name="deskripsi"
              placeholder="Deskripsi singkat tenant..."
              value={form.deskripsi}
              onChange={handleFormChange}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select className="form-select" name="kategori" value={form.kategori} onChange={handleFormChange}>
              {["Makanan Berat", "Minuman", "Camilan", "Dessert"].map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">User Pemilik (Opsional)</label>
            <select className="form-select" name="pemilik" value={form.pemilik} onChange={handleFormChange}>
              <option value="">-- Pilih pengguna --</option>
              <option value="user1">Sri Wahyuni (user1@email.com)</option>
              <option value="user2">Budi Santoso (budi@email.com)</option>
              <option value="user3">Dewi Lestari (dewi@email.com)</option>
            </select>
          </div>
          <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 0 }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Status</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["aktif", "nonaktif"].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`tab-pill ${form.status === s ? "active" : ""}`}
                  style={{ padding: "5px 14px", fontSize: 12 }}
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Batal</button>
          <button className="btn btn-primary btn-sm" onClick={onSave} disabled={!form.nama}>
            <i className="bx bx-check" /> Simpan
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <PanelLayout role="pengelola">
      <div className="animate-fadein">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">
            <i className="bx bx-store" /> Kelola Tenant
          </h1>
          <div className="page-actions">
            <div className="search-container">
              <i className="bx bx-search search-icon" />
              <input
                className="search-input"
                placeholder="Cari nama tenant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={openAdd}>
              <i className="bx bx-plus" /> Tambah Tenant
            </button>
          </div>
        </div>

        <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: "1rem" }}>
          Menampilkan <strong>{filtered.length}</strong> dari <strong>{tenants.length}</strong> tenant terdaftar
        </p>

        {/* Grid Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 18,
          }}
        >
          {filtered.map((tenant) => (
            <div
              key={tenant.id}
              className="animate-slideUp"
              style={{
                background: "var(--bg)",
                borderRadius: 14,
                border: "1px solid var(--border-card)",
                overflow: "hidden",
                transition: "box-shadow 0.25s ease, transform 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.09)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              {/* Photo */}
              <div style={{ position: "relative", height: 140, overflow: "hidden" }}>
                <img
                  src={tenant.foto}
                  alt={tenant.nama}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.src = "https://placehold.co/400x140?text=No+Image"; }}
                />
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  <span className={`badge ${tenant.status === "aktif" ? "badge-success" : "badge-muted"}`}>
                    {tenant.status}
                  </span>
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 10,
                    background: "rgba(0,0,0,0.55)",
                    color: "#fff",
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {tenant.barcode}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "14px 16px" }}>
                <h3 style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>{tenant.nama}</h3>
                <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 8, lineHeight: 1.5 }}>
                  {tenant.deskripsi.length > 70 ? tenant.deskripsi.slice(0, 70) + "..." : tenant.deskripsi}
                </p>

                <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                  <span className="badge badge-primary">{tenant.kategori}</span>
                  <span className="badge badge-muted">
                    <i className="bx bx-dish" style={{ fontSize: 11, marginRight: 2 }} />
                    {tenant.jumlah_menu} menu
                  </span>
                  <span className="badge badge-muted">
                    ⭐ {tenant.rating}
                  </span>
                </div>

                {/* Koordinat status */}
                <div
                  style={{
                    fontSize: 11.5,
                    color: tenant.latitude ? "var(--success)" : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 12,
                  }}
                >
                  <i className={`bx ${tenant.latitude ? "bx-map-pin" : "bx-map"}`} />
                  {tenant.latitude
                    ? `Koordinat tersimpan (±${tenant.accuracy}m)`
                    : "Koordinat belum diatur"}
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => openEdit(tenant)}
                  >
                    <i className="bx bx-edit" /> Edit
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1, borderColor: "#16a34a", color: "#16a34a" }}
                    onClick={() => openLokasi(tenant)}
                  >
                    <i className="bx bx-map-pin" /> Set Lokasi
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm btn-icon"
                    onClick={() => openDelete(tenant)}
                  >
                    <i className="bx bx-trash" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state" style={{ marginTop: "2rem" }}>
            <i className="bx bx-store" />
            <p>Tidak ada tenant ditemukan</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <TenantFormModal title="Tambah Tenant Baru" onSave={handleAdd} onClose={() => setShowAddModal(false)} />
      )}

      {/* Edit Modal */}
      {showEditModal && editingTenant && (
        <TenantFormModal
          title={`Edit: ${editingTenant.nama}`}
          onSave={handleEdit}
          onClose={() => { setShowEditModal(false); setEditingTenant(null); }}
        />
      )}

      {/* Lokasi Modal */}
      {showLokasiModal && lokasiTenant && (
        <div className="modal-overlay" onClick={() => setShowLokasiModal(false)}>
          <div className="modal-box" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                <i className="bx bx-map-pin" style={{ marginRight: 6, color: "var(--primary)" }} />
                Set Lokasi: {lokasiTenant.nama}
              </span>
              <button className="modal-close" onClick={() => setShowLokasiModal(false)}>
                <i className="bx bx-x" />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Latitude</label>
                  <input
                    className="form-input"
                    name="latitude"
                    type="number"
                    step="0.000001"
                    placeholder="-7.265774"
                    value={lokasiForm.latitude}
                    onChange={handleLokasiChange}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Longitude</label>
                  <input
                    className="form-input"
                    name="longitude"
                    type="number"
                    step="0.000001"
                    placeholder="112.752174"
                    value={lokasiForm.longitude}
                    onChange={handleLokasiChange}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Akurasi GPS (meter)</label>
                  <input
                    className="form-input"
                    name="accuracy"
                    type="number"
                    placeholder="15"
                    value={lokasiForm.accuracy}
                    onChange={handleLokasiChange}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Radius Threshold (meter)</label>
                  <input
                    className="form-input"
                    name="threshold"
                    type="number"
                    placeholder="50"
                    value={lokasiForm.threshold}
                    onChange={handleLokasiChange}
                  />
                </div>
              </div>

              <button
                className="btn btn-outline btn-full"
                style={{ marginTop: 14, borderColor: "#16a34a", color: "#16a34a" }}
                onClick={simulateGPS}
                disabled={gpsLoading}
              >
                {gpsLoading ? (
                  <><span className="spinner" style={{ borderColor: "rgba(22,163,74,0.3)", borderTopColor: "#16a34a" }} /> Mendapatkan GPS...</>
                ) : (
                  <><i className="bx bx-crosshair" /> Gunakan GPS Otomatis</>
                )}
              </button>

              {lokasiForm.latitude && lokasiForm.longitude && (
                <div className="alert alert-success" style={{ marginTop: 12 }}>
                  <i className="bx bx-map-pin" />
                  <span>Koordinat: <strong>{lokasiForm.latitude}, {lokasiForm.longitude}</strong></span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline btn-sm" onClick={() => setShowLokasiModal(false)}>Batal</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSaveLokasi}
                disabled={!lokasiForm.latitude || !lokasiForm.longitude}
              >
                <i className="bx bx-save" /> Simpan Lokasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && deleteTenant && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-box" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title" style={{ color: "var(--danger)" }}>
                <i className="bx bx-error-circle" style={{ marginRight: 6 }} />
                Konfirmasi Hapus
              </span>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                <i className="bx bx-x" />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 14 }}>
                Hapus tenant <strong>{deleteTenant.nama}</strong>?
              </p>
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 6 }}>
                Semua data terkait tenant ini akan dihapus. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline btn-sm" onClick={() => setShowDeleteModal(false)}>Batal</button>
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                <i className="bx bx-trash" /> Hapus Tenant
              </button>
            </div>
          </div>
        </div>
      )}
    </PanelLayout>
  );
}
