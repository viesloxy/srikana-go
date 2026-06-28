import { useState } from "react";
import PanelLayout from "../../components/common/PanelLayout";
import { mockMenus } from "../../data/mockData";
import { formatRupiah } from "../../utils/helpers";

export default function KasirPosPage() {
  const [kodeInput, setKodeInput] = useState("");
  const [autoFill, setAutoFill] = useState(null);
  const [qty, setQty] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [mode, setMode] = useState("ajax");
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [showPayModal, setShowPayModal] = useState(false);
  const [metodeBayar, setMetodeBayar] = useState("tunai");
  const [nominalTunai, setNominalTunai] = useState("");
  const [paySuccess, setPaySuccess] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const kembalian = nominalTunai ? Math.max(0, Number(nominalTunai) - total) : 0;

  function handleLookup(e) {
    if (e.key !== "Enter") return;
    if (!kodeInput.trim()) return;
    setLoadingLookup(true);
    setLookupError("");
    setAutoFill(null);

    setTimeout(() => {
      const found = mockMenus.find(
        (m) =>
          m.id_menu.toLowerCase() === kodeInput.trim().toLowerCase() ||
          m.nama.toLowerCase().includes(kodeInput.trim().toLowerCase())
      );
      if (found) {
        setAutoFill({ nama: found.nama, harga: found.harga, id_menu: found.id_menu });
      } else {
        setLookupError(`Kode "${kodeInput}" tidak ditemukan.`);
      }
      setLoadingLookup(false);
    }, 600);
  }

  function addToCart() {
    if (!autoFill) return;
    setCartItems((prev) => {
      const exist = prev.find((c) => c.id_menu === autoFill.id_menu);
      if (exist) {
        return prev.map((c) =>
          c.id_menu === autoFill.id_menu
            ? { ...c, qty: c.qty + qty, subtotal: (c.qty + qty) * c.harga }
            : c
        );
      }
      return [...prev, { id_menu: autoFill.id_menu, nama: autoFill.nama, harga: autoFill.harga, qty, subtotal: autoFill.harga * qty }];
    });
    setKodeInput("");
    setAutoFill(null);
    setQty(1);
    setLookupError("");
  }

  function removeFromCart(id_menu) {
    setCartItems((prev) => prev.filter((c) => c.id_menu !== id_menu));
  }

  function handlePay() {
    setPaySuccess(true);
    setTimeout(() => {
      setCartItems([]);
      setShowPayModal(false);
      setPaySuccess(false);
      setNominalTunai("");
      setMetodeBayar("tunai");
    }, 1500);
  }

  return (
    <PanelLayout role="tenant">
      <div className="animate-fadein">
        <div className="page-header">
          <h1 className="page-title">
            <i className="bx bx-store" /> Kasir POS
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Mode Request:</span>
            {["ajax", "axios"].map((m) => (
              <button
                key={m}
                className={`tab-pill ${mode === m ? "active" : ""}`}
                style={{ padding: "5px 14px", fontSize: 12 }}
                onClick={() => setMode(m)}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* LEFT: Input Form (60%) */}
          <div style={{ flex: "0 0 60%", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "var(--bg)", borderRadius: 14, border: "1px solid var(--border-card)", padding: 20 }}>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
                <i className="bx bx-barcode-reader" style={{ color: "var(--primary)", marginRight: 6 }} />
                Input Kode / Nama Menu
              </p>

              <div className="form-group">
                <label className="form-label">Scan / Ketik Kode Menu (tekan Enter)</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className={`form-input ${lookupError ? "error" : ""}`}
                    placeholder="Contoh: MB-0001 atau Nasi Goreng"
                    value={kodeInput}
                    onChange={(e) => { setKodeInput(e.target.value); setLookupError(""); }}
                    onKeyDown={handleLookup}
                    disabled={loadingLookup}
                    autoFocus
                  />
                  <button
                    className="btn btn-outline"
                    style={{ whiteSpace: "nowrap", minWidth: 100 }}
                    onClick={() => handleLookup({ key: "Enter" })}
                    disabled={loadingLookup || !kodeInput}
                  >
                    {loadingLookup ? (
                      <><span className="spinner" /> Cari...</>
                    ) : (
                      <><i className="bx bx-search" /> Cari</>
                    )}
                  </button>
                </div>
                {lookupError && <p className="input-error-msg"><i className="bx bx-error-circle" /> {lookupError}</p>}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  padding: 12,
                  background: "var(--bg-muted)",
                  borderRadius: 10,
                  marginBottom: 12,
                  opacity: autoFill ? 1 : 0.5,
                  transition: "opacity 0.3s",
                }}
              >
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Nama Menu (auto-fill)</label>
                  <input className="form-input" readOnly value={autoFill?.nama || ""} placeholder="—" style={{ background: "#f0f4ff" }} />
                </div>
                <div className="form-group" style={{ width: 150, marginBottom: 0 }}>
                  <label className="form-label">Harga Satuan</label>
                  <input className="form-input" readOnly value={autoFill ? formatRupiah(autoFill.harga) : ""} placeholder="—" style={{ background: "#f0f4ff" }} />
                </div>
              </div>

              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div>
                  <label className="form-label">Jumlah</label>
                  <div className="stepper">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                    <input
                      type="number"
                      value={qty}
                      min={1}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                    />
                    <button onClick={() => setQty((q) => q + 1)}>+</button>
                  </div>
                </div>
                {autoFill && (
                  <div style={{ alignSelf: "flex-end", marginBottom: 2 }}>
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Subtotal:</span>{" "}
                    <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: 15 }}>
                      {formatRupiah(autoFill.harga * qty)}
                    </span>
                  </div>
                )}
              </div>

              <button
                className="btn btn-primary btn-full"
                disabled={!autoFill}
                onClick={addToCart}
                style={{ marginTop: 4 }}
              >
                <i className="bx bx-cart-add" /> Tambahkan ke Keranjang
              </button>
            </div>

            {/* Mode Info */}
            <div className="alert alert-info">
              <i className="bx bx-info-circle" />
              <span>
                Mode <strong>{mode.toUpperCase()}</strong> aktif — lookup data menggunakan simulasi {mode === "ajax" ? "XMLHttpRequest (AJAX)" : "Promise-based (Axios)"} dengan delay 600ms.
              </span>
            </div>
          </div>

          {/* RIGHT: Cart (40%, sticky) */}
          <div style={{ flex: "0 0 40%", position: "sticky", top: 80 }}>
            <div style={{ background: "var(--bg)", borderRadius: 14, border: "1px solid var(--border-card)", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", background: "var(--primary)", color: "#fff" }}>
                <p style={{ fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <i className="bx bx-cart" /> Keranjang
                  {cartItems.length > 0 && (
                    <span style={{ background: "#fff", color: "var(--primary)", borderRadius: "50%", width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                      {cartItems.reduce((s, c) => s + c.qty, 0)}
                    </span>
                  )}
                </p>
              </div>

              <div style={{ minHeight: 200, padding: cartItems.length === 0 ? 0 : "8px 0" }}>
                {cartItems.length === 0 ? (
                  <div className="empty-state" style={{ padding: "2rem" }}>
                    <i className="bx bx-cart-alt" />
                    <p>Keranjang kosong</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id_menu}
                      className="animate-slideUp"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 16px",
                        borderBottom: "1px solid var(--border)",
                        gap: 10,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 500 }}>{item.nama}</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          {formatRupiah(item.harga)} × {item.qty}
                        </p>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: "var(--primary)", whiteSpace: "nowrap" }}>
                        {formatRupiah(item.subtotal)}
                      </span>
                      <button
                        className="btn btn-outline-danger btn-icon btn-sm"
                        onClick={() => removeFromCart(item.id_menu)}
                      >
                        <i className="bx bx-x" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div style={{ padding: "14px 16px", borderTop: "1.5px solid var(--border)", background: "var(--bg-muted)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                  <span>TOTAL</span>
                  <span style={{ color: "var(--primary)", fontSize: 17 }}>{formatRupiah(total)}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-primary btn-full"
                    disabled={cartItems.length === 0}
                    onClick={() => setShowPayModal(true)}
                  >
                    <i className="bx bx-money" /> Bayar & Simpan
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={cartItems.length === 0}
                    onClick={() => alert("Fitur cetak struk membutuhkan printer terhubung.")}
                    title="Cetak Struk"
                  >
                    <i className="bx bx-printer" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Modal */}
      {showPayModal && (
        <div className="modal-overlay" onClick={() => !paySuccess && setShowPayModal(false)}>
          <div className="modal-box" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                <i className="bx bx-money" style={{ marginRight: 6, color: "var(--primary)" }} />
                Konfirmasi Pembayaran
              </span>
              {!paySuccess && (
                <button className="modal-close" onClick={() => setShowPayModal(false)}>
                  <i className="bx bx-x" />
                </button>
              )}
            </div>
            {paySuccess ? (
              <div className="modal-body" style={{ textAlign: "center", padding: "2rem" }}>
                <i className="bx bx-check-circle" style={{ fontSize: 50, color: "var(--success)", marginBottom: 12 }} />
                <p style={{ fontWeight: 600, fontSize: 15 }}>Pembayaran Berhasil!</p>
                <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Total: {formatRupiah(total)}</p>
              </div>
            ) : (
              <>
                <div className="modal-body">
                  <div style={{ background: "var(--bg-muted)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15 }}>
                      <span>Total Tagihan</span>
                      <span style={{ color: "var(--primary)" }}>{formatRupiah(total)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                      {cartItems.length} item × {cartItems.reduce((s, c) => s + c.qty, 0)} pcs
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Metode Pembayaran</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["tunai", "qris"].map((m) => (
                        <button
                          key={m}
                          className={`tab-pill ${metodeBayar === m ? "active" : ""}`}
                          onClick={() => setMetodeBayar(m)}
                        >
                          {m === "tunai" ? "Tunai" : "QRIS"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {metodeBayar === "tunai" && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Nominal Tunai Diterima</label>
                        <input
                          className="form-input"
                          type="number"
                          placeholder="Masukkan nominal..."
                          value={nominalTunai}
                          onChange={(e) => setNominalTunai(e.target.value)}
                        />
                      </div>
                      {nominalTunai && Number(nominalTunai) >= total && (
                        <div className="alert alert-success" style={{ marginTop: 0 }}>
                          <i className="bx bx-money" />
                          <span>Kembalian: <strong>{formatRupiah(kembalian)}</strong></span>
                        </div>
                      )}
                      {nominalTunai && Number(nominalTunai) < total && (
                        <div className="alert alert-danger" style={{ marginTop: 0 }}>
                          <i className="bx bx-error" />
                          <span>Uang kurang {formatRupiah(total - Number(nominalTunai))}</span>
                        </div>
                      )}
                    </>
                  )}

                  {metodeBayar === "qris" && (
                    <div style={{ textAlign: "center", padding: "1rem 0" }}>
                      <div
                        style={{
                          width: 140,
                          height: 140,
                          margin: "0 auto",
                          background: "#f0f4ff",
                          border: "2px dashed var(--primary)",
                          borderRadius: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          color: "var(--primary)",
                          fontWeight: 500,
                        }}
                      >
                        <div>
                          <i className="bx bx-qr" style={{ fontSize: 36, color: "var(--primary)" }} />
                          <div>QR Code</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Scan untuk bayar</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-outline btn-sm" onClick={() => setShowPayModal(false)}>Batal</button>
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={metodeBayar === "tunai" && (!nominalTunai || Number(nominalTunai) < total)}
                    onClick={handlePay}
                  >
                    <i className="bx bx-check" /> Konfirmasi Bayar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </PanelLayout>
  );
}
