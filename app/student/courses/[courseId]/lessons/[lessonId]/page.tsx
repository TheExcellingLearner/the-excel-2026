"use client";

import { use, useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { getLessonById, getCourseLessons, Lesson } from "@/lib/services/lessons";
import { getCourseById, Course } from "@/lib/services/courses";
import { getStudentEnrollments, updateProgress, Enrollment } from "@/lib/services/enrollments";
import Link from "next/link";
import { useRouter } from "next/navigation";

function StudentLessonContent({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const { user } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

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

      const allLessons = await getCourseLessons(courseId);
      setTotalLessons(allLessons.length);

      const l = await getLessonById(lessonId);

      setCourse(c);
      setEnrollment(myEnroll);
      setLesson(l);
      setLoading(false);
    }
    loadData();
  }, [user, courseId, lessonId, router]);

  const handleComplete = async () => {
    if (!enrollment) return;
    setCompleting(true);
    const inc = Math.max(1, Math.round(100 / (totalLessons || 1)));
    const newProg = Math.min(100, enrollment.progress + inc);
    await updateProgress(enrollment.id, newProg);
    setCompleting(false);
    router.push(`/student/courses/${courseId}`);
  };

  if (loading) return <div style={{ padding: "var(--space-8)" }}>Loading lesson...</div>;
  if (!lesson || !course) return <div style={{ padding: "var(--space-8)" }}>Lesson not found.</div>;

  return (
    <div className="animate-fadeIn">
      <Link href={`/student/courses/${courseId}`} style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-6)", display: "inline-block" }}>
        ← Back to Course Syllabus
      </Link>
      
      <div className="card" style={{ maxWidth: "800px", margin: "0 auto", padding: "var(--space-8)" }}>
        <div style={{ marginBottom: "var(--space-8)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--space-6)" }}>
          <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>{lesson.title}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>Course: {course.title}</p>
        </div>
        
        {/* Real app would use a Markdown renderer like react-markdown here */}
        <div style={{ 
          fontSize: "var(--text-lg)", 
          lineHeight: "1.8", 
          color: "var(--text-secondary)",
          whiteSpace: "pre-wrap"
        }}>
          {lesson.content}
        </div>

        <div style={{ marginTop: "var(--space-12)", display: "flex", justifyContent: "center", borderTop: "1px solid var(--border)", paddingTop: "var(--space-8)" }}>
          <button 
            className="btn btn-primary" 
            style={{ padding: "var(--space-3) var(--space-8)", fontSize: "var(--text-lg)" }}
            onClick={handleComplete}
            disabled={completing}
          >
            {completing ? "Saving Progress..." : "Mark as Complete & Return"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudentLessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const resolvedParams = use(params);
  return (
    <AuthProvider>
      <DashboardLayout>
        <StudentLessonContent courseId={resolvedParams.courseId} lessonId={resolvedParams.lessonId} />
      </DashboardLayout>
    </AuthProvider>
  );
}
