import { db } from "../firebase";
import { collection, doc, setDoc, getDocs, query, where, getDoc } from "firebase/firestore";

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  courseId: string; // denormalized for easier querying by teacher
  studentId: string;
  content: string;
  score: number | null;
  status: "pending" | "graded";
  submittedAt: string;
}

const ASSIGNMENTS_COLLECTION = "assignments";
const SUBMISSIONS_COLLECTION = "submissions";

export async function createAssignment(data: Omit<Assignment, "id" | "createdAt">): Promise<Assignment> {
  const newRef = doc(collection(db, ASSIGNMENTS_COLLECTION));
  const now = new Date().toISOString();
  
  const assignment: Assignment = {
    ...data,
    id: newRef.id,
    createdAt: now,
  };

  await setDoc(newRef, assignment);
  return assignment;
}

export async function getAssignmentsByCourse(courseId: string): Promise<Assignment[]> {
  const q = query(collection(db, ASSIGNMENTS_COLLECTION), where("courseId", "==", courseId));
  const snap = await getDocs(q);
  const assignments: Assignment[] = [];
  snap.forEach(d => assignments.push(d.data() as Assignment));
  assignments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  return assignments;
}

export async function submitAssignment(data: Omit<Submission, "id" | "score" | "status" | "submittedAt">): Promise<Submission> {
  const newRef = doc(collection(db, SUBMISSIONS_COLLECTION));
  
  const submission: Submission = {
    ...data,
    id: newRef.id,
    score: null,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  await setDoc(newRef, submission);
  return submission;
}

export async function gradeSubmission(submissionId: string, score: number): Promise<void> {
  const ref = doc(db, SUBMISSIONS_COLLECTION, submissionId);
  await setDoc(ref, { score, status: "graded" }, { merge: true });
}

export async function getTeacherSubmissions(courseId: string): Promise<Submission[]> {
  const q = query(collection(db, SUBMISSIONS_COLLECTION), where("courseId", "==", courseId));
  const snap = await getDocs(q);
  const submissions: Submission[] = [];
  snap.forEach(d => submissions.push(d.data() as Submission));
  return submissions;
}

export async function getStudentSubmissions(studentId: string): Promise<Submission[]> {
  const q = query(collection(db, SUBMISSIONS_COLLECTION), where("studentId", "==", studentId));
  const snap = await getDocs(q);
  const submissions: Submission[] = [];
  snap.forEach(d => submissions.push(d.data() as Submission));
  return submissions;
}
