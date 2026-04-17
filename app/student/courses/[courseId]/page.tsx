"use client";

import { use, useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { getCourseById, Course } from "@/lib/services/courses";
import { getCourseLessons, Lesson } from "@/lib/services/lessons";
import { getAssignmentsByCourse, Assignment, getStudentSubmissions, submitAssignment, Submission } from "@/lib/services/assignments";
import { getStudentEnrollments, updateProgress, Enrollment } from "@/lib/services/enrollments";
import { SectionHeader } from "@/components/ui/DashboardComponents";
import Link from "next/link";
import { useRouter } from "next/navigation";

function StudentCourseDetailContent({ courseId }: { courseId: string }) {
  const { user } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick state for assignment submission logic
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      const c = await getCourseById(courseId);
      if (!c) {
        setLoading(false);
        return;
      }
      
      const enrolls = await getStudentEnrollments(user.uid);
      const myEnroll = enrolls.find(e => e.courseId === courseId);
      if (!myEnroll) {
        router.push("/student/courses");
        return;
      }
      
      const [l, a, s] = await Promise.all([
        getCourseLessons(courseId),
        getAssignmentsByCourse(courseId),
        getStudentSubmissions(user.uid)
      ]);

      setCourse(c);
      setEnrollment(myEnroll);
      setLessons(l);
      setAssignments(a);
      setSubmissions(s.filter(sub => sub.courseId === courseId));
      setLoading(false);
    }
    loadData();
  }, [user, courseId, router]);

  const handleLessonComplete = async (totalLessons: number) => {
    if (!enrollment) return;
    // Simple mock logic: increase progress by 100/totalLessons
    const inc = Math.max(1, Math.round(100 / (totalLessons || 1)));
    const newProg = Math.min(100, enrollment.progress + inc);
    await updateProgress(enrollment.id, newProg);
    setEnrollment({ ...enrollment, progress: newProg });
  };

  const handleSubmit = async (assignmentId: string) => {
    if (!submissionText.trim() || !user) return;
    const sub = await submitAssignment({
      assignmentId,
      courseId,
      studentId: user.uid,
      content: submissionText
    });
    setSubmissions([...submissions, sub]);
    setSubmittingId(null);
    setSubmissionText("");
  };

  if (loading) return <div style={{ padding: "var(--space-8)" }}>Loading course...</div>;
  if (!course) return <div style={{ padding: "var(--space-8)" }}>Course not found.</div>;

  return (
    <div className="animate-fadeIn">
      <Link href="/student/courses" style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)", display: "inline-block" }}>
        ← Back to Courses
      </Link>
      
      <div style={{
        display: "flex", alignItems: "center", gap: "var(--space-6)", justifyContent: "space-between",
        padding: "var(--space-6)", borderRadius: "var(--r-lg)",
        background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
        marginBottom: "var(--space-8)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
          <div style={{ width: 80, height: 80, borderRadius: "var(--r-md)", background: course.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
            {course.emoji}
          </div>
          <div>
            <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--text-primary)" }}>{course.title}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)" }}>{course.subject}</p>
          </div>
        </div>
        {enrollment && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-2)" }}>Your Progress</div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--accent)" }}>{enrollment.progress}%</div>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
        
        {/* Lessons */}
        <div className="card">
          <SectionHeader title="Syllabus & Lessons" />
          {lessons.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No lessons available yet.</p> : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {lessons.map(l => (
                <li key={l.id} style={{ padding: "var(--space-3)", borderBottom: "1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{l.order}. {l.title}</span>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => handleLessonComplete(lessons.length)}>Mark Done</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Assignments */}
        <div className="card">
          <SectionHeader title="Assignments" />
          {assignments.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No assignments yet.</p> : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {assignments.map(a => {
                const sub = submissions.find(s => s.assignmentId === a.id);
                
                return (
                  <li key={a.id} style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--border)", display:"flex", flexDirection:"column", gap: "var(--space-2)" }}>
                    <div style={{ display: "flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{a.title}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Due: {new Date(a.dueDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        {sub ? (
                           <span className={`badge ${sub.status === "graded" ? "badge-green" : "badge-orange"}`}>
                             {sub.status === "graded" ? `Graded: ${sub.score}/100` : "Submitted (Pending)"}
                           </span>
                        ) : (
                          submittingId !== a.id && (
                            <button className="btn btn-accent btn-sm" onClick={() => setSubmittingId(a.id)}>Submit Work</button>
                          )
                        )}
                      </div>
                    </div>
                    
                    {submittingId === a.id && !sub && (
                      <div style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                        <textarea
                          className="input"
                          placeholder="Type your answer or provide a link..."
                          rows={3}
                          value={submissionText}
                          onChange={e => setSubmissionText(e.target.value)}
                        />
                        <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => { setSubmittingId(null); setSubmissionText(""); }}>Cancel</button>
                          <button className="btn btn-primary btn-sm" onClick={() => handleSubmit(a.id)}>Submit Final</button>
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default function StudentCourseDetail({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  return (
    <AuthProvider>
      <DashboardLayout>
        <StudentCourseDetailContent courseId={resolvedParams.courseId} />
      </DashboardLayout>
    </AuthProvider>
  );
}
