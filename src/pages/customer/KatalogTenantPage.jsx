import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import CustomerNavbar from "../../components/common/CustomerNavbar";
import { mockTenants, mockKategori } from "../../data/mockData";

export default function KatalogTenantPage() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = useMemo(() => mockTenants.filter((t) => {
    const matchSearch = t.nama.toLowerCase().includes(search.toLowerCase()) ||
      t.deskripsi.toLowerCase().includes(search.toLowerCase());
    const matchKat = kategori === "Semua" || t.kategori === kategori;
    return matchSearch && matchKat;
  }), [search, kategori]);

  return (
    <div>
      <CustomerNavbar user="Ikhsan" />

      <div className="section-container">
        <div style={{ paddingTop: "1.5rem" }}>
          {/* Filter Section */}
          <div className="filter-section">
            <div className="filter-section-container">
              <div className="info-alert">
                <i className="bx bx-info-circle" />
                Menampilkan <strong style={{ marginInline: 4 }}>{filtered.length}</strong> tenant aktif
              </div>
              <div className="filter-right">
                {/* Dropdown Kategori */}
                <div style={{ position: "relative" }}>
                  <button
                    className="dropdown-btn"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <i className="bx bx-category" />
                    {kategori}
                    <i className="bx bx-chevron-down" />
                  </button>
                  {showDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50, minWidth: 180, padding: 6, animation: "slideInUp 0.2s ease" }}>
                      {["Semua", ...mockKategori].map((k) => (
                        <button
                          key={k}
                          onClick={() => { setKategori(k); setShowDropdown(false); }}
                          style={{ display: "block", width: "100%", padding: "8px 14px", textAlign: "left", background: k === kategori ? "var(--primary-light)" : "transparent", color: k === kategori ? "var(--primary)" : "#333", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "Poppins", fontWeight: k === kategori ? 500 : 400 }}
                        >
                          {k === kategori && <i className="bx bx-check" style={{ marginRight: 6 }} />}{k}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search */}
                <div className="search-container">
                  <i className="bx bx-search search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Cari tenant..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Pills Kategori */}
          <div className="tab-pills" style={{ marginBottom: "1.5rem" }}>
            {["Semua", ...mockKategori].map((k) => (
              <button key={k} className={`tab-pill${k === kategori ? " active" : ""}`} onClick={() => setKategori(k)}>
                {k}
              </button>
            ))}
          </div>

          {/* Grid Tenant */}
          {filtered.length > 0 ? (
            <div className="cards-grid">
              {filtered.map((tenant, idx) => (
                <div key={tenant.id} className="product-card animate-fadein" style={{ animationDelay: `${idx * 0.06}s` }}>
                  <div className="preview">
                    <img src={tenant.foto} alt={tenant.nama} />
                    <div className="view-detail">
                      <i className="bx bx-store" style={{ marginRight: 6 }} /> Lihat Menu
                    </div>
                  </div>
                  <div className="card-info">
                    <div>
                      <p className="card-title">{tenant.nama}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginTop: 3 }}>{tenant.deskripsi}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                        <span style={{ fontSize: 12.5, color: "#f59e0b", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>
                          <i className="bx bxs-star" /> {tenant.rating}
                        </span>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          <i className="bx bx-food-menu" style={{ marginRight: 3 }} />{tenant.jumlah_menu} menu
                        </span>
                      </div>
                      <span className={`badge ${tenant.status === "aktif" ? "badge-success" : "badge-muted"}`}>
                        {tenant.status === "aktif" ? "Buka" : "Tutup"}
                      </span>
                    </div>
                    <span className="badge badge-primary" style={{ alignSelf: "flex-start" }}>
                      <i className="bx bx-category" style={{ fontSize: 11 }} /> {tenant.kategori}
                    </span>
                    <Link to={`/tenant/${tenant.id}`}>
                      <button className="btn btn-outline btn-full btn-sm">
                        <i className="bx bx-cart" /> Lihat Menu & Pesan
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="bx bx-search-alt" />
              <p>Tidak ada tenant yang sesuai pencarian "<strong>{search || kategori}</strong>"</p>
              <button className="btn btn-outline btn-sm" style={{ marginTop: "1rem" }} onClick={() => { setSearch(""); setKategori("Semua"); }}>
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
