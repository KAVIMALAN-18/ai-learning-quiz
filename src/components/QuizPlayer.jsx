import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Timer, CheckCircle, ChevronLeft, ChevronRight, Trophy, Target, AlertCircle, Rocket } from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent } from "./ui/Card";
import Button from "./ui/Button";
import Skeleton from "./ui/Skeleton";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const QuizPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/quiz/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuiz(res.data.quiz);
        setAnswers(res.data.quiz.questions.map(() => null));
      } catch (err) {
        console.error("Failed to load quiz:", err);
      }
    };

    fetchQuiz();
  }, [id, token]);

  useEffect(() => {
    if (!quiz || result) return;

    const question = quiz.questions[currentIndex];
    setTimeLeft(question.timeLimit || 60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, currentIndex, result]);

  const handleTimeUp = () => {
    if (currentIndex === quiz.questions.length - 1) {
      submitQuiz();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const selectAnswer = (value) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = value;
      return copy;
    });
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const payload = {
        quizId: quiz._id,
        answers: quiz.questions.map((q, i) => ({
          questionId: q._id,
          answer: answers[i],
        })),
      };

      const res = await axios.post(
        "http://localhost:3000/api/quiz/submit",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data.attempt);
    } catch (err) {
      console.error("Submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const progress = useMemo(
    () => ({
      current: currentIndex + 1,
      total: quiz ? quiz.questions.length : 0,
      percent: quiz ? ((currentIndex + 1) / quiz.questions.length) * 100 : 0
    }),
    [currentIndex, quiz]
  );

  if (!quiz) {
    return (
      <div className="max-w-3xl mx-auto p-8 space-y-8 animate-pulse">
        <Skeleton variant="text" className="h-10 w-2/3 mx-auto" />
        <Card className="p-8 space-y-6">
          <Skeleton variant="text" className="h-6 w-full" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="rect" className="h-12 w-full rounded-xl" />)}
          </div>
        </Card>
      </div>
    );
  }

  if (result) {
    const correct = result.answers.filter((a) => a.correct).length;
    const wrong = result.answers.length - correct;
    const accuracy = ((correct / result.answers.length) * 100).toFixed(1);

    const pieData = {
      labels: ["Correct", "Wrong"],
      datasets: [
        {
          data: [correct, wrong],
          backgroundColor: ["#10b981", "#ef4444"],
          borderWidth: 0,
          hoverOffset: 4
        },
      ],
    };

    const barData = {
      labels: result.answers.map((_, i) => `Q${i + 1}`),
      datasets: [
        {
          label: "Marks Obtained",
          data: result.answers.map((a) => a.marksObtained),
          backgroundColor: "#6366f1",
          borderRadius: 8,
        },
      ],
    };

    return (
      <div className="p-6 max-w-5xl mx-auto animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/10">
            <Trophy size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Quiz Completed!</h2>
          <p className="text-slate-500 text-lg">Great effort! Here is how you performed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6 text-center border-none shadow-premium transition-transform hover:scale-105">
            <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Final Score</div>
            <div className="text-4xl font-extrabold text-primary-600">{result.score}</div>
          </Card>
          <Card className="p-6 text-center border-none shadow-premium transition-transform hover:scale-105">
            <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Accuracy</div>
            <div className="text-4xl font-extrabold text-secondary-600">{accuracy}%</div>
          </Card>
          <Card className="p-6 text-center border-none shadow-premium transition-transform hover:scale-105">
            <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Correct Answers</div>
            <div className="text-4xl font-extrabold text-emerald-600">{correct}/{result.answers.length}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <Card className="p-8 border-none shadow-xl">
            <CardTitle className="text-center mb-6">Performance Breakdown</CardTitle>
            <div className="h-64 flex items-center justify-center">
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </Card>
          <Card className="p-8 border-none shadow-xl">
            <CardTitle className="text-center mb-6">Marks per Question</CardTitle>
            <div className="h-64">
              <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </Card>
        </div>

        <Card className="border-none shadow-xl overflow-hidden mb-10">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <Target className="text-primary-600" />
              Question Review
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-50">
            {result.answers.map((ans, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${ans.correct ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}>
                    {idx + 1}
                  </div>
                  <div className="text-sm font-medium text-slate-700">Question {idx + 1}</div>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${ans.correct ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  }`}>
                  {ans.correct ? "CORRECT" : "WRONG"}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
          <Button size="lg" onClick={() => window.location.reload()} className="shadow-lg shadow-primary-500/20">
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  const q = quiz.questions[currentIndex];
  const timerColor = timeLeft < 10 ? "text-red-500 animate-pulse" : "text-slate-600";

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in h-[calc(100vh-200px)] flex flex-col">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
              Assessment Path
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 text-sm font-medium">{quiz.topic}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Question {progress.current} of {progress.total}</h2>
        </div>

        <div className={`flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-premium border border-slate-100 ${timerColor}`}>
          <Timer size={20} className={timeLeft < 10 ? "animate-spin" : ""} />
          <span className="text-xl font-mono font-bold">{timeLeft}s</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full mb-10 overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      <Card className="flex-1 border-none shadow-2xl p-6 md:p-10 flex flex-col animate-slide-up">
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-10 leading-relaxed">
            {q.question}
          </h3>

          <div className="space-y-4">
            {q.type === "mcq" &&
              q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => selectAnswer(opt)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group ${answers[currentIndex] === opt
                      ? "bg-primary-50 border-primary-500 ring-4 ring-primary-500/5 shadow-md"
                      : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  <span className={`text-base font-semibold ${answers[currentIndex] === opt ? "text-primary-700" : "text-slate-600"}`}>
                    {opt}
                  </span>
                  {answers[currentIndex] === opt && <CheckCircle className="text-primary-500 animate-fade-in" size={20} />}
                </button>
              ))}

            {q.type === "multi-select" && (
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 mb-6 flex items-center gap-3 text-amber-700 text-xs font-bold uppercase tracking-wider">
                <AlertCircle size={16} /> Choose all that apply
              </div>
            )}

            {q.type === "multi-select" &&
              q.options.map((opt, i) => {
                const isSelected = answers[currentIndex]?.includes(opt);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      const prev = answers[currentIndex] || [];
                      const updated = isSelected
                        ? prev.filter((o) => o !== opt)
                        : [...prev, opt];
                      selectAnswer(updated);
                    }}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group ${isSelected
                        ? "bg-primary-50 border-primary-500 ring-4 ring-primary-500/5 shadow-md"
                        : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                  >
                    <span className={`text-base font-semibold ${isSelected ? "text-primary-700" : "text-slate-600"}`}>
                      {opt}
                    </span>
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? "bg-primary-500 border-primary-500 text-white" : "border-slate-300"
                      }`}>
                      {isSelected && <CheckCircle size={16} />}
                    </div>
                  </button>
                );
              })}

            {q.type === "true-false" && (
              <div className="grid grid-cols-2 gap-6 pt-10">
                <Button
                  variant={answers[currentIndex] === "true" ? "primary" : "outline"}
                  size="lg"
                  onClick={() => selectAnswer("true")}
                  className={`h-32 rounded-3xl text-xl ${answers[currentIndex] === "true" ? "shadow-xl shadow-primary-500/20" : ""}`}
                >
                  True
                </Button>
                <Button
                  variant={answers[currentIndex] === "false" ? "primary" : "outline"}
                  size="lg"
                  onClick={() => selectAnswer("false")}
                  className={`h-32 rounded-3xl text-xl ${answers[currentIndex] === "false" ? "shadow-xl shadow-primary-500/20" : ""}`}
                >
                  False
                </Button>
              </div>
            )}

            {q.type === "coding" && (
              <div className="relative">
                <textarea
                  className="w-full h-64 bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-sm border-none focus:ring-4 focus:ring-primary-500/20 shadow-inner"
                  value={answers[currentIndex] || ""}
                  onChange={(e) => selectAnswer(e.target.value)}
                  placeholder="// Write your code here..."
                />
                <div className="absolute top-4 right-4 text-xs font-bold text-slate-500 uppercase tracking-widest pointer-events-none">
                  Editor
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex justify-between items-center bg-slate-50 -mx-6 md:-mx-10 -mb-6 md:-mb-10 p-6 md:p-8">
          <Button
            variant="outline"
            size="md"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="gap-2"
          >
            <ChevronLeft size={18} />
            Previous
          </Button>

          {currentIndex < quiz.questions.length - 1 ? (
            <Button
              size="lg"
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="gap-2 shadow-lg shadow-primary-500/10"
            >
              Next Question
              <ChevronRight size={18} />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={submitQuiz}
              disabled={submitting}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  Submit Final Results
                  <Rocket size={18} />
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuizPlayer;
