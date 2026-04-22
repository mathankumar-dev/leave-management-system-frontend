// ─────────────────────────────────────────────────────────────────────────────
//  QuizPage.jsx  —  /skillset/quiz/:courseId route
//  Employee takes the quiz for a course.
//  Questions & answers come from the backend.
//  On submit → POST /api/skillset/quiz/submit
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SKILLSET_MODULE_CONFIG } from "../data/skillsetConfig";

export default function QuizPage({ currentUser }) {
  const { courseId } = useParams();
  const navigate     = useNavigate();
  const [quiz, setQuiz]         = useState(null);
  const [answers, setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult]     = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Replace with: fetch(`/api/skillset/quiz/${courseId}`)
    const mockQuiz = {
      id: courseId,
      courseTitle: "Introduction to Data Privacy",
      timeLimit: 600,  // seconds; null = no limit
      questions: [
        {
          id: "q1",
          text: "What does GDPR stand for?",
          options: [
            "General Data Processing Regulation",
            "General Data Protection Regulation",
            "Global Data Privacy Rules",
            "General Digital Privacy Regulation",
          ],
          correct: 1,
        },
        {
          id: "q2",
          text: "Which of the following is NOT a type of personal data under GDPR?",
          options: ["Name", "Email address", "Public company name", "IP address"],
          correct: 2,
        },
        {
          id: "q3",
          text: "A data subject has the right to:",
          options: [
            "Access their data only",
            "Be forgotten, but not to access data",
            "Access, correct, delete and port their data",
            "Request only deletion of their data",
          ],
          correct: 2,
        },
        {
          id: "q4",
          text: "Who is responsible for ensuring GDPR compliance in an organization?",
          options: ["Only IT department", "Only the CEO", "Every employee who handles personal data", "Legal department only"],
          correct: 2,
        },
        {
          id: "q5",
          text: "What is the maximum fine under GDPR for serious violations?",
          options: ["€10 million or 2% global turnover", "€20 million or 4% global turnover",
            "€50 million or 10% global turnover", "€5 million or 1% global turnover"],
          correct: 1,
        },
      ],
    };
    setQuiz(mockQuiz);
    if (mockQuiz.timeLimit) {
      setTimeLeft(mockQuiz.timeLimit);
    }
  }, [courseId]);

  // Timer
  useEffect(() => {
    if (timeLeft === null || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, submitted]);

  const handleSubmit = () => {
    clearTimeout(timerRef.current);
    if (!quiz) return;
    const correct = quiz.questions.filter(q => answers[q.id] === q.correct).length;
    const score   = Math.round((correct / quiz.questions.length) * 100);
    // Replace with: POST /api/skillset/quiz/submit { courseId, employeeId: currentUser.id, answers, score }
    setResult({ correct, total: quiz.questions.length, score });
    setSubmitted(true);
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const allAnswered = quiz ? Object.keys(answers).length === quiz.questions.length : false;

  if (!quiz) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
      <p style={{ color: "#6b7280" }}>Loading quiz…</p>
    </div>
  );

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh",
      fontFamily: "system-ui, sans-serif", padding: "0 0 60px" }}>
      {/* Sticky header */}
      <div style={{ position: "sticky", top: 0, zIndex: 10,
        background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: "#6b7280", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Quiz · {quiz.courseTitle}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "#374151" }}>
            {quiz.questions.length} questions
          </p>
        </div>
        {timeLeft !== null && !submitted && (
          <div style={{
            background: timeLeft < 60 ? "#fee2e2" : "#eff6ff",
            color: timeLeft < 60 ? "#dc2626" : "#2563eb",
            padding: "6px 16px", borderRadius: 20, fontSize: 15, fontWeight: 700,
          }}>
            ⏱ {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px" }}>
        {/* ── Result screen ── */}
        {submitted && result && (
          <div style={{
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: 20, padding: "40px", textAlign: "center",
          }}>
            <div style={{ fontSize: 56, marginBottom: 8 }}>
              {result.score >= 65 ? "🎉" : "📖"}
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", color: "#111827" }}>
              {result.score}%
            </h2>
            <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 24px" }}>
              You got {result.correct} out of {result.total} questions correct
            </p>
            <div style={{
              display: "inline-block", padding: "8px 20px", borderRadius: 20,
              background: result.score >= 65 ? "#dcfce7" : "#fee2e2",
              color: result.score >= 65 ? "#166534" : "#dc2626",
              fontWeight: 700, fontSize: 14, marginBottom: 32,
            }}>
              {result.score >= 65 ? "✓ Passed" : "✗ Did not pass"}
            </div>

            {/* Show correct answers */}
            <div style={{ textAlign: "left", marginBottom: 28 }}>
              {quiz.questions.map((q, i) => {
                const userAns = answers[q.id];
                const isCorrect = userAns === q.correct;
                return (
                  <div key={q.id} style={{
                    padding: "14px 16px", marginBottom: 10, borderRadius: 10,
                    background: isCorrect ? "#f0fdf4" : "#fef2f2",
                    border: `1px solid ${isCorrect ? "#86efac" : "#fca5a5"}`,
                  }}>
                    <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#111827" }}>
                      {i + 1}. {q.text}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: isCorrect ? "#166534" : "#dc2626" }}>
                      {isCorrect ? "✓ Correct" : `✗ Your answer: "${q.options[userAns]}" · Correct: "${q.options[q.correct]}"`}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              {!isCorrect && SKILLSET_MODULE_CONFIG.allowQuizRetakes && (
                <button
                  onClick={() => { setSubmitted(false); setAnswers({}); setResult(null);
                    setTimeLeft(quiz.timeLimit); }}
                  style={{ padding: "10px 24px", borderRadius: 10,
                    border: "1px solid #2563eb", background: "transparent",
                    color: "#2563eb", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
                >
                  Retake Quiz
                </button>
              )}
              <button
                onClick={() => navigate("/skillset")}
                style={{ padding: "10px 24px", borderRadius: 10, border: "none",
                  background: "#2563eb", color: "#fff", fontWeight: 600,
                  fontSize: 14, cursor: "pointer" }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* ── Questions ── */}
        {!submitted && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {quiz.questions.map((q, idx) => (
                <div key={q.id} style={{
                  background: "#fff", border: "1px solid #e5e7eb",
                  borderRadius: 16, padding: "24px 26px",
                }}>
                  <p style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111827" }}>
                    <span style={{ color: "#9ca3af", fontSize: 13, marginRight: 8 }}>
                      {idx + 1}/{quiz.questions.length}
                    </span>
                    {q.text}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {q.options.map((opt, oi) => {
                      const chosen = answers[q.id] === oi;
                      return (
                        <label key={oi} style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "11px 16px", borderRadius: 10, cursor: "pointer",
                          background: chosen ? "#eff6ff" : "#f9fafb",
                          border: `1.5px solid ${chosen ? "#93c5fd" : "#e5e7eb"}`,
                          transition: "all 0.12s",
                        }}>
                          <input
                            type="radio" name={q.id} checked={chosen}
                            onChange={() => setAnswers(a => ({ ...a, [q.id]: oi }))}
                            style={{ width: 16, height: 16, accentColor: "#2563eb" }}
                          />
                          <span style={{ fontSize: 14, color: "#111827" }}>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div style={{ marginTop: 32, display: "flex", gap: 12, alignItems: "center" }}>
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                style={{
                  flex: 1, padding: "14px 0", borderRadius: 12, border: "none",
                  background: allAnswered ? "#2563eb" : "#e5e7eb",
                  color: allAnswered ? "#fff" : "#9ca3af",
                  fontSize: 15, fontWeight: 700,
                  cursor: allAnswered ? "pointer" : "not-allowed",
                  transition: "background 0.15s",
                }}
              >
                Submit Quiz ({Object.keys(answers).length}/{quiz.questions.length} answered)
              </button>
              <button
                onClick={() => navigate("/skillset")}
                style={{ padding: "14px 20px", borderRadius: 12,
                  border: "1px solid #e5e7eb", background: "transparent",
                  color: "#6b7280", fontSize: 14, cursor: "pointer" }}
              >
                Save &amp; Exit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}