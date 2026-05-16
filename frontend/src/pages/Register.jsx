import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function Register() {
  const [step, setStep] = useState("credentials"); // 'credentials' or 'verify-otp'
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
    method: "email",
  });
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const { register } = useAuth();
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
    if (!form.phone || form.phone.trim().length < 10)
      return toast.error("Valid phone number is required");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match");
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      const { data } = await api.post("/auth/send-verification-otp", {
        email: form.email,
        name: form.name,
        method: form.method,
      });

      if (data.success) {
        setStep("verify-otp");
        setTimer(900); // 15 minutes
        toast.success(`OTP sent to your ${form.method}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (form.otp.length !== 6) {
      return toast.error("OTP must be 6 digits");
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-registration-otp", {
        email: form.email,
        otp: form.otp,
        name: form.name,
        phone: form.phone,
        password: form.password,
      });

      if (data.success) {
        toast.success("Account created! Welcome to Rose Buds.");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/send-verification-otp", {
        email: form.email,
        name: form.name,
        method: form.method,
      });

      if (data.success) {
        setTimer(900);
        toast.success(`OTP resent to your ${form.method}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const s = styles;
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🌹</div>
        <h1 style={s.title}>
          {step === "credentials" ? "Create Account" : "Verify Email & Phone"}
        </h1>
        <p style={s.sub}>
          {step === "credentials"
            ? "Register as a parent to track admissions & pay fees"
            : `Enter the 6-digit OTP sent to your ${form.method}`}
        </p>

        {step === "credentials" ? (
          <form
            onSubmit={handleCredentialsSubmit}
            style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}
          >
            {[
              {
                key: "name",
                label: "Full Name",
                type: "text",
                placeholder: "Your full name",
              },
              {
                key: "email",
                label: "Email Address",
                type: "email",
                placeholder: "your@email.com",
              },
              {
                key: "phone",
                label: "Phone Number",
                type: "tel",
                placeholder: "+91 XXXXX XXXXX",
              },
              {
                key: "password",
                label: "Password",
                type: "password",
                placeholder: "Minimum 6 characters",
              },
              {
                key: "confirmPassword",
                label: "Confirm Password",
                type: "password",
                placeholder: "Repeat password",
              },
            ].map((f) => (
              <div key={f.key}>
                <label style={s.label}>{f.label}</label>
                <input
                  style={s.input}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                  required
                />
              </div>
            ))}

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
            style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}
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
              {loading ? "Creating account..." : "Verify & Create Account"}
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
                : `Resend in ${Math.floor((900 - timer) / 60)}:${String(
                    (900 - timer) % 60,
                  ).padStart(2, "0")}`}
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
              ← Back to Registration
            </button>
          </form>
        )}
        <div
          style={{
            textAlign: "center",
            marginTop: "1.2rem",
            fontSize: ".88rem",
            color: "#7a5a64",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#e8355a",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign In
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
    maxWidth: 440,
    boxShadow: "0 20px 60px rgba(200,40,70,0.12)",
    border: "1px solid rgba(232,53,90,0.1)",
  },
  logo: {
    width: 52,
    height: 52,
    background: "linear-gradient(135deg,#e8355a,#c0234a)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
    margin: "0 auto 1rem",
    boxShadow: "0 6px 20px rgba(232,53,90,0.3)",
  },
  title: {
    fontFamily: "Playfair Display, serif",
    fontSize: "1.6rem",
    color: "#1a0a10",
    textAlign: "center",
    marginBottom: ".25rem",
  },
  sub: {
    color: "#7a5a64",
    textAlign: "center",
    fontSize: ".85rem",
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontSize: ".82rem",
    fontWeight: 600,
    color: "#2d1520",
    marginBottom: ".35rem",
  },
  input: {
    width: "100%",
    padding: ".75rem 1rem",
    border: "1.5px solid rgba(232,53,90,0.2)",
    borderRadius: 10,
    fontFamily: "DM Sans, sans-serif",
    fontSize: ".9rem",
    color: "#2d1520",
    background: "#faf7f8",
    outline: "none",
    boxSizing: "border-box",
  },
  btn: {
    background: "linear-gradient(135deg,#e8355a,#c0234a)",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: ".9rem",
    fontSize: ".95rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "DM Sans, sans-serif",
    boxShadow: "0 6px 20px rgba(232,53,90,0.3)",
    marginTop: ".5rem",
  },
};
