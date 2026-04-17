import { db } from "../firebase";
import { collection, doc, setDoc, getDocs, query, where, getDoc } from "firebase/firestore";

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  progress: number;
  enrolledAt: string;
}

const ENROLLMENTS_COLLECTION = "enrollments";

export async function enrollStudent(courseId: string, studentId: string): Promise<Enrollment> {
  // Check if already enrolled
  const q = query(collection(db, ENROLLMENTS_COLLECTION), where("courseId", "==", courseId), where("studentId", "==", studentId));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return snap.docs[0].data() as Enrollment;
  }

  const newRef = doc(collection(db, ENROLLMENTS_COLLECTION));
  
  const enrollment: Enrollment = {
    id: newRef.id,
    courseId,
    studentId,
    progress: 0,
    enrolledAt: new Date().toISOString(),
  };

  await setDoc(newRef, enrollment);
  return enrollment;
}

export async function getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
  const q = query(collection(db, ENROLLMENTS_COLLECTION), where("studentId", "==", studentId));
  const snap = await getDocs(q);
  const enrollments: Enrollment[] = [];
  snap.forEach(d => enrollments.push(d.data() as Enrollment));
  return enrollments;
}

export async function getCourseStudents(courseId: string): Promise<Enrollment[]> {
  const q = query(collection(db, ENROLLMENTS_COLLECTION), where("courseId", "==", courseId));
  const snap = await getDocs(q);
  const enrollments: Enrollment[] = [];
  snap.forEach(d => enrollments.push(d.data() as Enrollment));
  return enrollments;
}

export async function updateProgress(enrollmentId: string, progress: number): Promise<void> {
  const ref = doc(db, ENROLLMENTS_COLLECTION, enrollmentId);
  await setDoc(ref, { progress }, { merge: true });
}
