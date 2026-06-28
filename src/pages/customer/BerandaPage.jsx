import { Link } from "react-router-dom";
import CustomerNavbar from "../../components/common/CustomerNavbar";
import { mockTenants } from "../../data/mockData";
import { formatRupiah } from "../../utils/helpers";

const features = [
  { icon: "bx bx-cart-alt", title: "Pesan Online", desc: "Pesan dari berbagai tenant dalam satu platform terpadu" },
  { icon: "bx bx-credit-card", title: "Kartu NFC Cashless", desc: "Bayar mudah dengan tap kartu — tanpa antri bayar tunai" },
  { icon: "bx bx-list-ol", title: "Antrian Real-Time", desc: "Pantau nomor antrian langsung dari smartphone Anda" },
  { icon: "bx bx-file", title: "Struk PDF", desc: "Unduh struk pesanan dan laporan dalam format PDF" },
];

export default function BerandaPage() {
  const featuredTenants = mockTenants.slice(0, 6);

  return (
    <div>
      <CustomerNavbar user={null} />

      {/* Hero Section */}
      <section className="hero-section">
        <div
          className="hero-bg"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=60)" }}
        />
        <div className="hero-content animate-fadein">
          <h1>Satu Aplikasi, Satu Kartu —<br />Semua Tenant Srikana.</h1>
          <p>
            Platform pemesanan terpadu sentra kuliner <strong>SWK Srikana Food Walk</strong>, Universitas Airlangga.
            Pesan makanan, bayar cashless, dan pantau antrian Anda secara real-time.
          </p>
          <div className="cta-buttons">
            <Link to="/tenants">
              <button className="btn btn-primary btn-lg">
                <i className="bx bx-store" /> Mulai Pesan
              </button>
            </Link>
            <a href="#fitur">
              <button className="btn btn-outline btn-lg">
                Pelajari Lebih Lanjut
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Fitur Unggulan */}
      <section id="fitur" style={{ padding: "4rem 0", background: "var(--bg-muted)" }}>
        <div className="section-container">
          <h2 className="section-title" style={{ textAlign: "center", marginTop: 0 }}>Fitur Unggulan</h2>
          <p className="section-subtitle" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            Semua yang Anda butuhkan untuk memesan di kawasan Srikana
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} className="product-card" style={{ textAlign: "center", padding: "2rem 1.5rem", cursor: "default" }}>
                <div style={{ width: 60, height: 60, background: "var(--primary-light)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: 28, color: "var(--primary)" }}>
                  <i className={f.icon} />
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 8, color: "#0e1422" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tenant Pilihan */}
      <section style={{ padding: "4rem 0", background: "var(--bg)" }}>
        <div className="section-container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: 4, marginTop: 0 }}>Tenant Pilihan</h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{mockTenants.length} tenant aktif di kawasan Srikana</p>
            </div>
            <Link to="/tenants" style={{ color: "var(--primary)", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
              Lihat Semua <i className="bx bx-right-arrow-alt" />
            </Link>
          </div>

          <div className="cards-grid">
            {featuredTenants.map((tenant, idx) => (
              <div key={tenant.id} className="product-card animate-fadein" style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="preview">
                  <img src={tenant.foto} alt={tenant.nama} />
                  <div className="view-detail">
                    <i className="bx bx-store" style={{ marginRight: 6 }} /> Lihat Menu
                  </div>
                </div>
                <div className="card-info">
                  <div>
                    <p className="card-title">{tenant.nama}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.5 }}>{tenant.deskripsi}</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#f59e0b", fontWeight: 500 }}>
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
                  <Link to={`/tenant/${tenant.id}`}>
                    <button className="btn btn-outline btn-full btn-sm">
                      <i className="bx bx-cart" /> Pesan Sekarang
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: "linear-gradient(135deg, #011F43 0%, #1e5fa8 100%)", padding: "4rem 2rem", textAlign: "center" }}>
        <h2 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 700, marginBottom: "1rem" }}>
          Daftarkan Kartu NFC Anda
        </h2>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem", maxWidth: 500, margin: "0 auto 2rem", lineHeight: 1.7 }}>
          Nikmati kemudahan pembayaran cashless di seluruh tenant Srikana dengan satu kartu NFC.
        </p>
        <Link to="/login">
          <button className="btn" style={{ background: "#fff", color: "var(--primary)", padding: "13px 32px", fontSize: 14, fontWeight: 600 }}>
            <i className="bx bx-credit-card" /> Daftar & Aktifkan Kartu
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--bg-muted)", borderTop: "1.5px solid var(--border)", padding: "2rem 1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: 12.5 }}>
        <p>© 2026 SrikanaGo — Sistem Informasi Terpadu SWK Srikana Food Walk, UNAIR</p>
        <p style={{ marginTop: 4 }}>DIV Teknik Informatika — Universitas Airlangga Surabaya</p>
      </footer>
    </div>
  );
}
