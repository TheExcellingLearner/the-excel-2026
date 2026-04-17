"use client";

import Image from "next/image";

import Link from "next/link";

const FEATURES = [
  {
    emoji: "🎓",
    title: "Teacher Tools",
    desc: "Create rich courses, grade assignments, host live classes, and track every student's progress — all in one place.",
    color: "var(--primary)",
  },
  {
    emoji: "📖",
    title: "Student Learning",
    desc: "Follow a personalized learning path, complete interactive lessons, and celebrate achievements as you level up.",
    color: "var(--accent)",
  },
  {
    emoji: "📊",
    title: "Deep Analytics",
    desc: "Real-time dashboards surface what's working and what needs attention, for both teachers and students.",
    color: "#7C3AED",
  },
  {
    emoji: "🖊",
    title: "Live Whiteboard",
    desc: "Collaborate in real time with an interactive whiteboard — draw, annotate PDFs, and write math formulas together.",
    color: "#059669",
  },
  {
    emoji: "🏆",
    title: "Gamified Progress",
    desc: "Students earn achievements, maintain streaks, and compete on leaderboards to stay motivated.",
    color: "var(--accent)",
  },
  {
    emoji: "📅",
    title: "Smart Scheduling",
    desc: "Integrated calendar keeps assignments, live classes, and deadlines visible across the entire platform.",
    color: "var(--danger)",
  },
];

const STATS = [
  { value: "10,000+", label: "Students" },
  { value: "500+",    label: "Teachers" },
  { value: "2,400+",  label: "Courses" },
  { value: "98%",     label: "Satisfaction" },
];

const TESTIMONIALS = [
  {
    quote: "The Excelling Learner completely transformed how I deliver lessons. My students are more engaged than ever.",
    name: "Ms. Sarah Johnson",
    role: "Mathematics Teacher",
    avatar: "SJ",
    color: "var(--primary)",
  },
  {
    quote: "I went from failing to topping my class in one semester. The progress tracking keeps me motivated every day.",
    name: "Alex Thompson",
    role: "Grade 11 Student",
    avatar: "AT",
    color: "#7C3AED",
  },
  {
    quote: "The whiteboard feature is incredible — real-time collaboration with students feels like magic.",
    name: "Dr. David Lee",
    role: "Chemistry Teacher",
    avatar: "DL",
    color: "#059669",
  },
];

