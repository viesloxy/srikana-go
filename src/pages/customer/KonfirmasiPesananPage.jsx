import { useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import CustomerNavbar from "../../components/common/CustomerNavbar";
import { mockOrders } from "../../data/mockData";
import { formatRupiah, formatDateTime, metodeBayarLabel } from "../../utils/helpers";

export default function KonfirmasiPesananPage() {
  const { id } = useParams();
  const order = mockOrders[0];

  return (
    <div>
      <CustomerNavbar user="Ikhsan" />
      <div className="section-container" style={{ paddingTop: "2rem", maxWidth: 700 }}>

        {/* Success Banner */}
        <div className="animate-fadein" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 80, height: 80, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <i className="bx bx-check-circle" style={{ fontSize: 40, color: "var(--success)" }} />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#16a34a", marginBottom: 8 }}>Pembayaran Berhasil!</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Tunjukkan QR code berikut kepada tenant untuk pengambilan pesanan Anda.</p>
        </div>

        {/* Struk */}
        <div className="product-card animate-slideUp" style={{ cursor: "default" }}>
          {/* Header Berkop */}
          <div style={{ textAlign: "center", paddingBottom: "1rem", borderBottom: "2px dashed #e5e5e5" }}>
            <div style={{ marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/logo.svg" alt="" style={{ height: 28 }} />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0e1422" }}>SWK Srikana Food Walk</h2>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Kawasan Kuliner UNAIR Surabaya</p>
          </div>

          {/* Info Pesanan */}
          <div style={{ padding: "1rem 0", borderBottom: "1px solid #eee" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: "bx bx-store", label: "Tenant", val: order.tenant },
                { icon: "bx bx-receipt", label: "No. Pesanan", val: order.id },
                { icon: "bx bx-user", label: "Customer", val: order.customer },
                { icon: "bx bx-calendar", label: "Waktu", val: formatDateTime(order.created_at) },
              ].map((i) => (
                <div key={i.label}>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}><i className={i.icon} style={{ marginRight: 4 }} />{i.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#0e1422" }}>{i.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Item List */}
          <div style={{ padding: "1rem 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <th style={{ textAlign: "left", padding: "6px 0", color: "var(--text-muted)", fontWeight: 500 }}>Item</th>
                  <th style={{ textAlign: "center", padding: "6px 0", color: "var(--text-muted)", fontWeight: 500 }}>Qty</th>
                  <th style={{ textAlign: "right", padding: "6px 0", color: "var(--text-muted)", fontWeight: 500 }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.nama} style={{ borderBottom: "1px dashed #eee" }}>
                    <td style={{ padding: "8px 0", fontWeight: 500 }}>{item.nama}</td>
                    <td style={{ textAlign: "center", color: "var(--text-muted)" }}>×{item.qty}</td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>{formatRupiah(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ textAlign: "right", fontWeight: 700, paddingTop: 10, fontSize: 14 }}>TOTAL</td>
                  <td style={{ textAlign: "right", fontWeight: 800, fontSize: "1.1rem", color: "var(--primary)", paddingTop: 10 }}>{formatRupiah(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Status + Metode */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 0", borderTop: "1px solid #eee", alignItems: "center" }}>
            <div><p style={{ fontSize: 12, color: "var(--text-muted)" }}>Metode</p><p style={{ fontWeight: 600, fontSize: 13 }}>{metodeBayarLabel(order.metode_bayar)}</p></div>
            <span className="badge badge-success" style={{ fontSize: 13, padding: "6px 16px" }}>LUNAS</span>
          </div>

          {/* QR + Antrian */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", padding: "1.5rem 0 0.5rem", borderTop: "2px dashed #e5e5e5" }}>
            {/* QR Code */}
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "inline-block", padding: 12, background: "#fff", borderRadius: 12, border: "1.5px solid var(--border-card)", boxShadow: "0 4px 12px rgba(0,0,0,0.07)" }}>
                <QRCodeSVG value={String(order.id_pesanan)} size={140} level="M" />
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>Tunjukkan QR ini kepada tenant</p>
            </div>

            {/* Nomor Antrian */}
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>NOMOR ANTRIAN ANDA</p>
              <div style={{ background: "var(--primary-light)", border: "3px solid var(--primary)", borderRadius: 16, padding: "12px 24px", animation: "glowPulse 2s infinite" }}>
                <p style={{ fontSize: "3.5rem", fontWeight: 900, color: "var(--primary)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>#{order.nomor_antrian}</p>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>Tunggu dipanggil oleh tenant</p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: "1.5rem", flexWrap: "wrap" }}>
            <button className="btn btn-outline" onClick={() => window.print()}>
              <i className="bx bx-file-pdf" /> Unduh Struk PDF
            </button>
            <Link to="/antrian" style={{ flex: 1 }}>
              <button className="btn btn-primary btn-full">
                <i className="bx bx-list-ol" /> Pantau Antrian
              </button>
            </Link>
          </div>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Link to="/tenants" style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <i className="bx bx-left-arrow-alt" /> Pesan Lagi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
