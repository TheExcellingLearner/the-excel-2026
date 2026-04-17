"use client";

import { use, useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { getCourseById, Course } from "@/lib/services/courses";
import { getCourseLessons, createLesson, Lesson } from "@/lib/services/lessons";
import { getAssignmentsByCourse, createAssignment, Assignment, getTeacherSubmissions, Submission } from "@/lib/services/assignments";
import { getCourseStudents, Enrollment } from "@/lib/services/enrollments";
import { SectionHeader } from "@/components/ui/DashboardComponents";
import Link from "next/link";
import { useRouter } from "next/navigation";

function TeacherCourseDetailContent({ courseId }: { courseId: string }) {
  const { user } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // Simple state for forms (in a real app, use a modal + React Hook Form)
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      const c = await getCourseById(courseId);
      if (c && c.teacherId !== user.uid) {
        alert("Unauthorized");
        router.push("/teacher/courses");
        return;
      }
      setCourse(c);
      if (c) {
        const [l, a, e, s] = await Promise.all([
          getCourseLessons(c.id),
          getAssignmentsByCourse(c.id),
          getCourseStudents(c.id),
          getTeacherSubmissions(c.id)
        ]);
        setLessons(l);
        setAssignments(a);
        setEnrollments(e);
        setSubmissions(s);
      }
      setLoading(false);
    }
    loadData();
  }, [user, courseId, router]);

  const handleCreateLesson = async () => {
    if (!newLessonTitle.trim()) return;
    const l = await createLesson({
      courseId,
      title: newLessonTitle,
      content: "Initial content",
      order: lessons.length + 1
    });
    setLessons([...lessons, l]);
    setNewLessonTitle("");
  };

  const handleCreateAssignment = async () => {
    if (!newAssignmentTitle.trim()) return;
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const a = await createAssignment({
      courseId,
      title: newAssignmentTitle,
      description: "Assignment description...",
      dueDate: nextWeek.toISOString(),
    });
    setAssignments([...assignments, a]);
    setNewAssignmentTitle("");
  };

  if (loading) return <div style={{ padding: "var(--space-8)" }}>Loading course...</div>;
  if (!course) return <div style={{ padding: "var(--space-8)" }}>Course not found.</div>;

  return (
    <div className="animate-fadeIn">
      <Link href="/teacher/courses" style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)", display: "inline-block" }}>
        ← Back to Courses
      </Link>
      
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "var(--space-6)",
        padding: "var(--space-6)", borderRadius: "var(--r-lg)",
        background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
        marginBottom: "var(--space-8)"
      }}>
        <div style={{ width: 80, height: 80, borderRadius: "var(--r-md)", background: course.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
          {course.emoji}
        </div>
        <div>
          <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--text-primary)" }}>{course.title}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)" }}>{course.subject}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-6)" }}>
        
        {/* Main Content (Lessons & Assignments) */}
        <div>
          <div className="card" style={{ marginBottom: "var(--space-6)" }}>
            <SectionHeader title="Lessons" />
            <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              <input type="text" className="input" placeholder="New lesson title..." value={newLessonTitle} onChange={e => setNewLessonTitle(e.target.value)} />
              <button className="btn btn-primary" onClick={handleCreateLesson}>Add</button>
            </div>
            {lessons.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No lessons yet.</p> : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {lessons.map(l => (
                  <li key={l.id} style={{ padding: "var(--space-3)", borderBottom: "1px solid var(--border)", display:"flex", justifyContent:"space-between" }}>
                    <span>{l.order}. {l.title}</span>
                    <Link href={`/teacher/courses/${courseId}/lessons/${l.id}`} className="btn btn-ghost btn-sm">
                      Edit Content
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <SectionHeader title="Assignments" />
            <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              <input type="text" className="input" placeholder="New assignment title..." value={newAssignmentTitle} onChange={e => setNewAssignmentTitle(e.target.value)} />
              <button className="btn btn-accent" onClick={handleCreateAssignment}>Add</button>
            </div>
            {assignments.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No assignments yet.</p> : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {assignments.map(a => {
                  const subsCount = submissions.filter(s => s.assignmentId === a.id).length;
                  return (
                    <li key={a.id} style={{ padding: "var(--space-3)", borderBottom: "1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{a.title}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Due: {new Date(a.dueDate).toLocaleDateString()}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                         <span className="badge badge-blue">{subsCount} Submissions</span>
                         <button className="btn btn-ghost btn-sm">Edit</button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar (Students) */}
        <div className="card" style={{ height: "fit-content" }}>
          <SectionHeader title="Enrolled Students" action={<span className="badge badge-green">{enrollments.length}</span>} />
          {enrollments.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No students enrolled yet.</p> : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {enrollments.map(e => (
                <li key={e.id} style={{ padding: "var(--space-3) 0", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "var(--text-sm)" }}>Student ID: {e.studentId.slice(0, 5)}...</span>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--accent)" }}>{e.progress}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default function TeacherCourseDetail({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  return (
    <AuthProvider>
      <DashboardLayout>
        <TeacherCourseDetailContent courseId={resolvedParams.courseId} />
      </DashboardLayout>
    </AuthProvider>
  );
}
