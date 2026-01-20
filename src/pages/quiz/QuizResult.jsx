import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import quizService from "../../services/quiz.service";
import { useAuth } from "../../context/useAuth";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ProgressRing from "../../components/ui/ProgressRing";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

function TopicBar({ t }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <div>{t.topic}</div>
        <div>{t.percent}%</div>
      </div>
      <div className="w-full bg-gray-100 rounded h-2 overflow-hidden">
        <div
          className="h-2 bg-indigo-600 rounded"
          style={{ width: `${t.percent}%` }}
        />
      </div>
    </div>
  );
}

export default function QuizResult() {
  const { id: quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [result, setResult] = useState(location.state?.result || null);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (result) return;
    let cancelled = false;
    const load = async () => {
      setLoadingLocal(true);
      try {
        const res = await quizService.getResult(quizId);
        if (!cancelled) setResult(res?.result || res);
      } catch {
        if (!cancelled) setError("Failed to load result");
      } finally {
        if (!cancelled) setLoadingLocal(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [quizId, result]);

  if (loading || loadingLocal)
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );
  if (!user)
    return <div className="p-8 text-center">Please login.</div>;
  if (error)
    return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!result)
    return <div className="p-8 text-center">No result available.</div>;

  const { score = 0, total = 0, perTopic = [], timeTaken = 0 } = result;
  const percentage = total ? Math.round((score / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Quiz Report</h1>
        <Button variant="ghost" onClick={() => navigate("/dashboard/quiz")}>
          Back
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-6">
          <div style={{ width: 110 }}>
            {/* ✅ FIXED PROP */}
            <ProgressRing value={percentage} />
          </div>
          <div>
            <div className="text-3xl font-bold">
              {score} / {total}
            </div>
            <div className="text-sm text-gray-600">
              Accuracy: {percentage}% • Time: {Math.floor(timeTaken / 60)}m{" "}
              {timeTaken % 60}s
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm text-gray-500 mb-3">Topic Performance</h3>
        {perTopic.map((t) => (
          <TopicBar key={t.topic} t={t} />
        ))}
      </Card>
    </div>
  );
}
