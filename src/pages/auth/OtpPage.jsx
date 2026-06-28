import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function OtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); setCanResend(true); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError("");
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = Array(6).fill("");
    text.split("").forEach((c, i) => { next[i] = c; });
    setOtp(next);
    inputRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Masukkan 6 digit kode OTP"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    if (code === "123456" || true) {
      navigate("/");
    } else {
      setError("Kode OTP salah atau sudah kedaluwarsa");
      setShake(true);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(timer); setCanResend(true); return 0; } return c - 1; });
    }, 1000);
  };

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <header className="app-navbar">
        <div className="app-bar-container">
          <div className="left-section">
            <img src="/logo.svg" alt="SrikanaGo" style={{ height: 30 }} />
            <span className="title">SrikanaGo</span>
          </div>
        </div>
      </header>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, backgroundImage: "url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=60)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.06 }} />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", zIndex: 1 }}>
        <div className="animate-fadein" style={{ background: "var(--bg)", borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.1)", border: "1px solid var(--border-card)", textAlign: "center" }}>

          <div style={{ width: 70, height: 70, background: "var(--primary-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: 32 }}>
            <i className="bx bx-envelope-open" style={{ color: "var(--primary)" }} />
          </div>

          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0e1422", marginBottom: 8 }}>Verifikasi Email</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: "2rem", lineHeight: 1.6 }}>
            Kode OTP 6 digit telah dikirim ke<br />
            <strong style={{ color: "#0e1422" }}>user@email.com</strong>
          </p>

          {error && <div className="alert alert-danger" style={{ textAlign: "left", marginBottom: "1rem" }}><i className="bx bx-error-circle" />{error}</div>}

          {/* OTP Inputs */}
          <div className={shake ? "animate-shake" : ""} style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: "1.5rem" }} onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: 48, height: 56,
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  border: `2px solid ${digit ? "var(--primary)" : "#e5e5e5"}`,
                  borderRadius: 10,
                  outline: "none",
                  background: digit ? "var(--primary-light)" : "var(--bg)",
                  color: "var(--primary)",
                  transition: "border-color 0.2s, background 0.2s",
                  fontFamily: "Poppins",
                }}
              />
            ))}
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleVerify}
            disabled={loading || otp.join("").length < 6}
          >
            {loading ? <><span className="spinner" /> Memverifikasi...</> : <><i className="bx bx-check-shield" /> Verifikasi OTP</>}
          </button>

          <div style={{ marginTop: "1.5rem", fontSize: 13, color: "var(--text-muted)" }}>
            {canResend ? (
              <button
                className="btn btn-outline btn-sm"
                style={{ margin: "0 auto" }}
                onClick={handleResend}
              >
                <i className="bx bx-refresh" /> Kirim Ulang OTP
              </button>
            ) : (
              <span>Kirim ulang dalam <strong style={{ color: "var(--primary)" }}>{countdown}s</strong></span>
            )}
          </div>

          <p style={{ marginTop: "1.5rem", fontSize: 12.5 }}>
            <Link to="/login" style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <i className="bx bx-arrow-back" /> Kembali ke Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
