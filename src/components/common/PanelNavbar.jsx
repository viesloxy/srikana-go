import { useState } from "react";
import { Link } from "react-router-dom";
import PanelSidebar from "./PanelSidebar";

export default function PanelNavbar({ role, userName, tenantName }) {
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const roleLabel = role === "pengelola" ? "Pengelola" : "Tenant";
  const displayName = tenantName || userName || "User";

  return (
    <>
      <header className="panel-navbar">
        <div className="left">
          <button
            className="menu-mobile"
            style={{ display: "none" }}
            id="panel-hamburger"
            onClick={() => setMobileSidebar(true)}
          >
            <i className="bx bx-menu icon" />
          </button>
          <img src="/logo.svg" alt="SrikanaGo" style={{ height: 34 }} />
          <span className="app-title">SrikanaGo</span>
          <span className="role-badge">{roleLabel}</span>
        </div>
        <div className="right">
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{displayName}</span>
          <Link to="/" style={{ fontSize: 22, color: "var(--text-muted)", display: "flex" }}>
            <i className="bx bx-log-out" />
          </Link>
        </div>
      </header>

      <style>{`
        @media (max-width: 1024px) {
          #panel-hamburger { display: flex !important; }
        }
      `}</style>

      {mobileSidebar && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 350 }}
          onClick={() => setMobileSidebar(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <PanelSidebar role={role} mobileOpen onClose={() => setMobileSidebar(false)} />
          </div>
        </div>
      )}
    </>
  );
}
