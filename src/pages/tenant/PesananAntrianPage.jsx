import { useState, useEffect } from "react";
import PanelLayout from "../../components/common/PanelLayout";
import { mockAllOrders, mockAntrian } from "../../data/mockData";
import { formatRupiah, formatDateTime, statusColor, metodeBayarLabel } from "../../utils/helpers";

const NEW_ORDER_MOCK = {
  id: "ORD-000133",
  tenant: "Warung Bu Sri",
  customer: "Dewi Rahayu",
  total: 22000,
  metode: "nfc",
  status: "lunas",
  waktu: "2026-06-27T10:45:00",
  items: [{ nama: "Soto Ayam Lamongan", qty: 1, harga: 14000 }, { nama: "Es Teh Manis", qty: 1, harga: 5000 }],
};

export default function PesananAntrianPage() {
  const [activeTab, setActiveTab] = useState("pesanan");
  const [connected] = useState(true);
  const [pesananList, setPesananList] = useState(
    mockAllOrders.map((o) => ({ ...o, loading: false }))
  );
  const [antrianList, setAntrianList] = useState(mockAntrian);
  const [terlewatList, setTerlewatList] = useState([]);
  const [newOrderAnimId, setNewOrderAnimId] = useState(null);

  // Simulasi SSE: tambah 1 pesanan baru setelah 3 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      const exists = pesananList.find((o) => o.id === NEW_ORDER_MOCK.id);
      if (!exists) {
        setPesananList((prev) => [{ ...NEW_ORDER_MOCK, loading: false }, ...prev]);
        setNewOrderAnimId(NEW_ORDER_MOCK.id);
        setTimeout(() => setNewOrderAnimId(null), 2000);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  function handlePanggil(orderId) {
    setPesananList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, loading: true } : o))
    );
    setTimeout(() => {
      const order = pesananList.find((o) => o.id === orderId);
      if (order) {
        const nomorAntrian = antrianList.length + 1 + 129;
        setAntrianList((prev) => [
          ...prev,
          {
            id: Date.now(),
            nomor_antrian: nomorAntrian,
            nama: order.customer,
            tenant: order.tenant,
            status: "dipanggil",
            waktu: new Date().toISOString(),
          },
        ]);
        setPesananList((prev) => prev.filter((o) => o.id !== orderId));
      }
    }, 1200);
  }

  function handleTandaiDiambil(id) {
    setAntrianList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "diambil" } : a))
    );
  }

  function handleTandaiTerlewat(id) {
    const item = antrianList.find((a) => a.id === id);
    if (item) {
      setTerlewatList((prev) => [...prev, { ...item, status: "terlewat" }]);
      setAntrianList((prev) => prev.filter((a) => a.id !== id));
    }
  }

  const pesananCount = pesananList.length;
  const antrianCount = antrianList.filter((a) => a.status !== "diambil").length;

  return (
    <PanelLayout role="tenant">
      <div className="animate-fadein">
        <div className="page-header">
          <h1 className="page-title">
            <i className="bx bx-bell" /> Pesanan & Antrian
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className={`live-badge ${connected ? "" : "disconnected"}`}>
              <span className="live-dot" />
              {connected ? "SSE Terhubung" : "Terputus"}
            </div>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="tab-pills">
          <button
            className={`tab-pill ${activeTab === "pesanan" ? "active" : ""}`}
            onClick={() => setActiveTab("pesanan")}
          >
            Pesanan Masuk
            {pesananCount > 0 && (
              <span
                className="badge badge-danger"
                style={{ marginLeft: 6, padding: "1px 7px", fontSize: 11 }}
              >
                {pesananCount}
              </span>
            )}
          </button>
          <button
            className={`tab-pill ${activeTab === "antrian" ? "active" : ""}`}
            onClick={() => setActiveTab("antrian")}
          >
            Antrian
            {antrianCount > 0 && (
              <span
                className="badge badge-primary"
                style={{ marginLeft: 6, padding: "1px 7px", fontSize: 11 }}
              >
                {antrianCount}
              </span>
            )}
          </button>
          <button
            className={`tab-pill ${activeTab === "terlewat" ? "active" : ""}`}
            onClick={() => setActiveTab("terlewat")}
          >
            Terlewat
            {terlewatList.length > 0 && (
              <span
                className="badge badge-muted"
                style={{ marginLeft: 6, padding: "1px 7px", fontSize: 11 }}
              >
                {terlewatList.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab: Pesanan Masuk */}
        {activeTab === "pesanan" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pesananList.length === 0 && (
              <div className="empty-state">
                <i className="bx bx-receipt" />
                <p>Tidak ada pesanan masuk saat ini</p>
              </div>
            )}
            {pesananList.map((order) => (
              <div
                key={order.id}
                className={order.id === newOrderAnimId ? "animate-slideUp" : ""}
                style={{
                  background: "var(--bg)",
                  borderRadius: 12,
                  border: `1.5px solid ${order.id === newOrderAnimId ? "var(--primary)" : "var(--border-card)"}`,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                  boxShadow: order.id === newOrderAnimId ? "0 4px 20px rgba(1,31,67,0.15)" : undefined,
                }}
              >
                {order.id === newOrderAnimId && (
                  <div style={{ width: "100%", marginBottom: -4 }}>
                    <span className="badge badge-primary" style={{ fontSize: 11 }}>
                      <span className="live-dot" style={{ width: 6, height: 6 }} /> Pesanan Baru
                    </span>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: 13 }}>{order.id}</span>
                    <span className={`badge ${statusColor(order.status)}`}>{order.status}</span>
                    <span className="badge badge-primary">{metodeBayarLabel(order.metode)}</span>
                  </div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{order.customer}</p>
                  {order.items && (
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                      {order.items.map((it) => `${it.nama} ×${it.qty}`).join(", ")}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: "var(--primary)" }}>
                    {formatRupiah(order.total)}
                  </p>
                  <p style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
                    {formatDateTime(order.waktu)}
                  </p>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={order.loading}
                  onClick={() => handlePanggil(order.id)}
                  style={{ minWidth: 130 }}
                >
                  {order.loading ? (
                    <><span className="spinner" /> Memproses...</>
                  ) : (
                    <><i className="bx bx-bell-ring" /> Panggil / Siap</>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Antrian */}
        {activeTab === "antrian" && (
          <div style={{ background: "var(--bg)", borderRadius: 14, border: "1px solid var(--border-card)", overflow: "hidden" }}>
            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>No. Antrian</th>
                    <th>Nama</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {antrianList.map((a, i) => (
                    <tr key={a.id}>
                      <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{i + 1}</td>
                      <td>
                        <span style={{ fontWeight: 700, fontSize: 16, color: "var(--primary)" }}>
                          #{a.nomor_antrian}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{a.nama}</td>
                      <td>
                        <span className={`badge ${statusColor(a.status)}`}>
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          {a.status !== "diambil" && (
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => handleTandaiDiambil(a.id)}
                            >
                              <i className="bx bx-check" /> Tandai Diambil
                            </button>
                          )}
                          {a.status === "dipanggil" && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleTandaiTerlewat(a.id)}
                            >
                              Terlewat
                            </button>
                          )}
                          {a.status === "diambil" && (
                            <span className="badge badge-primary">Selesai</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {antrianList.length === 0 && (
              <div className="empty-state">
                <i className="bx bx-list-ol" />
                <p>Antrian kosong</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Terlewat */}
        {activeTab === "terlewat" && (
          <div>
            {terlewatList.length === 0 ? (
              <div className="empty-state">
                <i className="bx bx-time-five" />
                <p>Tidak ada pesanan terlewat</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {terlewatList.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "var(--bg)",
                      borderRadius: 12,
                      border: "1.5px solid var(--danger-light)",
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 16, color: "var(--danger)" }}>
                        #{item.nomor_antrian}
                      </span>
                      <span style={{ fontWeight: 500, marginLeft: 12 }}>{item.nama}</span>
                    </div>
                    <span className={`badge ${statusColor(item.status)}`}>Terlewat</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PanelLayout>
  );
}
