import { db } from "../firebase";
import { collection, doc, setDoc, getDoc, getDocs, query, where, serverTimestamp, orderBy } from "firebase/firestore";

export interface Course {
  id: string;
  title: string;
  subject: string;
  teacherId: string;
  color: string;
  emoji: string;
  status: "Active" | "Draft" | "Upcoming";
  createdAt: string;
  updatedAt: string;
}

const COURSES_COLLECTION = "courses";

export async function createCourse(data: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course> {
  const newRef = doc(collection(db, COURSES_COLLECTION));
  const now = new Date().toISOString();
  
  const course: Course = {
    ...data,
    id: newRef.id,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(newRef, course);
  return course;
}

export async function getCourseById(id: string): Promise<Course | null> {
  const docRef = doc(db, COURSES_COLLECTION, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data() as Course;
}

export async function getTeacherCourses(teacherId: string): Promise<Course[]> {
  const q = query(collection(db, COURSES_COLLECTION), where("teacherId", "==", teacherId));
  const snap = await getDocs(q);
  const courses: Course[] = [];
  snap.forEach(d => courses.push(d.data() as Course));
  // Sort by createdAt descending locally to save needing an index immediately
  courses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return courses;
}

export async function getAllActiveCourses(): Promise<Course[]> {
  const q = query(collection(db, COURSES_COLLECTION), where("status", "==", "Active"));
  const snap = await getDocs(q);
  const courses: Course[] = [];
  snap.forEach(d => courses.push(d.data() as Course));
  courses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return courses;
}
