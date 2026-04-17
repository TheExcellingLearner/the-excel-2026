import { db } from "../firebase";
import { collection, doc, setDoc, getDocs, query, where, getDoc, updateDoc } from "firebase/firestore";

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string; // Markdown or rich text
  order: number;
  createdAt: string;
}

const LESSONS_COLLECTION = "lessons";

export async function createLesson(data: Omit<Lesson, "id" | "createdAt">): Promise<Lesson> {
  const newRef = doc(collection(db, LESSONS_COLLECTION));
  const now = new Date().toISOString();
  
  const lesson: Lesson = {
    ...data,
    id: newRef.id,
    createdAt: now,
  };

  await setDoc(newRef, lesson);
  return lesson;
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const docRef = doc(db, LESSONS_COLLECTION, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data() as Lesson;
}

export async function updateLesson(id: string, data: Partial<Omit<Lesson, "id" | "createdAt" | "courseId">>): Promise<void> {
  const docRef = doc(db, LESSONS_COLLECTION, id);
  await updateDoc(docRef, data);
}

export async function getCourseLessons(courseId: string): Promise<Lesson[]> {
  const q = query(collection(db, LESSONS_COLLECTION), where("courseId", "==", courseId));
  const snap = await getDocs(q);
  const lessons: Lesson[] = [];
  snap.forEach(d => lessons.push(d.data() as Lesson));
  lessons.sort((a, b) => a.order - b.order);
  return lessons;
}
