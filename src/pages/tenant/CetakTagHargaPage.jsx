import { useState } from "react";
import PanelLayout from "../../components/common/PanelLayout";
import { mockMenus } from "../../data/mockData";
import { formatRupiah, getGridPosition } from "../../utils/helpers";

const COLS = 5;
const ROWS = 8;

function MiniBarcode({ code }) {
  const bars = Array.from(code).map((c) => c.charCodeAt(0));
  return (
    <svg width={80} height={24} viewBox={`0 0 ${bars.length * 4} 24`} style={{ display: "block" }}>
      {bars.map((w, i) => (
        <rect key={i} x={i * 4} y={0} width={w % 3 === 0 ? 2 : 1} height={24} fill="#222" />
      ))}
    </svg>
  );
}

export default function CetakTagHargaPage() {
  const [startX, setStartX] = useState(1);
  const [startY, setStartY] = useState(1);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const menus = mockMenus.filter((m) => m.tenant_id === 1);
  const selectedList = menus.filter((m) => selectedMenus.includes(m.id_menu));

  const startIndex = (startY - 1) * COLS + (startX - 1);

  function cellState(row, col) {
    const cellIndex = (row - 1) * COLS + (col - 1);
    if (cellIndex < startIndex) return "before";
    const menuPos = cellIndex - startIndex;
    if (menuPos === 0) return "start";
    if (menuPos < selectedMenus.length) return "fill";
    return "empty";
  }

  function toggleMenu(id_menu) {
    setSelectedMenus((prev) =>
      prev.includes(id_menu) ? prev.filter((id) => id !== id_menu) : [...prev, id_menu]
    );
  }

  function toggleAll() {
    if (selectedMenus.length === menus.length) {
      setSelectedMenus([]);
    } else {
      setSelectedMenus(menus.map((m) => m.id_menu));
    }
  }

  const cellColors = {
    before: "#f0f0f0",
    start: "var(--primary)",
    fill: "var(--primary-light)",
    empty: "#fff",
  };

  return (
    <PanelLayout role="tenant">
      <div className="animate-fadein">
        <div className="page-header">
          <h1 className="page-title">
            <i className="bx bx-printer" /> Cetak Tag Harga
          </h1>
          <div className="page-actions">
            <button
              className="btn btn-primary"
              disabled={selectedMenus.length === 0}
              onClick={() => setShowPreview(true)}
            >
              <i className="bx bx-file-pdf" /> Generate PDF Tag Harga
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: "1.5rem" }}>
          {/* Grid Pengaturan */}
          <div style={{ background: "var(--bg)", borderRadius: 14, border: "1px solid var(--border-card)", padding: 20 }}>
            <p style={{ fontWeight: 600, marginBottom: 16, fontSize: 14 }}>
              <i className="bx bx-grid-alt" style={{ color: "var(--primary)", marginRight: 6 }} />
              Pengaturan Posisi Cetak
            </p>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="form-label">Kolom Mulai (X: 1–5)</label>
                <input
                  type="number"
                  className="form-input"
                  min={1} max={5}
                  value={startX}
                  onChange={(e) => setStartX(Math.min(5, Math.max(1, Number(e.target.value))))}
                />
              </div>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="form-label">Baris Mulai (Y: 1–8)</label>
                <input
                  type="number"
                  className="form-input"
                  min={1} max={8}
                  value={startY}
                  onChange={(e) => setStartY(Math.min(8, Math.max(1, Number(e.target.value))))}
                />
              </div>
            </div>

            {/* Grid Preview 5x8 */}
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Preview posisi pada kertas A4 (5×8 sel):</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gap: 3,
                border: "1.5px solid var(--border)",
                borderRadius: 8,
                padding: 8,
                background: "var(--bg-muted)",
              }}
            >
              {Array.from({ length: ROWS }, (_, r) =>
                Array.from({ length: COLS }, (_, c) => {
                  const row = r + 1;
                  const col = c + 1;
                  const state = cellState(row, col);
                  return (
                    <div
                      key={`${r}-${c}`}
                      title={`Baris ${row}, Kolom ${col}`}
                      style={{
                        height: 28,
                        borderRadius: 4,
                        background: cellColors[state],
                        border: state === "start" ? "2px solid var(--primary)" : "1px solid #ddd",
                        transition: "background 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        color: state === "start" ? "#fff" : state === "fill" ? "var(--primary)" : "#ccc",
                        fontWeight: state === "start" ? 700 : 400,
                      }}
                    >
                      {state === "start" ? "*" : ""}
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
              {[
                { color: "#f0f0f0", label: "Sebelum posisi" },
                { color: "var(--primary)", label: "Posisi awal" },
                { color: "var(--primary-light)", label: "Area terisi" },
                { color: "#fff", label: "Kosong" },
              ].map((leg, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: leg.color, border: "1px solid #ddd" }} />
                  {leg.label}
                </div>
              ))}
            </div>
          </div>

          {/* Info Panel */}
          <div style={{ background: "var(--bg)", borderRadius: 14, border: "1px solid var(--border-card)", padding: 20 }}>
            <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>
              <i className="bx bx-info-circle" style={{ color: "var(--primary)", marginRight: 6 }} />
              Informasi Cetak
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Total Sel Tersedia", value: `${COLS * ROWS} sel` },
                { label: "Sel Terpakai (Sebelum Posisi)", value: `${startIndex} sel` },
                { label: "Kapasitas Tersisa", value: `${Math.max(0, COLS * ROWS - startIndex)} sel` },
                { label: "Menu Dipilih", value: `${selectedMenus.length} menu` },
              ].map((info, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--text-muted)" }}>{info.label}</span>
                  <span style={{ fontWeight: 600 }}>{info.value}</span>
                </div>
              ))}
            </div>
            {selectedMenus.length > Math.max(0, COLS * ROWS - startIndex) && (
              <div className="alert alert-warning" style={{ marginTop: 12 }}>
                <i className="bx bx-error" />
                Beberapa menu melebihi kapasitas kertas!
              </div>
            )}
          </div>
        </div>

        {/* Tabel Pilih Menu */}
        <div style={{ background: "var(--bg)", borderRadius: 14, border: "1px solid var(--border-card)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontWeight: 600, fontSize: 14 }}>
              <i className="bx bx-check-square" style={{ color: "var(--primary)", marginRight: 6 }} />
              Pilih Menu untuk Dicetak
            </p>
            <span className="badge badge-primary">Dipilih: {selectedMenus.length} menu</span>
          </div>
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      checked={menus.length > 0 && selectedMenus.length === menus.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>ID Menu</th>
                  <th>Nama</th>
                  <th>Harga</th>
                  <th>Barcode Preview</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu) => (
                  <tr key={menu.id_menu} style={{ background: selectedMenus.includes(menu.id_menu) ? "var(--primary-light)" : undefined }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedMenus.includes(menu.id_menu)}
                        onChange={() => toggleMenu(menu.id_menu)}
                      />
                    </td>
                    <td>
                      <span style={{ fontFamily: "monospace", fontSize: 12, background: "var(--bg-muted)", padding: "2px 7px", borderRadius: 4 }}>
                        {menu.id_menu}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{menu.nama}</td>
                    <td style={{ fontWeight: 600 }}>{formatRupiah(menu.harga)}</td>
                    <td>
                      <MiniBarcode code={menu.id_menu} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div
            className="modal-box"
            style={{ maxWidth: 680, maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-title">
                <i className="bx bx-file-pdf" style={{ marginRight: 6, color: "var(--danger)" }} />
                Preview Tag Harga
              </span>
              <button className="modal-close" onClick={() => setShowPreview(false)}>
                <i className="bx bx-x" />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 16 }}>
                Preview label yang akan dicetak. Setiap label berisi barcode, ID menu, nama, dan harga.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                }}
              >
                {selectedList.map((menu) => (
                  <div
                    key={menu.id_menu}
                    style={{
                      border: "1.5px dashed #ccc",
                      borderRadius: 8,
                      padding: "10px 12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      background: "#fafafa",
                    }}
                  >
                    <MiniBarcode code={menu.id_menu} />
                    <span style={{ fontSize: 10, color: "#888", fontFamily: "monospace" }}>{menu.id_menu}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>{menu.nama}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>{formatRupiah(menu.harga)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline btn-sm" onClick={() => setShowPreview(false)}>Tutup</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => { alert("Fitur cetak PDF akan diimplementasikan dengan library PDF."); }}
              >
                <i className="bx bx-printer" /> Cetak
              </button>
            </div>
          </div>
        </div>
      )}
    </PanelLayout>
  );
}
