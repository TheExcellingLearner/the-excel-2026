"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatCard, ActivityItem, CourseCard, SectionHeader } from "@/components/ui/DashboardComponents";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTeacherCourses, Course } from "@/lib/services/courses";
import { getTeacherSubmissions, Submission } from "@/lib/services/assignments";
import { getCourseStudents, Enrollment } from "@/lib/services/enrollments";

const RECENT_ACTIVITY = [
  { avatar: "AT", name: "Alex Thompson",   action: "submitted Assignment 3 — Algebra",       time: "2m ago",  color: "#7C3AED" },
  { avatar: "PS", name: "Priya Sharma",    action: "completed Chapter 5 Quiz with 92%",      time: "18m ago", color: "var(--primary)" },
];

function TeacherDashboardContent() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user || user.role !== "teacher") return;
      
      const tc = await getTeacherCourses(user.uid);
      setCourses(tc);
      
      let studentsCount = 0;
      let allSubs: Submission[] = [];
      
      for (const c of tc) {
        const enrolls = await getCourseStudents(c.id);
        studentsCount += enrolls.length;
        
        const subs = await getTeacherSubmissions(c.id);
        allSubs = [...allSubs, ...subs];
      }
      
      setTotalStudents(studentsCount);
      setSubmissions(allSubs);
      setLoading(false);
    }
    loadData();
  }, [user]);

  const activeCourses = courses.filter(c => c.status === "Active").length;
  const pendingGrading = submissions.filter(s => s.status === "pending").length;

  if (loading) {
    return <div style={{ padding: "var(--space-8)" }}>Loading dashboard...</div>;
  }

  return (
    <div className="animate-fadeIn">
      {/* Greeting */}
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
          Good morning, {user?.displayName || "Teacher"} 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-base)" }}>
          You have <strong style={{ color: "var(--accent)" }}>{pendingGrading} assignments</strong> to grade today.
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "var(--space-5)",
          marginBottom: "var(--space-8)",
        }}
      >
        <StatCard label="Total Students" value={totalStudents} sub={`Across ${courses.length} courses`} icon="👥" accentColor="var(--primary)" />
        <StatCard label="Active Courses" value={activeCourses} icon="📚" accentColor="var(--accent)" />
        <StatCard label="Avg. Score" value="84%" sub="Up from 79% last term" icon="📊" accentColor="var(--primary)" />
        <StatCard label="Pending Grading" value={pendingGrading} icon="✏️" accentColor="var(--danger)" />
      </div>

      {/* Two-column: recent activity + courses */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
        {/* Recent Activity */}
        <div className="card" style={{ gridColumn: "1 / 2" }}>
          <SectionHeader
            title="Recent Activity"
            action={<span className="badge badge-blue">Live</span>}
          />
          {RECENT_ACTIVITY.map((a) => (
            <ActivityItem key={a.avatar + a.time} {...a} />
          ))}
        </div>

        {/* Quick Actions + Mini courses */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          {/* Quick Actions */}
          <div className="card">
            <SectionHeader title="Quick Actions" />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {[
                { label: "Create New Course",   emoji: "➕", href: "/teacher/courses" },
                { label: "Grade Submissions",   emoji: "✔️", href: "/teacher/courses" },
                { label: "Schedule a Class",    emoji: "📅", href: "/teacher/courses" },
                { label: "Open Whiteboard",     emoji: "🖊", href: "/teacher/whiteboard" },
              ].map(({ label, emoji, href }) => (
                <Link
                  key={label}
                  href={href}
                  id={`quick-action-${label.toLowerCase().replace(/\s/g,"-")}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    padding: "var(--space-3) var(--space-4)",
                    borderRadius: "var(--r-md)",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{emoji}</span>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="card">
            <SectionHeader title="Today's Classes" />
            {[
              { time: "09:00 AM", title: "Calculus — Limits",   color: "var(--primary)" },
              { time: "11:30 AM", title: "Chemistry Lab Safety", color: "#059669" },
            ].map(({ time, title, color }) => (
              <div
                key={title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-4)",
                  padding: "var(--space-3) 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{
                  width: 3,
                  height: 36,
                  borderRadius: "var(--r-full)",
                  background: color,
                  flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>{title}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div style={{ marginTop: "var(--space-8)" }}>
        <SectionHeader
          title="My Courses"
          action={
            <Link href="/teacher/courses" className="btn btn-primary btn-sm" id="view-all-courses-btn">
              View All →
            </Link>
          }
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--space-5)" }}>
          {courses.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No courses yet. Create one!</p>
          ) : (
            courses.map((c) => (
              <CourseCard key={c.id} {...c} id={c.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboardPage() {
  return (
    <AuthProvider>
      <DashboardLayout>
        <TeacherDashboardContent />
      </DashboardLayout>
    </AuthProvider>
  );
}
