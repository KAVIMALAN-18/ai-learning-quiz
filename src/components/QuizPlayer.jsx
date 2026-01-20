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

  /* ---------------- FETCH QUIZ ---------------- */
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

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (!quiz) return;

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
    // eslint-disable-next-line
  }, [quiz, currentIndex]);

  const handleTimeUp = () => {
    if (currentIndex === quiz.questions.length - 1) {
      submitQuiz();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  /* ---------------- ANSWERS ---------------- */
  const selectAnswer = (value) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = value;
      return copy;
    });
  };

  /* ---------------- SUBMIT QUIZ ---------------- */
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
    }),
    [currentIndex, quiz]
  );

  /* ---------------- LOADING ---------------- */
  if (!quiz) {
    return <div className="p-6 text-center">Loading quiz...</div>;
  }

  /* ---------------- RESULT VIEW ---------------- */
  if (result) {
    const correct = result.answers.filter((a) => a.correct).length;
    const wrong = result.answers.length - correct;

    const pieData = {
      labels: ["Correct", "Wrong"],
      datasets: [
        {
          data: [correct, wrong],
          backgroundColor: ["#10b981", "#ef4444"],
        },
      ],
    };

    const barData = {
      labels: result.answers.map((_, i) => `Q${i + 1}`),
      datasets: [
        {
          label: "Marks",
          data: result.answers.map((a) => a.marksObtained),
          backgroundColor: "#6366f1",
        },
      ],
    };

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>

        <p className="mb-2">
          Score: <strong>{result.score}</strong>
        </p>
        <p className="mb-4">
          Accuracy:{" "}
          <strong>
            {((correct / result.answers.length) * 100).toFixed(1)}%
          </strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <Pie data={pieData} />
          </div>
          <div className="bg-white p-4 rounded shadow">
            <Bar data={barData} />
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  /* ---------------- QUESTION VIEW ---------------- */
  const q = quiz.questions[currentIndex];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between mb-4">
        <h3 className="font-bold">
          {quiz.topic} — Question {progress.current}/{progress.total}
        </h3>
        <span className="text-gray-600">⏱ {timeLeft}s</span>
      </div>

      <div className="bg-white p-6 rounded shadow mb-4">
        <p className="font-medium mb-4">{q.question}</p>

        {q.type === "mcq" &&
          q.options.map((opt, i) => (
            <label
              key={i}
              className="flex items-center gap-2 mb-2 cursor-pointer"
            >
              <input
                type="radio"
                checked={answers[currentIndex] === opt}
                onChange={() => selectAnswer(opt)}
              />
              {opt}
            </label>
          ))}

        {q.type === "multi-select" &&
          q.options.map((opt, i) => (
            <label key={i} className="flex gap-2 mb-2">
              <input
                type="checkbox"
                checked={answers[currentIndex]?.includes(opt) || false}
                onChange={(e) => {
                  const prev = answers[currentIndex] || [];
                  const updated = e.target.checked
                    ? [...prev, opt]
                    : prev.filter((o) => o !== opt);
                  selectAnswer(updated);
                }}
              />
              {opt}
            </label>
          ))}

        {q.type === "true-false" && (
          <div className="flex gap-4">
            <button
              onClick={() => selectAnswer("true")}
              className={`px-4 py-2 rounded ${
                answers[currentIndex] === "true"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              True
            </button>
            <button
              onClick={() => selectAnswer("false")}
              className={`px-4 py-2 rounded ${
                answers[currentIndex] === "false"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              False
            </button>
          </div>
        )}

        {q.type === "coding" && (
          <textarea
            className="w-full h-40 border p-3 font-mono"
            value={answers[currentIndex] || ""}
            onChange={(e) => selectAnswer(e.target.value)}
          />
        )}
      </div>

      <div className="flex justify-between items-center">
        <div>
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="px-4 py-2 bg-gray-200 rounded mr-2"
          >
            Previous
          </button>

          {currentIndex < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submitQuiz}
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Submit Quiz
            </button>
          )}
        </div>

        <div className="w-1/3 bg-gray-200 h-3 rounded">
          <div
            className="h-full bg-indigo-600 rounded"
            style={{
              width: `${(progress.current / progress.total) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;
