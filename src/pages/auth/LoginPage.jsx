import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) { e.target.reportValidity(); return; }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate("/otp");
  };

  const handleGoogle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    navigate("/otp");
  };

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* Minimal Navbar */}
      <header className="app-navbar">
        <div className="app-bar-container">
          <div className="left-section">
            <img src="/logo.svg" alt="SrikanaGo" style={{ height: 30 }} />
            <span className="title">SrikanaGo</span>
          </div>
          <div className="right-section" style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Belum punya akun?{" "}
            <Link to="#" style={{ color: "var(--primary)", fontWeight: 500 }}>Daftar</Link>
          </div>
        </div>
      </header>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, backgroundImage: "url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=60)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.06 }} />

      {/* Card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", zIndex: 1 }}>
        <div className="animate-fadein" style={{ background: "var(--bg)", borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.1)", border: "1px solid var(--border-card)" }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <img src="/logo.svg" alt="SrikanaGo" style={{ height: 72, marginBottom: 10 }} />
            <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0e1422" }}>Masuk ke SrikanaGo</h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>Sentra Kuliner SWK Srikana Food Walk, UNAIR</p>
          </div>

          {error && <div className="alert alert-danger"><i className="bx bx-error-circle" />{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Alamat Email</label>
              <div className="form-input-icon">
                <i className="bx bx-envelope icon" />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="contoh@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-icon" style={{ position: "relative" }}>
                <i className="bx bx-lock-alt icon" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  className="form-input"
                  placeholder="Minimal 8 karakter"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 20, display: "flex", alignItems: "center" }}
                >
                  <i className={`bx ${showPass ? "bx-hide" : "bx-show"}`} />
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right", marginBottom: "1.25rem" }}>
              <Link to="#" style={{ fontSize: 12.5, color: "var(--primary)" }}>Lupa password?</Link>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><span className="spinner" /> Memproses...</> : <><i className="bx bx-log-in" /> Masuk</>}
            </button>
          </form>

          <div className="divider">atau</div>

          <button
            type="button"
            className="btn btn-outline btn-full"
            style={{ gap: 10 }}
            onClick={handleGoogle}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M46.145 24.504c0-1.633-.146-3.204-.418-4.715H24v8.921h12.435c-.536 2.89-2.164 5.337-4.612 6.98v5.8h7.474c4.373-4.028 6.848-9.967 6.848-16.986z" />
              <path fill="#34A853" d="M24 48c6.24 0 11.47-2.069 15.296-5.61l-7.474-5.8c-2.07 1.387-4.715 2.204-7.822 2.204-6.015 0-11.11-4.062-12.932-9.524H3.394v5.99C7.207 42.693 15.01 48 24 48z" />
              <path fill="#FBBC05" d="M11.068 29.27A14.94 14.94 0 0 1 10.5 24c0-1.842.318-3.624.568-5.27V12.74H3.394A23.99 23.99 0 0 0 0 24c0 3.872.928 7.53 2.57 10.75l8.498-5.48z" />
              <path fill="#EA4335" d="M24 9.545c3.388 0 6.426 1.165 8.817 3.453l6.616-6.616C35.465 2.42 30.235 0 24 0 15.01 0 7.207 5.307 3.394 13.26l8.674 6.73C13.89 13.607 18.985 9.545 24 9.545z" />
            </svg>
            Masuk dengan Google
          </button>

          <p style={{ textAlign: "center", fontSize: 12.5, color: "var(--text-muted)", marginTop: "1.5rem" }}>
            Belum punya akun?{" "}
            <Link to="#" style={{ color: "var(--primary)", fontWeight: 500 }}>Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
