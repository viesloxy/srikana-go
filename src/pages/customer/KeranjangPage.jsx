import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerNavbar from "../../components/common/CustomerNavbar";
import { useCart } from "../../context/CartContext";
import { formatRupiah } from "../../utils/helpers";
import axios from "axios";

export default function KeranjangPage() {
  const navigate = useNavigate();
  const { cart, activeTenant, removeItem, updateQty, total, itemCount } = useCart();
  const [kodeInput, setKodeInput] = useState("");
  const [autoFill, setAutoFill] = useState({ nama: "", harga: "" });
  const [qty, setQty] = useState(1);
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [mode, setMode] = useState("axios");

  const lookupMenu = async () => {
    if (!kodeInput.trim()) return;
    setLoadingLookup(true);
    setLookupError("");
    setAutoFill({ nama: "", harga: "" });
    await new Promise((r) => setTimeout(r, 800));
    const found = { "MB-0001": { nama: "Nasi Goreng Spesial", harga: 15000 }, "MB-0002": { nama: "Ayam Penyet", harga: 18000 }, "MN-0001": { nama: "Es Teh Manis", harga: 5000 } }[kodeInput.toUpperCase()];
    setLoadingLookup(false);
    if (found) {
      setAutoFill(found);
      setLookupError("");
    } else {
      setLookupError("Kode menu tidak ditemukan");
    }
  };

  return (
    <div>
      <CustomerNavbar user="Ikhsan" />
      <div className="section-container" style={{ paddingTop: "1.5rem" }}>
        <div className="breadcrumb">
          <Link to="/">Beranda</Link><span className="sep">/</span>
          {activeTenant && <><Link to={`/tenant/${activeTenant.id}`}>{activeTenant.nama}</Link><span className="sep">/</span></>}
          <span>Keranjang</span>
        </div>

        <div className="page-header">
          <h1 className="page-title"><i className="bx bx-cart" /> Keranjang Belanja</h1>
          {activeTenant && <span className="badge badge-primary"><i className="bx bx-store" /> {activeTenant.nama}</span>}
        </div>

        {cart.length === 0 ? (
          <div className="empty-state" style={{ minHeight: "40vh" }}>
            <i className="bx bx-cart" />
            <p>Keranjang Anda masih kosong</p>
            <Link to="/tenants"><button className="btn btn-primary btn-sm" style={{ marginTop: "1rem" }}>Mulai Pesan</button></Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>
            {/* Left: Tabel Keranjang + Form POS */}
            <div>
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Kode</th><th>Nama Menu</th><th>Harga</th><th>Qty</th><th>Subtotal</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id_menu}>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{item.id_menu}</td>
                        <td style={{ fontWeight: 500 }}>{item.nama}</td>
                        <td>{formatRupiah(item.harga)}</td>
                        <td>
                          <div className="stepper">
                            <button onClick={() => updateQty(item.id_menu, item.qty - 1)}>−</button>
                            <input type="number" value={item.qty} min={1} max={99} onChange={(e) => updateQty(item.id_menu, Number(e.target.value))} />
                            <button onClick={() => updateQty(item.id_menu, item.qty + 1)}>+</button>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{formatRupiah(item.subtotal)}</td>
                        <td>
                          <button className="btn btn-icon btn-outline-danger btn-sm" onClick={() => removeItem(item.id_menu)}>
                            <i className="bx bx-trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "var(--bg-muted)" }}>
                      <td colSpan={4} style={{ textAlign: "right", fontWeight: 600, padding: "14px 16px" }}>TOTAL</td>
                      <td colSpan={2} style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--primary)", padding: "14px 16px" }}>{formatRupiah(total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Form Tambah Item Manual (POS) */}
              <div className="product-card" style={{ marginTop: "1.5rem", cursor: "default" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: 14.5, fontWeight: 600 }}><i className="bx bx-desktop" style={{ color: "var(--primary)", marginRight: 6 }} />Tambah Item via Kode</h3>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["ajax", "axios"].map((m) => (
                      <button key={m} className={`btn btn-sm${mode === m ? " btn-primary" : " btn-outline"}`} onClick={() => setMode(m)} style={{ textTransform: "uppercase", fontSize: 11, letterSpacing: 0.5 }}>{m}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, marginBottom: "0.75rem" }}>
                  <div className="form-input-icon">
                    <i className="bx bx-barcode icon" />
                    <input
                      className={`form-input${lookupError ? " error" : ""}`}
                      placeholder="Kode menu (mis. MB-0001)"
                      value={kodeInput}
                      onChange={(e) => setKodeInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && lookupMenu()}
                    />
                  </div>
                  <button className="btn btn-primary" onClick={lookupMenu} disabled={loadingLookup}>
                    {loadingLookup ? <span className="spinner" /> : <i className="bx bx-search" />}
                  </button>
                </div>
                {lookupError && <p className="input-error-msg"><i className="bx bx-error-circle" />{lookupError}</p>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <label className="form-label">Nama Menu</label>
                    <input className="form-input" readOnly value={autoFill.nama} placeholder="Terisi otomatis..." style={{ background: "var(--bg-muted)", cursor: "not-allowed" }} />
                  </div>
                  <div>
                    <label className="form-label">Harga</label>
                    <input className="form-input" readOnly value={autoFill.harga ? formatRupiah(autoFill.harga) : ""} placeholder="Terisi otomatis..." style={{ background: "var(--bg-muted)", cursor: "not-allowed" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Qty</label>
                    <div className="stepper">
                      <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                      <input type="number" value={qty} min={1} max={99} onChange={(e) => setQty(Number(e.target.value))} />
                      <button onClick={() => setQty(qty + 1)}>+</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <button className="btn btn-primary" disabled={!autoFill.nama} onClick={() => {
                      if (!autoFill.nama) return;
                      const fakeMenu = { id_menu: kodeInput.toUpperCase(), nama: autoFill.nama, harga: autoFill.harga, foto: "" };
                      for (let i = 0; i < qty; i++) useCart.addItem?.(fakeMenu);
                      setKodeInput(""); setAutoFill({ nama: "", harga: "" }); setQty(1);
                    }}>
                      <i className="bx bx-plus" /> Tambahkan
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: "0.5rem" }}>
                  Mode aktif: <strong>{mode.toUpperCase()}</strong> — tekan Enter atau klik ikon cari setelah isi kode
                </p>
              </div>
            </div>

            {/* Right: Ringkasan */}
            <div className="product-card" style={{ position: "sticky", top: 90, cursor: "default" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "1.25rem", color: "#0e1422" }}>Ringkasan Pesanan</h3>
              {activeTenant && <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: "0.75rem" }}><i className="bx bx-store" /> {activeTenant.nama}</p>}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
                {cart.map((item) => (
                  <div key={item.id_menu} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: "var(--text-muted)" }}>{item.nama} ×{item.qty}</span>
                    <span style={{ fontWeight: 500 }}>{formatRupiah(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "2px solid var(--border)", paddingTop: "0.75rem", marginTop: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>TOTAL</span>
                <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--primary)" }}>{formatRupiah(total)}</span>
              </div>
              <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: "1.25rem" }} onClick={() => navigate("/checkout")}>
                <i className="bx bx-credit-card" /> Lanjut ke Checkout
              </button>
              <Link to="/tenants">
                <button className="btn btn-outline btn-full" style={{ marginTop: "0.75rem" }}>
                  <i className="bx bx-left-arrow-alt" /> Lanjutkan Belanja
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
