import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { CheckCircle, X } from "lucide-react";
import axios from "axios";
import Layout from "./Layout";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [customGoals, setCustomGoals] = useState([]);
  const [customGoalInput, setCustomGoalInput] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token ,fetchProfile} = useAuth();
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
    { id: "beginner", label: "Beginner", description: "Just starting out" },
    { id: "intermediate", label: "Intermediate", description: "Some experience" },
    { id: "advanced", label: "Advanced", description: "Expert level" },
  ];

  const handleGoalToggle = (goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleAddCustomGoal = () => {
    if (customGoalInput.trim() && customGoals.length < 5) {
      setCustomGoals([...customGoals, customGoalInput.trim()]);
      setCustomGoalInput("");
      setError("");
    }
  };

  const handleRemoveCustomGoal = (index) => {
    setCustomGoals(customGoals.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedGoals.length === 0) {
      setError("Please select at least one learning goal");
      return;
    }

    if (!selectedLevel) {
      setError("Please select your current level");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/onboarding",
        {
          goals: selectedGoals,
          customGoals: customGoals,
          level: selectedLevel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/dashboard");
        
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
      fetchProfile()
      
        
    }
  };

  return (
    <Layout>
        {/* Header */}
        <div className="text-left mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            🎯 Personalize Your Learning
          </h1>
          <p className="text-lg text-gray-600">
            Help us tailor the experience for you
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center ${s !== 3 ? "flex-1" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step >= s
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                {s !== 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step > s ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className={step >= 1 ? "text-indigo-600" : "text-gray-600"}>
              Learning Goals
            </span>
            <span className={step >= 2 ? "text-indigo-600" : "text-gray-600"}>
              Custom Goals
            </span>
            <span className={step >= 3 ? "text-indigo-600" : "text-gray-600"}>
              Experience Level
            </span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-gray-900">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Step 1: Learning Goals */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                What do you want to learn?
              </h2>
              <p className="text-gray-600 mb-8">
                Select one or more topics that interest you
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {predefinedGoals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleGoalToggle(goal)}
                    className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                      selectedGoals.includes(goal)
                        ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-200 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedGoals.includes(goal)
                            ? "border-indigo-600 bg-indigo-600"
                              : "border-gray-300"
                        }`}
                      >
                        {selectedGoals.includes(goal) && (
                          <span className="text-white font-bold">✓</span>
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">{goal}</span>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Selected: {selectedGoals.length} goal(s)
              </p>

              <button
                onClick={() => setStep(2)}
                disabled={selectedGoals.length === 0}
                className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                Next Step →
              </button>
            </div>
          )}

          {/* Step 2: Custom Goals */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Add Custom Goals (Optional)
              </h2>
              <p className="text-gray-600 mb-8">
                Add specific topics or skills you want to focus on (up to 5)
              </p>

              <div className="mb-8">
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={customGoalInput}
                    onChange={(e) => setCustomGoalInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddCustomGoal()}
                    placeholder="e.g., Building a SaaS App"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 bg-white text-gray-900 transition"
                  />
                  <button
                    onClick={handleAddCustomGoal}
                    disabled={customGoals.length >= 5}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-semibold"
                  >
                    Add
                  </button>
                </div>

                {/* Custom Goals List */}
                <div className="space-y-2">
                  {customGoals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-indigo-50 p-4 rounded-lg border-2 border-indigo-100"
                    >
                      <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-indigo-600" />
                          <span className="font-medium text-gray-900">{goal}</span>
                      </div>
                        <button
                          onClick={() => handleRemoveCustomGoal(index)}
                          className="text-red-600 hover:text-red-700 transition"
                        >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-600 mt-4">
                  {customGoals.length}/5 custom goals added
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-gray-300 text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-bold py-4 rounded-xl transition transform hover:scale-105"
                  >
                    Next Step →
                  </button>
              </div>
            </div>
          )}

          {/* Step 3: Experience Level */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                What's your experience level?
              </h2>
              <p className="text-gray-600 mb-8">
                We'll adjust the difficulty accordingly
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`p-8 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                      selectedLevel === level.id
                        ? "border-indigo-600 bg-indigo-50 shadow-lg"
                        : "border-gray-200 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <div className="text-4xl mb-3">
                      {level.id === "beginner" && "🌱"}
                      {level.id === "intermediate" && "🚀"}
                      {level.id === "advanced" && "⭐"}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {level.label}
                    </h3>
                    <p className="text-gray-600">{level.description}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border-2 border-gray-300 text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedLevel || loading}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
                  >
                    {loading ? "Completing..." : "Complete Onboarding ✓"}
                  </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-left text-gray-600 text-sm mt-8">
          You can update these preferences anytime in your settings
        </p>
      
    </Layout>

      
     
  );
};

export default Onboarding;