"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const TEACHER_NAV: NavItem[] = [
  { label: "Dashboard",  href: "/teacher/dashboard", icon: "⬡" },
  { label: "Courses",    href: "/teacher/courses",   icon: "📚" },
  { label: "Students",   href: "/teacher/students",  icon: "👥" },
  { label: "Analytics",  href: "/teacher/analytics", icon: "📊" },
  { label: "Whiteboard", href: "/teacher/whiteboard",icon: "🖊" },
];

const STUDENT_NAV: NavItem[] = [
  { label: "Dashboard",    href: "/student/dashboard", icon: "⬡" },
  { label: "My Courses",   href: "/student/courses",   icon: "📚" },
  { label: "Assignments",  href: "/student/assignments",icon: "✏️" },
  { label: "Achievements", href: "/student/achievements",icon: "🏆" },
  { label: "Schedule",     href: "/student/schedule",  icon: "📅" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut, role } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Infer role from URL when no user is authenticated (demo mode)
  const effectiveRole = role ?? (pathname.startsWith("/teacher") ? "teacher" : "student");

  const navItems = effectiveRole === "teacher" ? TEACHER_NAV : STUDENT_NAV;
  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2)
    : effectiveRole === "teacher" ? "T" : "S";

  const avatarColor = effectiveRole === "teacher" ? "var(--primary)" : "var(--accent)";

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 99, display: "none",
          }}
          className="mobile-overlay"
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside style={{
        width: 260,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        padding: "var(--space-6) 0",
        overflowY: "auto",
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: "0 var(--space-6) var(--space-6)", borderBottom: "1px solid var(--border)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "var(--r-md)",
              overflow: "hidden", flexShrink: 0,
              background: "#fff",
            }}>
              <Image src="/logo.png" alt="The Excelling Learner" width={36} height={36} style={{ objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text-primary)" }}>
                The Excelling
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                Learner
              </div>
            </div>
          </Link>
        </div>

        {/* Role badge */}
        <div style={{ padding: "var(--space-4) var(--space-6)" }}>
          <span className={`badge badge-${effectiveRole === "teacher" ? "blue" : "orange"}`}>
            {effectiveRole === "teacher" ? "🎓 Teacher" : "📖 Student"}
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 var(--space-3)" }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--r-md)",
                  marginBottom: "var(--space-1)",
                  fontSize: "var(--text-sm)",
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  background: active
                    ? effectiveRole === "teacher"
                      ? "rgba(2,132,199,0.15)"
                      : "rgba(245,130,32,0.15)"
                    : "transparent",
                  borderLeft: active
                    ? `3px solid ${effectiveRole === "teacher" ? "var(--primary)" : "var(--accent)"}`
                    : "3px solid transparent",
                  transition: "all var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-card)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                  }
                }}
              >
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{
          padding: "var(--space-4) var(--space-6)",
          borderTop: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
            <div
              className="avatar"
              style={{ width: 36, height: 36, background: avatarColor, color: "#fff", fontSize: "var(--text-sm)" }}
            >
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.displayName ?? (effectiveRole === "teacher" ? "Demo Teacher" : "Demo Student")}
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email ?? `${effectiveRole}@excellinglearner.com`}
              </div>
            </div>
          </div>
          <button
            id="signout-btn"
            onClick={signOut}
            className="btn btn-ghost btn-sm"
            style={{ width: "100%", justifyContent: "center" }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        {/* Top bar */}
        <header style={{
          height: 64,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 var(--space-8)",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            {/* notification bell */}
            <button
              id="notifications-btn"
              style={{
                width: 36, height: 36, borderRadius: "var(--r-md)",
                background: "transparent", border: "1px solid var(--border)",
                color: "var(--text-secondary)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all var(--transition-fast)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              🔔
            </button>
            <div
              className="avatar"
              style={{ width: 36, height: 36, background: avatarColor, color: "#fff", fontSize: "var(--text-sm)", cursor: "default" }}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "var(--space-8)", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
