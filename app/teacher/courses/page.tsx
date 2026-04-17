"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatCard, CourseCard, SectionHeader } from "@/components/ui/DashboardComponents";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { getTeacherCourses, Course } from "@/lib/services/courses";
import { getCourseStudents } from "@/lib/services/enrollments";
import { getCourseLessons } from "@/lib/services/lessons";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Extended Course type for UI state
type CourseUI = Course & { students: number; lessons: number };

function TeacherCoursesContent() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [filter, setFilter] = useState<"All" | "Active" | "Draft" | "Upcoming">("All");
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<CourseUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      if (!user || user.role !== "teacher") return;

      const tc = await getTeacherCourses(user.uid);
      const enhanced: CourseUI[] = [];

      for (const c of tc) {
        const students = await getCourseStudents(c.id);
        const lessons = await getCourseLessons(c.id);
        enhanced.push({ ...c, students: students.length, lessons: lessons.length });
      }

      setCourses(enhanced);
      setLoading(false);
    }
    fetchAll();
  }, [user]);

  const filtered = courses.filter((c) => {
    const matchStatus = filter === "All" || c.status === filter;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusBadgeType = (s: string): "blue" | "orange" | "green" => {
    if (s === "Active")   return "green";
    if (s === "Draft")    return "orange";
    return "blue";
  };

  if (loading) {
    return <div style={{ padding: "var(--space-8)" }}>Loading courses...</div>;
  }

  return (
    <div className="animate-fadeIn">
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-8)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
            Courses
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage all your courses, lessons, and materials.
          </p>
        </div>
        {/* Assume we can link to a new course form page or trigger a modal */}
        {/* For now, let's link to a hypothetical /teacher/courses/new page later, or just a placeholder */}
        <button
          id="create-course-btn"
          className="btn btn-primary"
          style={{ gap: "var(--space-2)" }}
          onClick={() => {
             // For now just alert, will build new-course flow next
             alert("Create course workflow goes here.");
          }}
        >
          ➕ New Course
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-5)", marginBottom: "var(--space-8)" }}>
        <StatCard label="Total Courses"    value={courses.length}          icon="📚" accentColor="var(--primary)" />
        <StatCard label="Active Courses"   value={courses.filter(c=>c.status==="Active").length}   icon="✅" accentColor="#059669" />
        <StatCard label="Draft Courses"    value={courses.filter(c=>c.status==="Draft").length}    icon="✏️" accentColor="var(--accent)" />
        <StatCard label="Total Students"   value={courses.reduce((a,c)=>a+c.students,0)} icon="👥" accentColor="var(--primary)" />
      </div>

      {/* Filters & Search */}
      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-6)", alignItems: "center", flexWrap: "wrap" }}>
        <input
          id="course-search"
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
          style={{ maxWidth: 280 }}
        />
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {(["All", "Active", "Draft", "Upcoming"] as const).map((f) => (
            <button
              key={f}
              id={`filter-${f.toLowerCase()}-btn`}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Course grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-5)" }}>
        {filtered.map((course) => (
          <div key={course.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {/* Color header */}
            <div style={{
              height: 80,
              borderRadius: "var(--r-md)",
              background: course.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
            }}>
              {course.emoji}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "var(--text-base)", color: "var(--text-primary)" }}>
                  {course.title}
                </div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: 2 }}>
                  {course.subject}
                </div>
              </div>
              <span className={`badge badge-${statusBadgeType(course.status)}`}>{course.status}</span>
            </div>

            <div style={{ display: "flex", gap: "var(--space-4)", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              <span>👥 {course.students} students</span>
              <span>📝 {course.lessons} lessons</span>
            </div>

            <div className="divider" style={{ margin: "0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                Updated {new Date(course.updatedAt).toLocaleDateString()}
              </span>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <button id={`edit-course-${course.id}-btn`} className="btn btn-ghost btn-sm">Edit</button>
                <button
                  id={`view-course-${course.id}-btn`}
                  className="btn btn-primary btn-sm"
                  onClick={() => router.push(`/teacher/courses/${course.id}`)}
                >
                  View →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "var(--space-16)", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>🔍</div>
          <p>No courses found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

export default function TeacherCoursesPage() {
  return (
    <AuthProvider>
      <DashboardLayout>
        <TeacherCoursesContent />
      </DashboardLayout>
    </AuthProvider>
  );
}
