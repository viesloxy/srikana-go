import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatRupiah } from "../../utils/helpers";

export default function CustomerNavbar({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { itemCount } = useCart();
  const nfcBalance = 25000;

  return (
    <>
      <header className="app-navbar">
        <div className="app-bar-container">
          <div className="left-section">
            <img src="/logo.svg" alt="SrikanaGo" style={{ height: 34 }} />
            <span className="title">SrikanaGo</span>
          </div>

          <div className="center-section">
            <nav className="group-menu-nav">
              <NavLink to="/beranda" className={({ isActive }) => `menu-nav${isActive ? " active" : ""}`}>
                <span className="nav-icon"><i className="bx bx-home" /></span>
                <span>Beranda</span>
              </NavLink>
              <NavLink to="/tenant" className={({ isActive }) => `menu-nav${isActive ? " active" : ""}`}>
                <span className="nav-icon"><i className="bx bx-store" /></span>
                <span>Tenant</span>
              </NavLink>
              <NavLink to="/antrian" className={({ isActive }) => `menu-nav${isActive ? " active" : ""}`}>
                <span className="nav-icon"><i className="bx bx-list-ol" /></span>
                <span>Antrian</span>
              </NavLink>
            </nav>
          </div>

          <div className="right-section">
            {user ? (
              <>
                <Link to="/kartu-nfc" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--primary)", background: "var(--primary-light)", padding: "6px 14px", borderRadius: 100, fontWeight: 500 }}>
                  <i className="bx bx-credit-card" style={{ fontSize: 16 }} />
                  {formatRupiah(nfcBalance)}
                </Link>
                <Link to="/cart" style={{ position: "relative" }}>
                  <button className="ctas" style={{ width: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="bx bx-cart" style={{ fontSize: 20, color: "#fff" }} />
                  </button>
                  {itemCount > 0 && (
                    <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link to="/profil">
                  <div style={{ width: 36, height: 36, background: "var(--primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 600 }}>
                    {user.charAt(0).toUpperCase()}
                  </div>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <button className="ctas"><span>Masuk</span></button>
              </Link>
            )}
            <button className="menu-mobile" onClick={() => setSidebarOpen(true)}>
              <i className="bx bx-menu-right icon" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`sidebar-app${sidebarOpen ? " visible" : ""}`} onClick={() => setSidebarOpen(false)}>
        <div className="sidebar-wrapper">
          <div className="sidebar-container" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="sidebar-top-section">
                <img src="/logo.svg" alt="SrikanaGo" style={{ height: 30 }} />
                <span className="title">SrikanaGo</span>
              </div>
              <div className="menu-side-group">
                <Link to="/beranda" className="menu-side" onClick={() => setSidebarOpen(false)}>
                  <span className="side-icon"><i className="bx bx-home" /></span>
                  <span>Beranda</span>
                </Link>
                <Link to="/tenant" className="menu-side" onClick={() => setSidebarOpen(false)}>
                  <span className="side-icon"><i className="bx bx-store" /></span>
                  <span>Tenant</span>
                </Link>
                <Link to="/cart" className="menu-side" onClick={() => setSidebarOpen(false)}>
                  <span className="side-icon"><i className="bx bx-cart" /></span>
                  <span>Keranjang {itemCount > 0 && `(${itemCount})`}</span>
                </Link>
                <Link to="/antrian" className="menu-side" onClick={() => setSidebarOpen(false)}>
                  <span className="side-icon"><i className="bx bx-list-ol" /></span>
                  <span>Status Antrian</span>
                </Link>
                {user ? (
                  <>
                    <Link to="/profil" className="menu-side" onClick={() => setSidebarOpen(false)}>
                      <span className="side-icon"><i className="bx bx-user" /></span>
                      <span>Profil Saya</span>
                    </Link>
                    <Link to="/kartu-nfc" className="menu-side" onClick={() => setSidebarOpen(false)}>
                      <span className="side-icon"><i className="bx bx-credit-card" /></span>
                      <span>Kartu NFC</span>
                    </Link>
                  </>
                ) : (
                  <Link to="/login" className="menu-side active" onClick={() => setSidebarOpen(false)}>
                    <span className="side-icon"><i className="bx bx-log-in" /></span>
                    <span>Masuk</span>
                  </Link>
                )}
                <button className="menu-side close" onClick={() => setSidebarOpen(false)}>
                  <span className="side-icon"><i className="bx bx-x" /></span>
                  <span>Tutup</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
