import { NavLink, Link } from "react-router-dom";

const tenantMenus = [
  { to: "/tenant-panel/dashboard", icon: "bx bx-home-alt", label: "Dashboard" },
  { to: "/tenant-panel/menu", icon: "bx bx-food-menu", label: "Kelola Menu" },
  { to: "/tenant-panel/cetak-tag", icon: "bx bx-purchase-tag", label: "Cetak Tag Harga" },
  { to: "/tenant-panel/kasir", icon: "bx bx-desktop", label: "Kasir / POS" },
  { to: "/tenant-panel/pesanan", icon: "bx bx-list-check", label: "Pesanan & Antrian" },
  { to: "/tenant-panel/scan-qr", icon: "bx bx-scan", label: "Scan QR Pengambilan" },
  { to: "/tenant-panel/laporan", icon: "bx bx-bar-chart-alt-2", label: "Laporan Penjualan" },
];

const pengelolaMenus = [
  { to: "/pengelola/dashboard", icon: "bx bx-home-alt", label: "Dashboard Kawasan" },
  { to: "/pengelola/tenant", icon: "bx bx-store", label: "Kelola Tenant" },
  { to: "/pengelola/kartu-nfc", icon: "bx bx-credit-card", label: "Kelola Kartu NFC" },
  { to: "/pengelola/geofence", icon: "bx bx-map", label: "Pengaturan Geofence" },
  { to: "/pengelola/laporan", icon: "bx bx-bar-chart", label: "Laporan & Settlement" },
];

export default function PanelSidebar({ role = "tenant", mobileOpen, onClose }) {
  const menus = role === "pengelola" ? pengelolaMenus : tenantMenus;
  const brandLabel = role === "pengelola" ? "Panel Pengelola" : "Panel Tenant";

  return (
    <aside className={`panel-sidebar${mobileOpen ? " mobile-open" : ""}`}>
      <div className="sidebar-brand">
        <p className="brand-name">{brandLabel}</p>
      </div>
      <div className="menu-side-group">
        {menus.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            end={m.to.endsWith("dashboard")}
            className={({ isActive }) => `menu-side${isActive ? " active" : ""}`}
            onClick={onClose}
          >
            <span className="side-icon"><i className={m.icon} /></span>
            <span>{m.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="sidebar-footer">
        <Link to="/" className="menu-side" style={{ color: "var(--danger)" }}>
          <span className="side-icon"><i className="bx bx-log-out" /></span>
          <span>Keluar</span>
        </Link>
      </div>
    </aside>
  );
}
