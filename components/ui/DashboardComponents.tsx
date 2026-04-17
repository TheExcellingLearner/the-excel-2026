"use client";

import { CSSProperties, ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  accentColor?: string;
  trend?: { direction: "up" | "down"; value: string };
  style?: CSSProperties;
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  accentColor = "var(--primary)",
  trend,
  style,
}: StatCardProps) {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--r-md)",
            background: `${accentColor}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
          }}
        >
          {icon}
        </div>
        {trend && (
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              color: trend.direction === "up" ? "#4ADE80" : "var(--danger-light)",
              background: trend.direction === "up" ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
              padding: "2px 8px",
              borderRadius: "var(--r-full)",
            }}
          >
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <div>
        <div
          style={{
            fontSize: "var(--text-3xl)",
            fontWeight: 800,
            color: "var(--text-primary)",
            lineHeight: 1.1,
            marginBottom: "var(--space-1)",
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontWeight: 500 }}>
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Activity Item ── */
interface ActivityItemProps {
  avatar: string;
  name: string;
  action: string;
  time: string;
  color: string;
}

export function ActivityItem({ avatar, name, action, time, color }: ActivityItemProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-4)",
      padding: "var(--space-3) 0",
      borderBottom: "1px solid var(--border)",
    }}>
      <div
        className="avatar"
        style={{ width: 36, height: 36, background: color, color: "#fff", fontSize: "var(--text-sm)" }}
      >
        {avatar}
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "var(--text-sm)" }}>
          {name}
        </span>
        <span style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
          {" "}{action}
        </span>
      </div>
      <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", flexShrink: 0 }}>
        {time}
      </span>
    </div>
  );
}

/* ── Course Card ── */
interface CourseCardProps {
  title: string;
  subject: string;
  students?: number;
  progress?: number;
  color: string;
  emoji: string;
  badge?: string;
  badgeType?: "blue" | "orange" | "green";
  onClick?: () => void;
  id?: string;
}

export function CourseCard({
  title, subject, students, progress, color, emoji,
  badge, badgeType = "blue", onClick, id,
}: CourseCardProps) {
  return (
    <div
      id={id}
      className="card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
    >
      {/* Header */}
      <div style={{
        height: 80,
        borderRadius: "var(--r-md)",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2rem",
        marginBottom: "var(--space-2)",
      }}>
        {emoji}
      </div>
      {badge && <span className={`badge badge-${badgeType}`}>{badge}</span>}
      <div>
        <div style={{ fontWeight: 700, fontSize: "var(--text-base)", color: "var(--text-primary)", marginBottom: 2 }}>
          {title}
        </div>
        <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{subject}</div>
      </div>
      {students !== undefined && (
        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
          👥 {students} students enrolled
        </div>
      )}
      {progress !== undefined && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Progress</span>
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-primary)" }}>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Section Header ── */
export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-5)" }}>
      <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--text-primary)" }}>
        {title}
      </h2>
      {action}
    </div>
  );
}
