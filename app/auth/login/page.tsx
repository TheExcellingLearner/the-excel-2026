"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { signInWithGoogle, type UserRole } from "@/lib/firebase";

function LoginForm() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [googleRole, setGoogleRole] = useState<UserRole>("student");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Sign in failed. Please check your details and try again.");
      }
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithGoogle();
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-6)",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(2,132,199,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="animate-fadeInUp" style={{ width: "100%", maxWidth: 440 }}>
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
            Welcome back
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius: "var(--r-xl)", padding: "var(--space-8)" }}>

          {/* Google sign-in */}
          <div style={{ marginBottom: "var(--space-5)" }}>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "var(--space-3)", textAlign: "center" }}>
              Signing in as a…
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
              {(["teacher", "student"] as const).map((r) => (
                <button
                  key={r}
                  id={`google-role-${r}-btn`}
                  type="button"
                  onClick={() => setGoogleRole(r)}
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    borderRadius: "var(--r-md)",
                    border: `2px solid ${googleRole === r ? (r === "teacher" ? "var(--primary)" : "var(--accent)") : "var(--border)"}`,
                    background: googleRole === r
                      ? r === "teacher" ? "rgba(2,132,199,0.12)" : "rgba(245,130,32,0.12)"
                      : "rgba(255,255,255,0.03)",
                    color: googleRole === r ? "var(--text-primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    transition: "all var(--transition-fast)",
                    textTransform: "capitalize",
                  }}
                >
                  {r === "teacher" ? "🎓 " : "📖 "}{r}
                </button>
              ))}
            </div>
            <button
              id="google-signin-btn"
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              style={{
                width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-3)",
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--r-md)",
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.06)",
                color: "var(--text-primary)",
                fontSize: "var(--text-sm)", fontWeight: 600,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; }}
            >
              {/* Google G */}
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
                <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" />
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
            <div className="divider" style={{ flex: 1, margin: 0 }} />
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", flexShrink: 0 }}>or sign in with email</span>
            <div className="divider" style={{ flex: 1, margin: 0 }} />
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <label style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>Password</label>
                <a href="#" style={{ fontSize: "var(--text-xs)", color: "var(--primary-light)" }}>Forgot password?</a>
              </div>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
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
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ justifyContent: "center", marginTop: "var(--space-1)" }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Signing in…
                </span>
              ) : "Sign In →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "var(--space-6)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" style={{ color: "var(--primary-light)", fontWeight: 600 }}>
            Sign up free →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
