import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";

const Onboarding = () => {
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [customGoals, setCustomGoals] = useState([]);
  const [customGoalInput, setCustomGoalInput] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token, fetchProfile } = useAuth();
  const navigate = useNavigate();

  const predefinedGoals = [
    "JavaScript",
    "Python",
    "React",
    "Web Development",
    "Data Science",
    "Machine Learning",
    "Mobile Development",
    "Cloud Computing",
  ];

  const levels = [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ];

  const toggleGoal = (goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal)
        ? prev.filter((g) => g !== goal)
        : [...prev, goal]
    );
  };

  const addCustomGoal = () => {
    if (!customGoalInput.trim()) return;
    setCustomGoals([...customGoals, customGoalInput.trim()]);
    setCustomGoalInput("");
  };

  const submitOnboarding = async () => {
    if (!selectedGoals.length) {
      setError("Select at least one goal");
      return;
    }

    if (!selectedLevel) {
      setError("Select your level");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(
        "http://localhost:5000/api/onboarding",
        {
          goals: selectedGoals,
          customGoals,
          level: selectedLevel,
          onboardingCompleted: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchProfile();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Onboarding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow mt-10">
        <h1 className="text-2xl font-bold mb-6">Welcome! Let’s set you up</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
            {error}
          </div>
        )}

        {/* Goals */}
        <h2 className="font-semibold mb-2">Choose learning goals</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {predefinedGoals.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={`p-3 rounded border ${
                selectedGoals.includes(goal)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-50"
              }`}
            >
              {goal}
            </button>
          ))}
        </div>

        {/* Custom goals */}
        <div className="flex gap-2 mb-4">
          <input
            value={customGoalInput}
            onChange={(e) => setCustomGoalInput(e.target.value)}
            placeholder="Add custom goal"
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={addCustomGoal}
            className="px-4 bg-indigo-600 text-white rounded"
          >
            Add
          </button>
        </div>

        {customGoals.length > 0 && (
          <div className="mb-6">
            {customGoals.map((g, i) => (
              <span
                key={i}
                className="inline-block bg-indigo-100 px-3 py-1 rounded mr-2 mb-2"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Level */}
        <h2 className="font-semibold mb-2">Select your level</h2>
        <div className="flex gap-3 mb-6">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`px-4 py-2 rounded border ${
                selectedLevel === lvl.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-50"
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        <button
          onClick={submitOnboarding}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Saving..." : "Finish Onboarding"}
        </button>
      </div>
    </Layout>
  );
};

export default Onboarding;
