import PanelNavbar from "./PanelNavbar";
import PanelSidebar from "./PanelSidebar";

export default function PanelLayout({ children, role = "tenant", userName, tenantName }) {
  return (
    <>
      <PanelNavbar role={role} userName={userName} tenantName={tenantName} />
      <div className="panel-layout">
        <PanelSidebar role={role} />
        <main className="panel-content">{children}</main>
      </div>
    </>
  );
}
