import { useState, useEffect, useRef } from "react";
import { mockAntrian, mockTenants } from "../../data/mockData";

const CALL_INTERVAL = 8000;

const numberToWords = (n) => {
  const ones = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan",
    "sepuluh", "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas",
    "enam belas", "tujuh belas", "delapan belas", "sembilan belas"];
  const tens = ["", "", "dua puluh", "tiga puluh", "empat puluh", "lima puluh",
    "enam puluh", "tujuh puluh", "delapan puluh", "sembilan puluh"];
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o ? `${tens[t]} ${ones[o]}` : tens[t];
};

export default function PapanAntrianPage() {
  const [queue, setQueue] = useState(mockAntrian);
  const [calledNumber, setCalledNumber] = useState(131);
  const [calledTenant, setCalledTenant] = useState("Warung Bu Sari");
  const [nextNumbers, setNextNumbers] = useState([132, 133, 134]);
  const [connected, setConnected] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [clock, setClock] = useState(new Date());
  const [speaking, setSpeaking] = useState(false);
  const callIndexRef = useRef(131);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate SSE — advance queue every CALL_INTERVAL ms
  useEffect(() => {
    const timer = setInterval(() => {
      callIndexRef.current += 1;
      const newNum = callIndexRef.current;
      const matching = queue.find((q) => q.nomor_antrian === newNum);
      const tenant = matching?.tenant || mockTenants[Math.floor(Math.random() * mockTenants.length)].nama;

      setCalledNumber(newNum);
      setCalledTenant(tenant);
      setNextNumbers([newNum + 1, newNum + 2, newNum + 3]);
      setAnimating(true);
      setQueue((prev) => prev.map((q) => q.nomor_antrian === newNum - 1 ? { ...q, status: "diambil" } : q.nomor_antrian === newNum ? { ...q, status: "dipanggil" } : q));

      announce(newNum, tenant);

      setTimeout(() => setAnimating(false), 1200);
    }, CALL_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const announce = (num, tenant) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const text = `Nomor antrian ${numberToWords(num)}, silakan menuju ke ${tenant}`;
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "id-ID";
    utt.rate = 0.9;
    utt.pitch = 1.1;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const formatClock = (d) =>
    d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const formatDate = (d) =>
    d.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const waiting = queue.filter((q) => q.status === "menunggu");
  const called = queue.filter((q) => q.status === "dipanggil");
  const taken = queue.filter((q) => q.status === "diambil");

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0d2240 50%, #0a1628 100%)",
      color: "#fff",
      fontFamily: "'Poppins', sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Decorative background blobs */}
      <div style={{ position: "fixed", top: -120, left: -120, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(1,31,67,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, right: -100, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.svg" alt="SrikanaGo" style={{ height: 36 }} />
          <div>
            <p style={{ fontWeight: 800, fontSize: 18, letterSpacing: 0.5 }}>SrikanaGo</p>
            <p style={{ fontSize: 11, opacity: 0.6 }}>SWK Srikana Food Walk — Universitas Airlangga</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 28, fontWeight: 800, fontFamily: "monospace", color: "#60a5fa", letterSpacing: 2 }}>{formatClock(clock)}</p>
          <p style={{ fontSize: 12, opacity: 0.6 }}>{formatDate(clock)}</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 0, minHeight: "calc(100vh - 80px)" }}>

        {/* Left — Main Display */}
        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <p style={{ fontSize: 14, opacity: 0.5, textTransform: "uppercase", letterSpacing: 2 }}>Nomor Antrian Dipanggil</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: connected ? "#22c55e" : "#f59e0b", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 12, color: connected ? "#22c55e" : "#f59e0b" }}>{connected ? "Live" : "Reconnecting..."}</span>
            </div>
            {speaking && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#fbbf24", fontSize: 13 }}>
                <i className="bx bx-volume-full" style={{ animation: "pulse 0.5s infinite" }} />
                <span>Mengumumkan...</span>
              </div>
            )}
          </div>

          {/* Main Number Display */}
          <div style={{
            background: "rgba(1,31,67,0.12)",
            border: "2px solid rgba(1,31,67,0.3)",
            borderRadius: 24,
            padding: "3rem 2rem",
            textAlign: "center",
            animation: animating ? "scaleBounce 0.6s ease" : "none",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, background: animating ? "rgba(1,31,67,0.08)" : "transparent", transition: "background 0.3s" }} />
            <p style={{ fontSize: 14, opacity: 0.5, textTransform: "uppercase", letterSpacing: 3, marginBottom: "0.5rem" }}>Silakan Menuju</p>
            <p style={{ fontSize: "8rem", fontWeight: 900, lineHeight: 1, color: "#60a5fa", letterSpacing: -2, textShadow: "0 0 80px rgba(96,165,250,0.5)", animation: animating ? "glowPulse 0.8s ease" : "none" }}>
              #{calledNumber}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: "0.75rem" }}>
              <i className="bx bx-store" style={{ fontSize: 18, color: "#60a5fa" }} />
              <p style={{ fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>{calledTenant}</p>
            </div>
          </div>

          {/* Next Numbers */}
          <div>
            <p style={{ fontSize: 12, opacity: 0.5, textTransform: "uppercase", letterSpacing: 2, marginBottom: "0.75rem" }}>Antrian Berikutnya</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {nextNumbers.map((n, i) => (
                <div key={n} style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  padding: "1rem",
                  textAlign: "center",
                  opacity: 1 - i * 0.2,
                }}>
                  <p style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>+{i + 1}</p>
                  <p style={{ fontSize: "2.5rem", fontWeight: 800, color: "#94a3b8" }}>#{n}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { label: "Menunggu", val: waiting.length, color: "#fbbf24", icon: "bx bx-time" },
              { label: "Dipanggil", val: called.length, color: "#60a5fa", icon: "bx bx-bell-ring" },
              { label: "Selesai", val: taken.length, color: "#22c55e", icon: "bx bx-check-circle" },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1rem", display: "flex", alignItems: "center", gap: 12 }}>
                <i className={s.icon} style={{ fontSize: 24, color: s.color }} />
                <div>
                  <p style={{ fontSize: "1.75rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</p>
                  <p style={{ fontSize: 12, opacity: 0.5 }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Queue Sidebar */}
        <div style={{ background: "rgba(0,0,0,0.25)", borderLeft: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem 1rem", overflowY: "auto", maxHeight: "calc(100vh - 80px)" }}>
          <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.5, textTransform: "uppercase", letterSpacing: 2, marginBottom: "1rem" }}>Daftar Antrian</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {queue.map((q) => {
              const isActive = q.nomor_antrian === calledNumber;
              const isDone = q.status === "diambil";
              return (
                <div key={q.id} style={{
                  background: isActive ? "rgba(1,31,67,0.25)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? "rgba(96,165,250,0.5)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 10,
                  padding: "0.625rem 0.875rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  opacity: isDone ? 0.4 : 1,
                  transition: "all 0.3s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 800, fontSize: 16, color: isActive ? "#60a5fa" : "#e2e8f0", minWidth: 36 }}>#{q.nomor_antrian}</span>
                    <div>
                      <p style={{ fontSize: 12.5, fontWeight: 500, color: "#e2e8f0" }}>{q.nama}</p>
                      <p style={{ fontSize: 11, opacity: 0.5 }}>{q.tenant}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10,
                    padding: "2px 7px",
                    borderRadius: 6,
                    background: isActive ? "rgba(96,165,250,0.2)" : isDone ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.07)",
                    color: isActive ? "#60a5fa" : isDone ? "#22c55e" : "#94a3b8",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}>
                    {isDone ? "Selesai" : isActive ? "Dipanggil" : "Menunggu"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer instruction */}
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(1,31,67,0.08)", borderRadius: 10, border: "1px solid rgba(1,31,67,0.2)" }}>
            <p style={{ fontSize: 12, opacity: 0.6, textAlign: "center", lineHeight: 1.6 }}>
              <i className="bx bx-bell" style={{ marginRight: 4 }} />
              Pantau antrian Anda di aplikasi SrikanaGo.<br />
              Aktifkan notifikasi agar tidak terlewat.
            </p>
          </div>
        </div>
      </div>

      {/* Inline style for animations */}
      <style>{`
        @keyframes scaleBounce {
          0% { transform: scale(1); }
          40% { transform: scale(1.04); }
          70% { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 80px rgba(96,165,250,0.5); }
          50% { text-shadow: 0 0 120px rgba(96,165,250,0.9), 0 0 200px rgba(96,165,250,0.4); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
