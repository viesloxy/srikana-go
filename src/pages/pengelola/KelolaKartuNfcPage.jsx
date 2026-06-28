import { useState } from "react";
import PanelLayout from "../../components/common/PanelLayout";
import { mockKartuNfcAll } from "../../data/mockData";
import { formatRupiah, formatDate, statusColor } from "../../utils/helpers";

export default function KelolaKartuNfcPage() {
  const [cards, setCards] = useState(mockKartuNfcAll);
  const [search, setSearch] = useState("");
  const [showScanModal, setShowScanModal] = useState(false);
  const [showBindModal, setShowBindModal] = useState(false);
  const [nfcStatus, setNfcStatus] = useState("idle");
  const [scannedSerial, setScannedSerial] = useState("");
  const [bindingCard, setBindingCard] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showBlockConfirm, setShowBlockConfirm] = useState(null);

  const filtered = cards.filter((c) =>
    c.serial.toLowerCase().includes(search.toLowerCase()) ||
    (c.customer || "").toLowerCase().includes(search.toLowerCase())
  );

  const startNfcScan = async () => {
    setNfcStatus("scanning");
    await new Promise((r) => setTimeout(r, 2500));
    const serial = `${Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, "0")}:${Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, "0")}:AA:BB`;
    setScannedSerial(serial);
    setNfcStatus("found");
  };

  const handleBlock = (id) => {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === "aktif" ? "blokir" : "aktif" } : c));
    setShowBlockConfirm(null);
  };

  const mockCustomers = [
    { id: 1, nama: "Muhammad Ikhsan", email: "ikhsan@email.com" },
    { id: 2, nama: "Sari Dewi", email: "sari@email.com" },
    { id: 3, nama: "Budi Santoso", email: "budi@email.com" },
    { id: 4, nama: "Rina Anggraini", email: "rina@email.com" },
  ];

  return (
    <PanelLayout role="pengelola" userName="Pengelola">
      <div className="page-header">
        <h1 className="page-title"><i className="bx bx-credit-card" /> Kelola Kartu NFC</h1>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => { setShowScanModal(true); setNfcStatus("idle"); setScannedSerial(""); }}>
            <i className="bx bx-wifi" /> Daftarkan Kartu Baru
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: "1.5rem" }}>
        {[
          { label: "Total Kartu", val: cards.length, icon: "bx bx-credit-card", color: "var(--primary)" },
          { label: "Kartu Aktif", val: cards.filter((c) => c.status === "aktif").length, icon: "bx bx-check-circle", color: "var(--success)" },
          { label: "Kartu Diblokir", val: cards.filter((c) => c.status === "blokir").length, icon: "bx bx-block", color: "var(--danger)" },
          { label: "Belum Terikat", val: cards.filter((c) => !c.customer).length, icon: "bx bx-link-alt", color: "var(--warning)" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: `${s.color}18`, color: s.color }}><i className={s.icon} /></div>
            <div className="stat-value">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="filter-section" style={{ marginBottom: "1rem" }}>
        <div className="filter-section-container">
          <div className="info-alert"><i className="bx bx-info-circle" />Menampilkan <strong style={{ marginInline: 4 }}>{filtered.length}</strong> kartu</div>
          <div className="filter-right">
            <div className="search-container">
              <i className="bx bx-search search-icon" />
              <input className="search-input" placeholder="Cari serial atau nama customer..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Serial Number</th>
              <th>Customer</th>
              <th>Saldo</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((card, i) => (
              <tr key={card.id}>
                <td style={{ color: "var(--text-muted)" }}>{i + 1}</td>
                <td style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 500, letterSpacing: 1, color: "var(--primary)" }}>{card.serial}</td>
                <td>
                  {card.customer ? (
                    <div>
                      <p style={{ fontWeight: 500 }}>{card.customer}</p>
                      <p style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{card.email}</p>
                    </div>
                  ) : (
                    <span className="badge badge-muted"><i className="bx bx-unlink" style={{ marginRight: 4 }} />Belum terikat</span>
                  )}
                </td>
                <td style={{ fontWeight: 600 }}>{formatRupiah(card.saldo)}</td>
                <td>
                  <span className={`badge ${statusColor(card.status)}`}>
                    {card.status === "aktif" ? "Aktif" : "Diblokir"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => { setBindingCard(card); setShowBindModal(true); }}
                      title={card.customer ? "Ganti Customer" : "Bind Customer"}
                    >
                      <i className={`bx ${card.customer ? "bx-refresh" : "bx-link"}`} /> {card.customer ? "Ganti" : "Bind"}
                    </button>
                    <button
                      className={`btn btn-sm ${card.status === "aktif" ? "btn-outline-danger" : "btn-outline"}`}
                      onClick={() => setShowBlockConfirm(card)}
                    >
                      <i className={`bx ${card.status === "aktif" ? "bx-block" : "bx-check"}`} />
                      {card.status === "aktif" ? " Blokir" : " Aktifkan"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state"><i className="bx bx-credit-card" /><p>Tidak ada kartu ditemukan</p></div>
        )}
      </div>

      {/* Modal Scan NFC */}
      {showScanModal && (
        <div className="modal-overlay" onClick={() => setShowScanModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title"><i className="bx bx-wifi" style={{ color: "var(--primary)", marginRight: 6 }} />Daftarkan Kartu NFC Baru</span>
              <button className="modal-close" onClick={() => setShowScanModal(false)}><i className="bx bx-x" /></button>
            </div>
            <div className="modal-body" style={{ textAlign: "center" }}>
              {nfcStatus === "idle" && (
                <>
                  <i className="bx bx-wifi" style={{ fontSize: 64, color: "var(--primary)", margin: "1rem 0" }} />
                  <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Siapkan Kartu NFC</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: "1.5rem" }}>Scan kartu NFC menggunakan Android Chrome ≥ 89 via HTTPS</p>
                  <button className="btn btn-primary btn-lg" onClick={startNfcScan}><i className="bx bx-scan" /> Mulai Scan</button>
                  <div className="divider" style={{ margin: "1.25rem 0" }}>atau masukkan manual</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input className="form-input" placeholder="Serial Number (XX:XX:XX:XX)" value={scannedSerial} onChange={(e) => setScannedSerial(e.target.value)} />
                    <button className="btn btn-outline" onClick={() => scannedSerial && setNfcStatus("found")}><i className="bx bx-check" /></button>
                  </div>
                </>
              )}
              {nfcStatus === "scanning" && (
                <div style={{ padding: "1.5rem 0" }}>
                  <i className="bx bx-wifi" style={{ fontSize: 64, color: "var(--primary)", marginBottom: "1rem", animation: "pulse 1s infinite" }} />
                  <p style={{ fontWeight: 600 }}>Menunggu kartu NFC...</p>
                  <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 6 }}>Dekatkan kartu ke belakang HP</p>
                  <div style={{ marginTop: "1rem" }}>
                    <i className="bx bx-loader" style={{ display: "inline-block", fontSize: 20, color: "var(--primary)", animation: "spin 1s linear infinite" }} />
                  </div>
                </div>
              )}
              {nfcStatus === "found" && (
                <>
                  <i className="bx bx-check-circle" style={{ fontSize: 48, color: "var(--success)", margin: "1rem 0" }} />
                  <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Kartu Terdeteksi!</p>
                  <p style={{ fontFamily: "monospace", fontSize: 18, color: "var(--primary)", letterSpacing: 3, marginBottom: "1rem" }}>{scannedSerial}</p>
                  <div className="form-group">
                    <label className="form-label">Bind ke Customer (Opsional)</label>
                    <select className="form-select">
                      <option value="">-- Simpan tanpa binding --</option>
                      {mockCustomers.map((c) => <option key={c.id} value={c.id}>{c.nama} ({c.email})</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>
            {nfcStatus === "found" && (
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => { setShowScanModal(false); setNfcStatus("idle"); }}>Batal</button>
                <button className="btn btn-primary" onClick={() => {
                  setCards((prev) => [...prev, { id: prev.length + 1, serial: scannedSerial, customer: null, email: null, saldo: 0, status: "aktif" }]);
                  setShowScanModal(false); setNfcStatus("idle");
                }}>
                  <i className="bx bx-check" /> Simpan & Daftarkan
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Bind Customer */}
      {showBindModal && bindingCard && (
        <div className="modal-overlay" onClick={() => setShowBindModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title"><i className="bx bx-link" style={{ color: "var(--primary)", marginRight: 6 }} />Bind Kartu ke Customer</span>
              <button className="modal-close" onClick={() => setShowBindModal(false)}><i className="bx bx-x" /></button>
            </div>
            <div className="modal-body">
              <div className="alert alert-info" style={{ marginBottom: "1rem" }}>
                <i className="bx bx-credit-card" /> Serial: <strong style={{ fontFamily: "monospace" }}>{bindingCard.serial}</strong>
              </div>
              <div className="form-group">
                <label className="form-label">Cari Customer</label>
                <div className="form-input-icon"><i className="bx bx-search icon" /><input className="form-input" placeholder="Nama atau email..." value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} /></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {mockCustomers.filter((c) => c.nama.toLowerCase().includes(customerSearch.toLowerCase()) || c.email.toLowerCase().includes(customerSearch.toLowerCase())).map((c) => (
                  <button key={c.id} className="btn btn-outline" style={{ justifyContent: "flex-start", gap: 10 }}
                    onClick={() => {
                      setCards((prev) => prev.map((card) => card.id === bindingCard.id ? { ...card, customer: c.nama, email: c.email } : card));
                      setShowBindModal(false); setCustomerSearch("");
                    }}>
                    <i className="bx bx-user" style={{ color: "var(--primary)" }} />
                    <div style={{ textAlign: "left" }}><p style={{ fontWeight: 500 }}>{c.nama}</p><p style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.email}</p></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Blokir */}
      {showBlockConfirm && (
        <div className="modal-overlay" onClick={() => setShowBlockConfirm(null)}>
          <div className="modal-box" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{showBlockConfirm.status === "aktif" ? "Blokir Kartu" : "Aktifkan Kartu"}</span>
              <button className="modal-close" onClick={() => setShowBlockConfirm(null)}><i className="bx bx-x" /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 14, lineHeight: 1.7 }}>
                {showBlockConfirm.status === "aktif"
                  ? <>Blokir kartu <strong style={{ fontFamily: "monospace" }}>{showBlockConfirm.serial}</strong>? Customer tidak dapat menggunakan kartu ini.</>
                  : <>Aktifkan kembali kartu <strong style={{ fontFamily: "monospace" }}>{showBlockConfirm.serial}</strong>?</>
                }
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowBlockConfirm(null)}>Batal</button>
              <button className={`btn ${showBlockConfirm.status === "aktif" ? "btn-danger" : "btn-primary"}`} onClick={() => handleBlock(showBlockConfirm.id)}>
                <i className={`bx ${showBlockConfirm.status === "aktif" ? "bx-block" : "bx-check"}`} />
                {showBlockConfirm.status === "aktif" ? " Blokir" : " Aktifkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PanelLayout>
  );
}
