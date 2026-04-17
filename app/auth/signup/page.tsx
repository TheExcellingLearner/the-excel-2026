"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/lib/firebase";

function SignupForm() {
  const { signUp, signInWithGoogleFun, loading } = useAuth();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState<UserRole>("student");
  const [error, setError]       = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    try {
      await signUp(email, password, name, role);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("email-already-in-use")) {
        setError("This email is already registered. Try signing in instead.");
      } else if (msg.includes("weak-password")) {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError("Sign up failed. Please try again.");
      }
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithGoogleFun(role);
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  };

  const accentColor    = role === "teacher" ? "var(--primary)"       : "var(--accent)";
  const accentBg       = role === "teacher" ? "rgba(2,132,199,0.12)" : "rgba(245,130,32,0.12)";
  const accentBorder   = role === "teacher" ? "rgba(2,132,199,0.3)"  : "rgba(245,130,32,0.3)";

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "var(--space-6)",
    }}>
      {/* Glow */}
      <div style={{
        position: "fixed", top: "20%", right: "20%",
        width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, ${accentBg.replace("0.12", "0.08")} 0%, transparent 70%)`,
        pointerEvents: "none", transition: "background 0.3s",
      }} />

      <div className="animate-fadeInUp" style={{ width: "100%", maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "var(--r-lg)", overflow: "hidden", background: "#fff", flexShrink: 0 }}>
              <Image src="/logo.png" alt="The Excelling Learner" width={48} height={48} style={{ objectFit: "contain" }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: "var(--text-xl)", color: "var(--text-primary)" }}>
              The Excelling Learner
            </span>
          </Link>
          <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
            Create your account
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            Join thousands of teachers and students today
          </p>
        </div>

        <div className="glass" style={{ borderRadius: "var(--r-xl)", padding: "var(--space-8)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

            {/* Role selector */}
            <div>
              <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-3)" }}>
                I am a…
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                {(["teacher", "student"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    id={`role-${r}-btn`}
                    onClick={() => setRole(r)}
                    style={{
                      padding: "var(--space-4)",
                      borderRadius: "var(--r-md)",
                      border: `2px solid ${role === r
                        ? r === "teacher" ? "var(--primary)" : "var(--accent)"
                        : "var(--border)"}`,
                      background: role === r
                        ? r === "teacher" ? "rgba(2,132,199,0.12)" : "rgba(245,130,32,0.12)"
                        : "rgba(255,255,255,0.03)",
                      color: role === r ? "var(--text-primary)" : "var(--text-secondary)",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <div style={{ fontSize: "1.8rem", marginBottom: "var(--space-2)" }}>
                      {r === "teacher" ? "🎓" : "📖"}
                    </div>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, textTransform: "capitalize" }}>{r}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Google sign-up */}
            <button
              id="google-signup-btn"
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              style={{
                width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-3)",
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--r-md)",
                border: `1px solid ${accentBorder}`,
                background: accentBg,
                color: "var(--text-primary)",
                fontSize: "var(--text-sm)", fontWeight: 600,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Sign up with Google as {role}
            </button>

            {/* OR divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div className="divider" style={{ flex: 1, margin: 0 }} />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", flexShrink: 0 }}>or with email</span>
              <div className="divider" style={{ flex: 1, margin: 0 }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>Full Name</label>
              <input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Jane Smith" required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>Email address</label>
              <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>Password</label>
              <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="Min. 6 characters" required />
            </div>

            {error && (
              <div style={{
                color: "var(--danger-light)", fontSize: "var(--text-sm)",
                background: "rgba(215,40,47,0.08)", padding: "var(--space-3)",
                borderRadius: "var(--r-md)", border: "1px solid rgba(215,40,47,0.15)",
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              id="signup-submit-btn"
              type="submit"
              className="btn btn-lg"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${role === "teacher" ? "var(--primary-dark)" : "var(--accent-dark)"})`,
                color: "#fff",
                justifyContent: "center",
                marginTop: "var(--space-1)",
                boxShadow: role === "teacher" ? "var(--shadow-blue)" : "var(--shadow-orange)",
              }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Creating account…
                </span>
              ) : `Create ${role === "teacher" ? "Teacher" : "Student"} Account →`}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "var(--space-6)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--primary-light)", fontWeight: 600 }}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <AuthProvider>
      <SignupForm />
    </AuthProvider>
  );
}
