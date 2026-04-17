"use client";

import { use, useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { getLessonById, updateLesson, Lesson } from "@/lib/services/lessons";
import { getCourseById } from "@/lib/services/courses";
import { SectionHeader } from "@/components/ui/DashboardComponents";
import Link from "next/link";
import { useRouter } from "next/navigation";

function TeacherLessonEditContent({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const { user } = useAuth();
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      const c = await getCourseById(courseId);
      if (c && c.teacherId !== user.uid) {
        alert("Unauthorized");
        router.push("/teacher/courses");
        return;
      }

      const l = await getLessonById(lessonId);
      if (l) {
        setLesson(l);
        setTitle(l.title);
        setContent(l.content);
      }
      setLoading(false);
    }
    loadData();
  }, [user, courseId, lessonId, router]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    await updateLesson(lessonId, { title, content });
    setSaving(false);
    alert("Lesson saved!");
  };

  if (loading) return <div style={{ padding: "var(--space-8)" }}>Loading lesson...</div>;
  if (!lesson) return <div style={{ padding: "var(--space-8)" }}>Lesson not found.</div>;

  return (
    <div className="animate-fadeIn">
      <Link href={`/teacher/courses/${courseId}`} style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)", display: "inline-block" }}>
        ← Back to Course
      </Link>
      
      <div className="card">
        <SectionHeader title="Edit Lesson" />
        
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginTop: "var(--space-6)" }}>
          <div>
            <label style={{ display: "block", marginBottom: "var(--space-2)", fontSize: "var(--text-sm)", fontWeight: 600 }}>Lesson Title</label>
            <input 
              type="text" 
              className="input" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "var(--space-2)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>
              Lesson Content (Markdown Supported)
            </label>
            <textarea 
              className="input" 
              rows={15}
              style={{ fontFamily: "monospace", resize: "vertical" }}
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder="Write your lesson content here..."
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeacherLessonEdit({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const resolvedParams = use(params);
  return (
    <AuthProvider>
      <DashboardLayout>
        <TeacherLessonEditContent courseId={resolvedParams.courseId} lessonId={resolvedParams.lessonId} />
      </DashboardLayout>
    </AuthProvider>
  );
}
