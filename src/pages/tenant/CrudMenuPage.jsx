import { useState, useMemo } from "react";
import PanelLayout from "../../components/common/PanelLayout";
import { mockMenus, mockKategori } from "../../data/mockData";
import { formatRupiah, generateMenuId, statusColor } from "../../utils/helpers";

const PER_PAGE = 5;

const emptyForm = { nama: "", kategori: "Makanan Berat", harga: "", foto: "", tersedia: true };

export default function CrudMenuPage() {
  const [menus, setMenus] = useState(() => mockMenus.filter((m) => m.tenant_id === 1));
  const [search, setSearch] = useState("");
  const [filterKat, setFilterKat] = useState("Semua");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");

  const filtered = useMemo(() => {
    return menus.filter((m) => {
      const matchSearch =
        m.nama.toLowerCase().includes(search.toLowerCase()) ||
        m.id_menu.toLowerCase().includes(search.toLowerCase());
      const matchKat = filterKat === "Semua" || m.kategori === filterKat;
      return matchSearch && matchKat;
    });
  }, [menus, search, filterKat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function openAdd() {
    setForm(emptyForm);
    setFotoPreview("");
    setShowAddModal(true);
  }

  function openEdit(menu) {
    setEditingMenu(menu);
    setForm({
      nama: menu.nama,
      kategori: menu.kategori,
      harga: menu.harga,
      foto: menu.foto,
      tersedia: menu.tersedia,
    });
    setFotoPreview(menu.foto);
    setShowEditModal(true);
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (name === "foto") setFotoPreview(value);
  }

  function handleAdd() {
    if (!form.nama || !form.harga) return;
    const existingIds = menus.map((m) => m.id_menu);
    const newId = generateMenuId(form.kategori, existingIds);
    const newMenu = {
      id_menu: newId,
      tenant_id: 1,
      nama: form.nama,
      kategori: form.kategori,
      harga: Number(form.harga),
      foto: form.foto || "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&q=80",
      tersedia: form.tersedia,
    };
    setMenus((prev) => [...prev, newMenu]);
    setShowAddModal(false);
    setPage(1);
  }

  function handleEdit() {
    if (!form.nama || !form.harga) return;
    setMenus((prev) =>
      prev.map((m) =>
        m.id_menu === editingMenu.id_menu
          ? { ...m, nama: form.nama, kategori: form.kategori, harga: Number(form.harga), foto: form.foto, tersedia: form.tersedia }
          : m
      )
    );
    setShowEditModal(false);
    setEditingMenu(null);
  }

  function handleDelete(id_menu) {
    setMenus((prev) => prev.filter((m) => m.id_menu !== id_menu));
    setDeleteTarget(null);
    setSelectedRows((prev) => prev.filter((r) => r !== id_menu));
  }

  function toggleStatus(id_menu) {
    setMenus((prev) =>
      prev.map((m) => (m.id_menu === id_menu ? { ...m, tersedia: !m.tersedia } : m))
    );
  }

  function toggleRow(id_menu) {
    setSelectedRows((prev) =>
      prev.includes(id_menu) ? prev.filter((r) => r !== id_menu) : [...prev, id_menu]
    );
  }

  function toggleAll() {
    const ids = paginated.map((m) => m.id_menu);
    const allSelected = ids.every((id) => selectedRows.includes(id));
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((r) => !ids.includes(r)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...ids])]);
    }
  }

  function handleBulkDelete() {
    if (selectedRows.length === 0) return;
    if (window.confirm(`Hapus ${selectedRows.length} menu yang dipilih?`)) {
      setMenus((prev) => prev.filter((m) => !selectedRows.includes(m.id_menu)));
      setSelectedRows([]);
    }
  }

  const MenuModal = ({ title, onSave, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}><i className="bx bx-x" /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select className="form-select" name="kategori" value={form.kategori} onChange={handleFormChange}>
              {mockKategori.map((k) => <option key={k}>{k}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nama Menu</label>
            <input className="form-input" name="nama" placeholder="Nama menu" value={form.nama} onChange={handleFormChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Harga (Rp)</label>
            <input className="form-input" name="harga" type="number" placeholder="Contoh: 15000" value={form.harga} onChange={handleFormChange} />
          </div>
          <div className="form-group">
            <label className="form-label">URL Foto</label>
            <input className="form-input" name="foto" placeholder="https://..." value={form.foto} onChange={handleFormChange} />
            {fotoPreview && (
              <img
                src={fotoPreview}
                alt="preview"
                style={{ marginTop: 8, width: "100%", height: 140, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
          </div>
          <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Status Tersedia</label>
            <label className="toggle-switch">
              <input type="checkbox" name="tersedia" checked={form.tersedia} onChange={handleFormChange} />
              <span className="toggle-slider" />
            </label>
            <span style={{ fontSize: 12.5, color: form.tersedia ? "var(--success)" : "var(--text-muted)" }}>
              {form.tersedia ? "Tersedia" : "Tidak Tersedia"}
            </span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Batal</button>
          <button className="btn btn-primary btn-sm" onClick={onSave}>
            <i className="bx bx-check" /> Simpan
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <PanelLayout role="tenant">
      <div className="animate-fadein">
        <div className="page-header">
          <h1 className="page-title">
            <i className="bx bx-dish" /> Kelola Menu
          </h1>
          <div className="page-actions">
            {selectedRows.length > 0 && (
              <button className="btn btn-danger btn-sm" onClick={handleBulkDelete}>
                <i className="bx bx-trash" /> Hapus ({selectedRows.length})
              </button>
            )}
            <button className="btn btn-primary btn-sm" onClick={openAdd}>
              <i className="bx bx-plus" /> Tambah Menu
            </button>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 10, marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div className="search-container">
            <i className="bx bx-search search-icon" />
            <input
              className="search-input"
              placeholder="Cari nama / ID menu..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="form-select"
            style={{ width: 180, padding: "8px 32px 8px 12px", borderRadius: 999 }}
            value={filterKat}
            onChange={(e) => { setFilterKat(e.target.value); setPage(1); }}
          >
            <option>Semua</option>
            {mockKategori.map((k) => <option key={k}>{k}</option>)}
          </select>
          <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
            {filtered.length} menu ditemukan
          </span>
        </div>

        {/* Table */}
        <div style={{ background: "var(--bg)", borderRadius: 14, border: "1px solid var(--border-card)", overflow: "hidden" }}>
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      checked={paginated.length > 0 && paginated.every((m) => selectedRows.includes(m.id_menu))}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>ID Menu</th>
                  <th>Foto</th>
                  <th>Nama Menu</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Status</th>
                  <th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((menu) => (
                  <tr key={menu.id_menu} style={{ background: selectedRows.includes(menu.id_menu) ? "var(--primary-light)" : undefined }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(menu.id_menu)}
                        onChange={() => toggleRow(menu.id_menu)}
                      />
                    </td>
                    <td>
                      <span style={{ fontFamily: "monospace", fontSize: 12, background: "var(--bg-muted)", padding: "2px 7px", borderRadius: 4 }}>
                        {menu.id_menu}
                      </span>
                    </td>
                    <td>
                      <img
                        src={menu.foto}
                        alt={menu.nama}
                        style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }}
                        onError={(e) => { e.target.src = "https://placehold.co/44x44?text=No+Img"; }}
                      />
                    </td>
                    <td style={{ fontWeight: 500 }}>{menu.nama}</td>
                    <td>
                      <span className="badge badge-primary">{menu.kategori}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatRupiah(menu.harga)}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <label className="toggle-switch">
                          <input type="checkbox" checked={menu.tersedia} onChange={() => toggleStatus(menu.id_menu)} />
                          <span className="toggle-slider" />
                        </label>
                        <span className={`badge ${menu.tersedia ? "badge-success" : "badge-muted"}`} style={{ fontSize: 11 }}>
                          {menu.tersedia ? "Tersedia" : "Habis"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-outline btn-sm btn-icon" title="Edit" onClick={() => openEdit(menu)}>
                          <i className="bx bx-edit" />
                        </button>
                        <button className="btn btn-outline-danger btn-sm btn-icon" title="Hapus" onClick={() => setDeleteTarget(menu)}>
                          <i className="bx bx-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginated.length === 0 && (
            <div className="empty-state">
              <i className="bx bx-dish" />
              <p>Tidak ada menu ditemukan</p>
            </div>
          )}

          {/* Pagination */}
          <div className="pagination">
            <span>Menampilkan {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} dari {filtered.length} menu</span>
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

      {/* Add Modal */}
      {showAddModal && (
        <MenuModal title="Tambah Menu Baru" onSave={handleAdd} onClose={() => setShowAddModal(false)} />
      )}

      {/* Edit Modal */}
      {showEditModal && editingMenu && (
        <MenuModal title={`Edit: ${editingMenu.nama}`} onSave={handleEdit} onClose={() => { setShowEditModal(false); setEditingMenu(null); }} />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-box" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title" style={{ color: "var(--danger)" }}>
                <i className="bx bx-error-circle" style={{ marginRight: 6 }} />
                Konfirmasi Hapus
              </span>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}><i className="bx bx-x" /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 14, color: "var(--text-main)" }}>
                Hapus menu <strong>{deleteTarget.nama}</strong>?
              </p>
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 6 }}>
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline btn-sm" onClick={() => setDeleteTarget(null)}>Batal</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(deleteTarget.id_menu)}>
                <i className="bx bx-trash" /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </PanelLayout>
  );
}
