import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import CustomerNavbar from "../../components/common/CustomerNavbar";
import { mockTenants, mockMenus, mockKategori } from "../../data/mockData";
import { useCart } from "../../context/CartContext";
import { formatRupiah } from "../../utils/helpers";

export default function DetailTenantPage() {
  const { id } = useParams();
  const tenant = mockTenants.find((t) => t.id === Number(id));
  const menus = mockMenus.filter((m) => m.tenant_id === Number(id));
  const { addItem, itemCount, total } = useCart();
  const [search, setSearch] = useState("");
  const [activeKat, setActiveKat] = useState("Semua");
  const [addedIds, setAddedIds] = useState({});

  const kategoriList = ["Semua", ...new Set(menus.map((m) => m.kategori))];

  const filtered = useMemo(() => menus.filter((m) => {
    const matchSearch = m.nama.toLowerCase().includes(search.toLowerCase());
    const matchKat = activeKat === "Semua" || m.kategori === activeKat;
    return matchSearch && matchKat;
  }), [menus, search, activeKat]);

  if (!tenant) return (
    <div>
      <CustomerNavbar user="Ikhsan" />
      <div className="empty-state" style={{ minHeight: "60vh" }}>
        <i className="bx bx-error-circle" />
        <p>Tenant tidak ditemukan</p>
        <Link to="/tenants"><button className="btn btn-primary btn-sm" style={{ marginTop: "1rem" }}>Kembali</button></Link>
      </div>
    </div>
  );

  const handleAdd = (menu) => {
    addItem(menu, tenant.id, tenant.nama);
    setAddedIds((prev) => ({ ...prev, [menu.id_menu]: true }));
    setTimeout(() => setAddedIds((prev) => ({ ...prev, [menu.id_menu]: false })), 1500);
  };

  return (
    <div>
      <CustomerNavbar user="Ikhsan" />

      {/* Banner Tenant */}
      <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
        <img src={tenant.banner} alt={tenant.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.55))" }} />
        <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", display: "flex", alignItems: "flex-end", gap: "1rem" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid #fff", overflow: "hidden", flexShrink: 0 }}>
            <img src={tenant.foto} alt={tenant.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ color: "#fff" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{tenant.nama}</h1>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 4, fontSize: 13 }}>
              <span style={{ color: "#fbbf24" }}><i className="bx bxs-star" /> {tenant.rating}</span>
              <span style={{ opacity: 0.9 }}><i className="bx bx-food-menu" /> {menus.length} menu</span>
              <span className={`badge ${tenant.status === "aktif" ? "badge-success" : "badge-muted"}`}>
                {tenant.status === "aktif" ? "Buka" : "Tutup"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container" style={{ paddingTop: "1.5rem" }}>
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Beranda</Link><span className="sep">/</span>
          <Link to="/tenants">Tenant</Link><span className="sep">/</span>
          <span>{tenant.nama}</span>
        </div>

        {/* Deskripsi */}
        <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: "1.5rem", lineHeight: 1.7 }}>{tenant.deskripsi}</p>

        {/* Filter */}
        <div className="filter-section" style={{ marginBottom: "1.25rem" }}>
          <div className="filter-section-container">
            <div className="info-alert">
              <i className="bx bx-info-circle" />
              Menampilkan <strong style={{ marginInline: 4 }}>{filtered.length}</strong> menu
            </div>
            <div className="filter-right">
              <div className="search-container">
                <i className="bx bx-search search-icon" />
                <input className="search-input" placeholder="Cari menu..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Kategori */}
        <div className="tab-pills">
          {kategoriList.map((k) => (
            <button key={k} className={`tab-pill${k === activeKat ? " active" : ""}`} onClick={() => setActiveKat(k)}>{k}</button>
          ))}
        </div>

        {/* Grid Menu */}
        {filtered.length > 0 ? (
          <div className="cards-grid">
            {filtered.map((menu, idx) => (
              <div key={menu.id_menu} className="product-card animate-fadein" style={{ animationDelay: `${idx * 0.06}s` }}>
                <div className="preview">
                  <img src={menu.foto} alt={menu.nama} style={{ opacity: menu.tersedia ? 1 : 0.4 }} />
                  {!menu.tersedia && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: 14, borderRadius: 8 }}>
                      Habis
                    </div>
                  )}
                </div>
                <div className="card-info">
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <p className="card-title">{menu.nama}</p>
                      {!menu.tersedia && <span className="badge badge-muted">Habis</span>}
                    </div>
                    <span className="badge badge-primary" style={{ marginTop: 4, fontSize: 10.5 }}>{menu.kategori}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--primary)" }}>{formatRupiah(menu.harga)}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{menu.id_menu}</span>
                  </div>
                  <button
                    className={`btn btn-sm btn-full${addedIds[menu.id_menu] ? " btn-primary" : " btn-outline"}`}
                    disabled={!menu.tersedia}
                    onClick={() => handleAdd(menu)}
                  >
                    {addedIds[menu.id_menu] ? (
                      <><i className="bx bx-check" /> Ditambahkan!</>
                    ) : (
                      <><i className="bx bx-plus" /> Keranjang</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="bx bx-food-menu" />
            <p>Tidak ada menu yang ditemukan</p>
          </div>
        )}
      </div>

      {/* Floating Cart Bar */}
      {itemCount > 0 && (
        <Link to="/cart">
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--primary)", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 200, boxShadow: "0 -4px 20px rgba(1,31,67,0.3)", animation: "slideInUp 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 10px", fontSize: 14, fontWeight: 700, color: "#fff" }}>{itemCount}</div>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>Item dalam keranjang</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{formatRupiah(total)}</span>
              <i className="bx bx-right-arrow-alt" style={{ color: "#fff", fontSize: 22 }} />
            </div>
          </div>
        </Link>
      )}
      {itemCount > 0 && <div style={{ height: 72 }} />}
    </div>
  );
}