export default function LandingPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 var(--space-10)",
        height: 68,
        background: "rgba(15,23,42,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <div style={{ width: 36, height: 36, borderRadius: "var(--r-md)", overflow: "hidden", background: "#fff", flexShrink: 0 }}>
            <Image src="/logo.png" alt="The Excelling Learner logo" width={36} height={36} style={{ objectFit: "contain" }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: "var(--text-base)", color: "var(--text-primary)" }}>
            The Excelling Learner
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <Link href="/auth/login"  className="btn btn-ghost btn-sm">Sign In</Link>
          <Link href="/auth/signup" className="btn btn-primary btn-sm" id="nav-get-started-btn">Get Started Free</Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        minHeight: "92vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "var(--space-20) var(--space-6)",
        overflow: "hidden",
      }}>
        {/* Gradient orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
            width: 800, height: 800, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(2,132,199,0.18) 0%, transparent 65%)",
          }} />
          <div style={{
            position: "absolute", bottom: "0%", left: "15%",
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,130,32,0.1) 0%, transparent 65%)",
          }} />
          <div style={{
            position: "absolute", top: "30%", right: "10%",
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)",
          }} />
          {/* Grid overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
        </div>

        <div className="animate-fadeInUp" style={{ position: "relative", maxWidth: 760 }}>
          {/* Pill badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
            padding: "6px 16px",
            borderRadius: "var(--r-full)",
            background: "rgba(2,132,199,0.12)",
            border: "1px solid rgba(2,132,199,0.3)",
            fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--primary-light)",
            marginBottom: "var(--space-8)",
          }}>
            ✨ Now with AI-powered lesson suggestions
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 900,
            lineHeight: 1.08,
            marginBottom: "var(--space-6)",
            letterSpacing: "-0.02em",
          }}>
            The LMS that makes{" "}
            <span className="text-gradient-blue">teachers legendary</span>
            {" "}and{" "}
            <span className="text-gradient-accent">students unstoppable</span>
          </h1>

          <p style={{
            fontSize: "var(--text-xl)",
            color: "var(--text-secondary)",
            maxWidth: 580, margin: "0 auto var(--space-10)",
            lineHeight: 1.7,
          }}>
            A premium learning platform built for real classrooms — rich tools for teachers,
            a personalized journey for every student.
          </p>

          {/* CTA group */}
          <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap", marginBottom: "var(--space-12)" }}>
            <Link href="/teacher/dashboard" className="btn btn-primary btn-lg" id="hero-teacher-btn" style={{ minWidth: 200, justifyContent: "center" }}>
              🎓 Teacher Dashboard →
            </Link>
            <Link href="/student/dashboard" className="btn btn-accent btn-lg" id="hero-student-btn" style={{ minWidth: 200, justifyContent: "center" }}>
              📖 Student Dashboard →
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-6)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              {["SJ","AT","DL","RA","LK"].map((initials, i) => (
                <div key={initials} className="avatar" style={{
                  width: 32, height: 32,
                  background: ["var(--primary)","#7C3AED","#059669","var(--accent)","#DC2626"][i],
                  color: "#fff", fontSize: "var(--text-xs)",
                  marginLeft: i > 0 ? -10 : 0,
                  border: "2px solid var(--bg)",
                }}>
                  {initials}
                </div>
              ))}
            </div>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
              Trusted by <strong style={{ color: "var(--text-primary)" }}>10,000+ learners</strong> worldwide
            </span>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────── */}
      <section style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "var(--space-10) var(--space-6)",
      }}>
        <div style={{
          display: "flex", justifyContent: "center",
          gap: "var(--space-16)", flexWrap: "wrap",
          maxWidth: 800, margin: "0 auto",
        }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "var(--text-4xl)", fontWeight: 900, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Role Explorer ──────────────────────────────────── */}
      <section style={{ padding: "var(--space-20) var(--space-6)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
            <h2 style={{ fontSize: "var(--text-4xl)", fontWeight: 900, marginBottom: "var(--space-4)", letterSpacing: "-0.02em" }}>
              Built for every role
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)", maxWidth: 560, margin: "0 auto" }}>
              Two powerful dashboards, one unified platform. Pick your role and explore.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
            {/* Teacher Card */}
            <div className="card animate-fadeInUp" style={{
              background: "linear-gradient(145deg, rgba(2,132,199,0.12) 0%, var(--bg-card) 100%)",
              border: "1px solid rgba(2,132,199,0.2)",
              padding: "var(--space-10)",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>🎓</div>
              <h3 style={{ fontSize: "var(--text-2xl)", fontWeight: 800, marginBottom: "var(--space-3)" }}>For Teachers</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-8)" }}>
                {["Design and publish courses", "Track student performance", "Host live interactive classes", "Grade and provide feedback", "Open collaborative whiteboard"].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                    <span style={{ color: "var(--primary-light)", fontWeight: 700 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/teacher/dashboard" className="btn btn-primary btn-lg" id="role-teacher-btn" style={{ justifyContent: "center", display: "flex" }}>
                Explore Teacher Dashboard →
              </Link>
            </div>

            {/* Student Card */}
            <div className="card animate-fadeInUp delay-200" style={{
              background: "linear-gradient(145deg, rgba(245,130,32,0.12) 0%, var(--bg-card) 100%)",
              border: "1px solid rgba(245,130,32,0.2)",
              padding: "var(--space-10)",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>📖</div>
              <h3 style={{ fontSize: "var(--text-2xl)", fontWeight: 800, marginBottom: "var(--space-3)" }}>For Students</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-8)" }}>
                {["Follow a personalised learning path", "Track grades and progress", "Complete interactive assignments", "Earn achievements and badges", "Collaborate on a live whiteboard"].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                    <span style={{ color: "var(--accent-light)", fontWeight: 700 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/student/dashboard" className="btn btn-accent btn-lg" id="role-student-btn" style={{ justifyContent: "center", display: "flex" }}>
                Explore Student Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section style={{ padding: "var(--space-20) var(--space-6)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
            <h2 style={{ fontSize: "var(--text-4xl)", fontWeight: 900, marginBottom: "var(--space-4)", letterSpacing: "-0.02em" }}>
              Everything you need, nothing you don&apos;t
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)", maxWidth: 520, margin: "0 auto" }}>
              Thoughtfully crafted features that actually matter in a real classroom.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-5)" }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="card animate-fadeInUp"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: "var(--r-md)",
                  background: `${f.color}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", marginBottom: "var(--space-5)",
                }}>
                  {f.emoji}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "var(--text-lg)", marginBottom: "var(--space-3)" }}>{f.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section style={{ padding: "var(--space-20) var(--space-6)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
            <h2 style={{ fontSize: "var(--text-4xl)", fontWeight: 900, marginBottom: "var(--space-4)", letterSpacing: "-0.02em" }}>
              Loved by teachers &amp; students
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-5)" }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                {/* Stars */}
                <div style={{ color: "#FBBF24", fontSize: "var(--text-sm)" }}>★★★★★</div>
                <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.8, flex: 1 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-4)" }}>
                  <div className="avatar" style={{ width: 40, height: 40, background: t.color, color: "#fff", fontWeight: 700, fontSize: "var(--text-sm)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>{t.name}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────── */}
      <section style={{ padding: "var(--space-20) var(--space-6)", borderTop: "1px solid var(--border)" }}>
        <div style={{
          maxWidth: 800, margin: "0 auto", textAlign: "center",
          padding: "var(--space-12)",
          borderRadius: "var(--r-xl)",
          background: "linear-gradient(135deg, rgba(2,132,199,0.15) 0%, rgba(245,130,32,0.1) 100%)",
          border: "1px solid rgba(2,132,199,0.2)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)",
            width: 600, height: 600, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(2,132,199,0.1) 0%, transparent 65%)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontSize: "var(--text-4xl)", fontWeight: 900, marginBottom: "var(--space-4)", letterSpacing: "-0.02em" }}>
              Ready to start excelling?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)", marginBottom: "var(--space-8)" }}>
              Join thousands of educators and students already transforming how they teach and learn.
            </p>
            <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/auth/signup?role=teacher" className="btn btn-primary btn-lg" id="cta-teacher-signup-btn" style={{ minWidth: 180, justifyContent: "center" }}>
                🎓 Join as Teacher
              </Link>
              <Link href="/auth/signup?role=student" className="btn btn-accent btn-lg" id="cta-student-signup-btn" style={{ minWidth: 180, justifyContent: "center" }}>
                📖 Join as Student
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "var(--space-8) var(--space-6)", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
          <div style={{ width: 28, height: 28, borderRadius: "var(--r-sm)", overflow: "hidden", background: "#fff", flexShrink: 0 }}>
            <Image src="/logo.png" alt="The Excelling Learner logo" width={28} height={28} style={{ objectFit: "contain" }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>The Excelling Learner</span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
          © {new Date().getFullYear()} The Excelling Learner. Built with passion for education.
        </p>
      </footer>
    </div>
  );
}
