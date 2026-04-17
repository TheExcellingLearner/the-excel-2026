"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatCard, SectionHeader, ActivityItem } from "@/components/ui/DashboardComponents";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getStudentEnrollments, Enrollment } from "@/lib/services/enrollments";
import { getCourseById, Course } from "@/lib/services/courses";
import { getStudentSubmissions, Submission } from "@/lib/services/assignments";

type EnrolledCourseUI = Course & { progress: number };

const RECENT_ACTIVITY = [
  { avatar: "SJ", name: "Ms. Johnson",   action: "posted new lecture notes for Chapter 7", time: "30m ago", color: "var(--primary)" },
  { avatar: "DL", name: "Mr. Lee",       action: "graded your Lab Report — 88/100",        time: "2h ago",  color: "#059669" },
];

const ACHIEVEMENTS = [
  { emoji: "🥇", title: "Top Scorer",        desc: "Scored 95%+ on 3 quizzes", unlocked: true },
  { emoji: "🔥", title: "7-day Streak",       desc: "Logged in 7 days in a row", unlocked: true },
  { emoji: "📚", title: "Bookworm",            desc: "Read 20 lesson pages",      unlocked: true },
  { emoji: "⚡", title: "Speed Learner",      desc: "Complete 5 modules in 1 day", unlocked: false },
];

function StudentDashboardContent() {
  const { user } = useAuth();
  
  const [courses, setCourses] = useState<EnrolledCourseUI[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user || user.role !== "student") return;

      const enrolls = await getStudentEnrollments(user.uid);
      const enhanced: EnrolledCourseUI[] = [];

      for (const e of enrolls) {
        const c = await getCourseById(e.courseId);
        if (c) enhanced.push({ ...c, progress: e.progress });
      }

      const subs = await getStudentSubmissions(user.uid);

      setCourses(enhanced);
      setSubmissions(subs);
      setLoading(false);
    }
    loadData();
  }, [user]);

  if (loading) {
    return <div style={{ padding: "var(--space-8)" }}>Loading dashboard...</div>;
  }

  // Calculate stats
  const avgScore = submissions.length > 0
    ? submissions.reduce((acc, sub) => acc + (sub.score || 0), 0) / submissions.filter(s => s.status === "graded").length || 0
    : 0;

  return (
    <div className="animate-fadeIn">
      {/* Greeting */}
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
          Hey, {user?.displayName || "Student"}! 🚀
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Keep up the great work!
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "var(--space-5)", marginBottom: "var(--space-8)" }}>
        <StatCard label="Enrolled Courses" value={courses.length}   sub="All active"           icon="📚" accentColor="var(--accent)" />
        <StatCard label="Avg. Score"        value={`${Math.round(avgScore)}%`} sub="Across all graded assignments" icon="📊" accentColor="var(--primary)" />
        <StatCard label="Study Hours"       value="42h" sub="This month"            icon="⏱️" accentColor="var(--primary)" />
        <StatCard label="Achievements"      value="3"   sub="1 close to unlocking"  icon="🏆" accentColor="#D97706" />
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)", marginBottom: "var(--space-8)" }}>
        {/* Continue Learning */}
        <div className="card">
          <SectionHeader
            title="Continue Learning"
            action={<Link href="/student/courses" className="btn btn-accent btn-sm">All Courses →</Link>}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {courses.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>Not enrolled in any courses yet.</p>
            ) : (
              courses.slice(0, 3).map((c) => (
                <Link key={c.id} href={`/student/courses/${c.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-4)",
                    padding: "var(--space-3)",
                    borderRadius: "var(--r-md)",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(245,130,32,0.07)"; (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: "var(--r-md)", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>
                      {c.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text-primary)", marginBottom: 2 }}>{c.title}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "var(--space-2)" }}>{c.subject}</div>
                      <div className="progress-bar">
                        <div className="progress-fill progress-fill-accent" style={{ width: `${c.progress}%` }} />
                      </div>
                    </div>
                    <span style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--accent)", flexShrink: 0 }}>{c.progress}%</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Assignments (using pending submissions for now as a placeholder) */}
        <div className="card">
          <SectionHeader title="Pending Submissions" />
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {submissions.filter(s => s.status === "pending").length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>No pending assignments.</p>
            ) : (
              submissions.filter(s => s.status === "pending").slice(0, 4).map((a) => (
                <div key={a.id} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3)",
                  borderRadius: "var(--r-md)",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid var(--border)`,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                    background: "var(--text-muted)",
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>Assignment pending</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Submitted at {new Date(a.submittedAt).toLocaleDateString()}</div>
                  </div>
                  <span style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    background: "rgba(255,255,255,0.06)",
                    padding: "2px 8px",
                    borderRadius: "var(--r-full)",
                    flexShrink: 0,
                  }}>
                    Pending
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Achievements + Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
        {/* Achievements */}
        <div className="card">
          <SectionHeader title="Achievements" action={<span className="badge badge-orange">3 / 12</span>} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            {ACHIEVEMENTS.map((a) => (
              <div key={a.title} style={{
                padding: "var(--space-4)",
                borderRadius: "var(--r-md)",
                background: a.unlocked ? "rgba(245,130,32,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${a.unlocked ? "rgba(245,130,32,0.25)" : "var(--border)"}`,
                opacity: a.unlocked ? 1 : 0.5,
                textAlign: "center",
              }}>
                <div style={{ fontSize: "1.8rem", marginBottom: "var(--space-2)" }}>{a.emoji}</div>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--text-primary)" }}>{a.title}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <SectionHeader title="Recent Activity" />
          {RECENT_ACTIVITY.map((a) => (
            <ActivityItem key={a.avatar + a.time} {...a} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <AuthProvider>
      <DashboardLayout>
        <StudentDashboardContent />
      </DashboardLayout>
    </AuthProvider>
  );
}
