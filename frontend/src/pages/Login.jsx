import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [step, setStep] = useState("credentials"); // 'credentials' or 'otp'
  const [form, setForm] = useState({
    email: "",
    password: "",
    otp: "",
    method: "email",
  });
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const { login, verifyOTP } = useAuth();
  const navigate = useNavigate();

  // Timer for OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password, form.method);
    setLoading(false);

    if (result.success && result.requiresOTP) {
      setStep("otp");
      setTimer(900); // 15 minutes
      toast.success(`OTP sent to your ${form.method}`);
    } else if (!result.success) {
      toast.error(result.message);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (form.otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    const result = await verifyOTP(form.email, form.otp);
    setLoading(false);

    if (result.success) {
      toast.success(`Welcome back, ${result.user.name.split(" ")[0]}!`);
      navigate(result.user.role === "admin" ? "/admin" : "/dashboard");
    } else {
      toast.error(result.message);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    const result = await login(form.email, form.password, form.method);
    setLoading(false);

    if (result.success && result.requiresOTP) {
      setTimer(900);
      toast.success(`OTP resent to your ${form.method}`);
    } else {
      toast.error(result.message || "Failed to resend OTP");
    }
  };

  const s = styles;
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🌹</div>
        <h1 style={s.title}>
          {step === "credentials" ? "Welcome Back" : "Verify OTP"}
        </h1>
        <p style={s.sub}>
          {step === "credentials"
            ? "Sign in to your Rose Buds portal"
            : "Enter the 6-digit OTP sent to your " + form.method}
        </p>

        {step === "credentials" ? (
          <form
            onSubmit={handleCredentialsSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label style={s.label}>Email Address</label>
              <input
                style={s.input}
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={s.label}>Password</label>
              <input
                style={s.input}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={s.label}>Receive OTP via</label>
              <div style={{ display: "flex", gap: ".75rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".4rem",
                    cursor: "pointer",
                    fontSize: ".9rem",
                    color: "#2d1520",
                  }}
                >
                  <input
                    type="radio"
                    value="email"
                    checked={form.method === "email"}
                    onChange={(e) =>
                      setForm({ ...form, method: e.target.value })
                    }
                  />
                  📧 Email
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".4rem",
                    cursor: "pointer",
                    fontSize: ".9rem",
                    color: "#2d1520",
                  }}
                >
                  <input
                    type="radio"
                    value="sms"
                    checked={form.method === "sms"}
                    onChange={(e) =>
                      setForm({ ...form, method: e.target.value })
                    }
                  />
                  📱 SMS
                </label>
              </div>
            </div>
            <button type="submit" disabled={loading} style={s.btn}>
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleOTPSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label style={s.label}>One-Time Password</label>
              <input
                style={{
                  ...s.input,
                  fontSize: "2rem",
                  letterSpacing: ".3rem",
                  textAlign: "center",
                  fontWeight: "600",
                  fontFamily: "monospace",
                }}
                type="text"
                placeholder="000000"
                value={form.otp}
                onChange={(e) =>
                  setForm({
                    ...form,
                    otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                  })
                }
                maxLength="6"
                autoFocus
              />
              <p
                style={{
                  fontSize: ".8rem",
                  color: timer > 60 ? "#7a5a64" : "#e8355a",
                  margin: ".5rem 0 0 0",
                  fontWeight: timer < 120 ? "600" : "400",
                }}
              >
                ⏱️ Expires in {Math.floor(timer / 60)}:
                {String(timer % 60).padStart(2, "0")}
              </p>
            </div>
            <button
              type="submit"
              disabled={loading || form.otp.length !== 6}
              style={{
                ...s.btn,
                opacity: loading || form.otp.length !== 6 ? 0.6 : 1,
              }}
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading || timer > 750}
              style={{
                ...s.btn,
                background: "rgba(232, 53, 90, 0.1)",
                color: "#e8355a",
                opacity: loading || timer > 750 ? 0.6 : 1,
              }}
            >
              {timer > 750
                ? "Resend OTP"
                : `Resend in ${Math.floor((900 - timer) / 60)}:${String((900 - timer) % 60).padStart(2, "0")}`}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setForm({ ...form, otp: "" });
              }}
              style={{
                ...s.btn,
                background: "transparent",
                color: "#7a5a64",
                border: "1px solid #e8355a",
                boxShadow: "none",
              }}
            >
              ← Back to Login
            </button>
          </form>
        )}

        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: ".88rem",
            color: "#7a5a64",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#e8355a",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: ".5rem",
            fontSize: ".85rem",
          }}
        >
          <Link
            to="/track"
            style={{ color: "#7a5a64", textDecoration: "none" }}
          >
            Track your application →
          </Link>
        </div>
        <div style={{ textAlign: "center", marginTop: ".5rem" }}>
          <Link
            to="/"
            style={{
              color: "#7a5a64",
              textDecoration: "none",
              fontSize: ".82rem",
            }}
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#fdf0f3,#fff5f0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "DM Sans, sans-serif",
  },
  card: {
    background: "white",
    borderRadius: 24,
    padding: "2.5rem",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 20px 60px rgba(200,40,70,0.12)",
    border: "1px solid rgba(232,53,90,0.1)",
  },
  logo: {
    width: 56,
    height: 56,
    background: "linear-gradient(135deg,#e8355a,#c0234a)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    margin: "0 auto 1.2rem",
    boxShadow: "0 6px 20px rgba(232,53,90,0.3)",
  },
  title: {
    fontFamily: "Playfair Display, serif",
    fontSize: "1.7rem",
    color: "#1a0a10",
    textAlign: "center",
    marginBottom: ".3rem",
  },
  sub: {
    color: "#7a5a64",
    textAlign: "center",
    fontSize: ".9rem",
    marginBottom: "1.8rem",
  },
  label: {
    display: "block",
    fontSize: ".85rem",
    fontWeight: 600,
    color: "#2d1520",
    marginBottom: ".4rem",
  },
  input: {
    width: "100%",
    padding: ".8rem 1rem",
    border: "1.5px solid rgba(232,53,90,0.2)",
    borderRadius: 12,
    fontFamily: "DM Sans, sans-serif",
    fontSize: ".92rem",
    color: "#2d1520",
    background: "#faf7f8",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .2s",
  },
  btn: {
    background: "linear-gradient(135deg,#e8355a,#c0234a)",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "1rem",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "DM Sans, sans-serif",
    boxShadow: "0 6px 20px rgba(232,53,90,0.3)",
    transition: "opacity .2s",
    marginTop: ".5rem",
  },
};
