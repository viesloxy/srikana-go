import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerNavbar from "../../components/common/CustomerNavbar";
import { useCart } from "../../context/CartContext";
import { formatRupiah } from "../../utils/helpers";

const provinsi = ["Jawa Timur", "Jawa Barat", "Jawa Tengah", "DKI Jakarta", "Bali"];
const kotaMap = { "Jawa Timur": ["Surabaya", "Malang", "Sidoarjo", "Gresik"], "Jawa Barat": ["Bandung", "Bekasi", "Bogor"], "Jawa Tengah": ["Semarang", "Solo", "Yogyakarta"], "DKI Jakarta": ["Jakarta Pusat", "Jakarta Selatan", "Jakarta Utara"], "Bali": ["Denpasar", "Badung"] };

const payMethods = [
  { id: "va", icon: "bx bx-bank", label: "Virtual Account", desc: "BCA / BNI / Mandiri via Midtrans" },
  { id: "qris", icon: "bx bx-qr", label: "QRIS", desc: "Scan QR dengan aplikasi apapun" },
  { id: "nfc", icon: "bx bx-credit-card", label: "Kartu NFC Cashless", desc: "Saldo tersedia: Rp 25.000", saldo: 25000 },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, activeTenant, total } = useCart();
  const [form, setForm] = useState({ nama: "Muhammad Ikhsan", hp: "", email: "ikhsan@email.com" });
  const [orderType, setOrderType] = useState("dine-in");
  const [payMethod, setPayMethod] = useState("qris");
  const [address, setAddress] = useState({ provinsi: "", kota: "", kecamatan: "", kelurahan: "", detail: "" });
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    navigate("/order/132/confirm");
  };

  return (
    <div>
      <CustomerNavbar user="Ikhsan" />
      <div className="section-container" style={{ paddingTop: "1.5rem" }}>
        <div className="breadcrumb">
          <Link to="/">Beranda</Link><span className="sep">/</span>
          <Link to="/cart">Keranjang</Link><span className="sep">/</span>
          <span>Checkout</span>
        </div>
        <h1 className="page-title" style={{ marginBottom: "1.5rem" }}><i className="bx bx-credit-card" /> Checkout</h1>

        <form onSubmit={handlePay} noValidate>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>
            {/* Left */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Data Pemesan */}
              <div className="product-card" style={{ cursor: "default" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "1.25rem" }}><i className="bx bx-user" style={{ color: "var(--primary)", marginRight: 6 }} />Data Pemesan</h3>
                <div style={{ display: "grid", gap: "0.875rem" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Nama Lengkap</label>
                    <div className="form-input-icon"><i className="bx bx-user icon" /><input className="form-input" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required /></div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Nomor HP</label>
                      <div className="form-input-icon"><i className="bx bx-phone icon" /><input type="tel" className="form-input" value={form.hp} onChange={(e) => setForm({ ...form, hp: e.target.value })} placeholder="08xx..." required /></div>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Email</label>
                      <input type="email" className="form-input" value={form.email} readOnly style={{ background: "var(--bg-muted)", cursor: "not-allowed" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tipe Pesanan */}
              <div className="product-card" style={{ cursor: "default" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "1.25rem" }}><i className="bx bx-food-menu" style={{ color: "var(--primary)", marginRight: 6 }} />Tipe Pesanan</h3>
                <div style={{ display: "flex", gap: 12 }}>
                  {[{ id: "dine-in", icon: "bx bx-chair", label: "Dine-in", desc: "Makan di kawasan Srikana" }, { id: "takeaway", icon: "bx bx-package", label: "Takeaway", desc: "Bawa pulang" }].map((t) => (
                    <label key={t.id} style={{ flex: 1, border: `2px solid ${orderType === t.id ? "var(--primary)" : "#e5e5e5"}`, borderRadius: 12, padding: "16px", cursor: "pointer", background: orderType === t.id ? "var(--primary-light)" : "#fff", transition: "all 0.2s", display: "flex", gap: 10, alignItems: "center" }}>
                      <input type="radio" name="orderType" value={t.id} checked={orderType === t.id} onChange={() => setOrderType(t.id)} style={{ display: "none" }} />
                      <i className={t.icon} style={{ fontSize: 22, color: orderType === t.id ? "var(--primary)" : "#aaa" }} />
                      <div><p style={{ fontWeight: 600, fontSize: 13.5, color: orderType === t.id ? "var(--primary)" : "#333" }}>{t.label}</p><p style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.desc}</p></div>
                    </label>
                  ))}
                </div>

                {orderType === "takeaway" && (
                  <div style={{ marginTop: "1.25rem", display: "grid", gap: "0.75rem", animation: "slideInUp 0.3s ease" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      <div>
                        <label className="form-label">Provinsi</label>
                        <select className="form-select" value={address.provinsi} onChange={(e) => setAddress({ ...address, provinsi: e.target.value, kota: "", kecamatan: "", kelurahan: "" })}>
                          <option value="">Pilih Provinsi</option>
                          {provinsi.map((p) => <option key={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Kota / Kabupaten</label>
                        <select className="form-select" value={address.kota} onChange={(e) => setAddress({ ...address, kota: e.target.value })} disabled={!address.provinsi}>
                          <option value="">Pilih Kota</option>
                          {(kotaMap[address.provinsi] || []).map((k) => <option key={k}>{k}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Detail Alamat</label>
                      <textarea className="form-textarea" value={address.detail} onChange={(e) => setAddress({ ...address, detail: e.target.value })} placeholder="Nama jalan, nomor rumah, RT/RW..." />
                    </div>
                  </div>
                )}
              </div>

              {/* Metode Bayar */}
              <div className="product-card" style={{ cursor: "default" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "1.25rem" }}><i className="bx bx-wallet" style={{ color: "var(--primary)", marginRight: 6 }} />Metode Pembayaran</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {payMethods.map((m) => {
                    const nfcInsufficient = m.id === "nfc" && m.saldo < total;
                    return (
                      <label key={m.id} style={{ border: `2px solid ${payMethod === m.id ? "var(--primary)" : "#e5e5e5"}`, borderRadius: 12, padding: "14px 16px", cursor: nfcInsufficient ? "not-allowed" : "pointer", background: payMethod === m.id ? "var(--primary-light)" : "#fff", transition: "all 0.2s", display: "flex", gap: 12, alignItems: "center", opacity: nfcInsufficient ? 0.55 : 1 }}>
                        <input type="radio" name="payMethod" value={m.id} checked={payMethod === m.id} onChange={() => !nfcInsufficient && setPayMethod(m.id)} style={{ display: "none" }} />
                        <i className={m.icon} style={{ fontSize: 24, color: payMethod === m.id ? "var(--primary)" : "#aaa" }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, fontSize: 13.5, color: payMethod === m.id ? "var(--primary)" : "#333" }}>{m.label}</p>
                          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{m.desc}</p>
                        </div>
                        {nfcInsufficient && <span className="badge badge-danger">Saldo tidak cukup</span>}
                        {m.id === "nfc" && !nfcInsufficient && <span className="badge badge-success">Saldo tersedia</span>}
                        {payMethod === m.id && <i className="bx bx-check-circle" style={{ color: "var(--primary)", fontSize: 20 }} />}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Ringkasan */}
            <div className="product-card" style={{ position: "sticky", top: 90, cursor: "default" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: "1.25rem" }}>Ringkasan Pesanan</h3>
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
              <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: "1.25rem" }} disabled={loading}>
                {loading ? <><span className="spinner" /> Memproses...</> : <><i className="bx bx-credit-card" /> Bayar {formatRupiah(total)}</>}
              </button>
              <Link to="/cart"><button type="button" className="btn btn-outline btn-full" style={{ marginTop: "0.75rem" }}><i className="bx bx-left-arrow-alt" /> Kembali ke Keranjang</button></Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
