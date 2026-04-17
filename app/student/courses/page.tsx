"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { CourseCard, SectionHeader } from "@/components/ui/DashboardComponents";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { getAllActiveCourses, Course } from "@/lib/services/courses";
import { getStudentEnrollments, enrollStudent, Enrollment } from "@/lib/services/enrollments";
import { useRouter } from "next/navigation";

function StudentCoursesContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user || user.role !== "student") return;

      const active = await getAllActiveCourses();
      const myEnrolls = await getStudentEnrollments(user.uid);

      setCourses(active);
      setEnrollments(myEnrolls);
      setLoading(false);
    }
    loadData();
  }, [user]);

  const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleEnrollOrView = async (courseId: string) => {
    if (!user) return;
    if (enrolledCourseIds.has(courseId)) {
      router.push(`/student/courses/${courseId}`);
    } else {
      setLoading(true);
      await enrollStudent(courseId, user.uid);
      router.push(`/student/courses/${courseId}`);
    }
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
            Explore Courses
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Find your next learning adventure.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-6)", alignItems: "center", flexWrap: "wrap" }}>
        <input
          id="course-search"
          type="text"
          placeholder="Search available courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
          style={{ maxWidth: 320, width: "100%" }}
        />
      </div>

      {/* Course grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-5)" }}>
        {filtered.map((course) => {
          const isEnrolled = enrolledCourseIds.has(course.id);
          const enrollment = enrollments.find(e => e.courseId === course.id);

          return (
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
                {isEnrolled && (
                  <span className="badge badge-green">Enrolled</span>
                )}
              </div>

              {isEnrolled && enrollment && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Progress</span>
                    <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--text-primary)" }}>{enrollment.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${enrollment.progress}%` }} />
                  </div>
                </div>
              )}

              <div className="divider" style={{ margin: "0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                  {isEnrolled ? "Continue Learning" : "Open for Enrollment"}
                </span>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <button
                    onClick={() => handleEnrollOrView(course.id)}
                    className={`btn ${isEnrolled ? "btn-primary" : "btn-accent"} btn-sm`}
                  >
                    {isEnrolled ? "View →" : "Enroll Now +"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "var(--space-16)", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>🔍</div>
          <p>No courses found matching your search.</p>
        </div>
      )}
    </div>
  );
}

export default function StudentCoursesPage() {
  return (
    <AuthProvider>
      <DashboardLayout>
        <StudentCoursesContent />
      </DashboardLayout>
    </AuthProvider>
  );
}
