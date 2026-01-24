import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Check, Plus, Rocket, Sparkles, Target, Zap } from "lucide-react";
import { Card } from "./ui/Card";
import Button from "./ui/Button";
import Container from "./ui/Container";
import { Title, SectionHeader, BodyText, MetaText } from "./ui/Typography";

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
    { name: "JavaScript", icon: "📦" },
    { name: "Python", icon: "🐍" },
    { name: "React", icon: "⚛️" },
    { name: "Web Development", icon: "🌐" },
    { name: "Data Science", icon: "📊" },
    { name: "Machine Learning", icon: "🤖" },
    { name: "Mobile", icon: "📱" },
    { name: "Cloud", icon: "☁️" },
  ];

  const levels = [
    { id: "beginner", label: "Beginner", desc: "Starting from concepts" },
    { id: "intermediate", label: "Intermediate", desc: "Building applications" },
    { id: "advanced", label: "Advanced", desc: "System architecture" },
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
    if (!customGoals.includes(customGoalInput.trim())) {
      setCustomGoals([...customGoals, customGoalInput.trim()]);
    }
    setCustomGoalInput("");
  };

  const submitOnboarding = async () => {
    if (!selectedGoals.length && !customGoals.length) {
      setError("Please select at least one learning goal");
      return;
    }

    if (!selectedLevel) {
      setError("Please select your current proficiency level");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post(
        "/onboarding",
        {
          goals: selectedGoals,
          customGoals,
          level: selectedLevel,
          onboardingCompleted: true,
        }
      );

      await fetchProfile();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Onboarding failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8">
      <Container className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-primary-100">
            <Sparkles size={14} className="fill-primary-100" /> Personalized Path
          </div>
          <Title className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">Welcome to LearnSphere</Title>
          <BodyText className="text-neutral-500 max-w-xl mx-auto">
            Tell us about your technical goals so we can customize your milestone-based roadmap.
          </BodyText>
        </div>

        <Card className="border-neutral-100 p-8 md:p-12 shadow-2xl">
          {error && (
            <div className="mb-10 p-4 bg-error/5 border border-error/10 text-error rounded-md text-sm font-bold flex items-center gap-3 animate-slide-up">
              <Zap size={18} />
              {error}
            </div>
          )}

          {/* Section 1: Goals */}
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-md bg-primary-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary-600/20">1</div>
              <div>
                <SectionHeader className="mt-0 mb-1 text-2xl font-black">Choose your learning goals</SectionHeader>
                <MetaText className="uppercase font-bold tracking-widest text-[10px]">Select as many as you like</MetaText>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {predefinedGoals.map((goal) => {
                const isSelected = selectedGoals.includes(goal.name);
                return (
                  <button
                    key={goal.name}
                    onClick={() => toggleGoal(goal.name)}
                    className={`p-6 rounded-md border-2 transition-all duration-300 text-center group ${isSelected
                      ? "bg-primary-50 border-primary-600 shadow-md transform scale-[1.02]"
                      : "bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50"
                      }`}
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{goal.icon}</div>
                    <div className={`text-xs font-black uppercase tracking-widest ${isSelected ? "text-primary-700" : "text-neutral-500"}`}>
                      {goal.name}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  value={customGoalInput}
                  onChange={(e) => setCustomGoalInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomGoal()}
                  placeholder="Add custom skill (e.g. Next.js, AI Art...)"
                  className="flex-1 px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-md text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-inner"
                />
                <Button variant="outline" onClick={addCustomGoal} className="px-8 bg-white border-neutral-200">
                  <Plus size={20} />
                </Button>
              </div>

              {customGoals.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {customGoals.map((goal, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-md text-xs font-black uppercase tracking-widest border border-primary-100 animate-fade-in"
                    >
                      <Target size={14} />
                      {goal}
                      <button
                        onClick={() => setCustomGoals(prev => prev.filter(g => g !== goal))}
                        className="ml-2 hover:text-error transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Level */}
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-md bg-primary-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary-600/20">2</div>
              <div>
                <SectionHeader className="mt-0 mb-1 text-2xl font-black">Proficiency level</SectionHeader>
                <MetaText className="uppercase font-bold tracking-widest text-[10px]">Your current experience depth</MetaText>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {levels.map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`p-6 rounded-md border-2 transition-all duration-300 text-left relative overflow-hidden group ${isSelected
                      ? "bg-secondary-50 border-secondary-500 shadow-xl ring-4 ring-secondary-500/10"
                      : "bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50"
                      }`}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center animate-fade-in shadow-lg">
                        <Check className="text-white w-4 h-4" strokeWidth={3} />
                      </div>
                    )}
                    <div className={`text-sm font-black uppercase tracking-widest mb-1 ${isSelected ? "text-secondary-700" : "text-neutral-900"}`}>{lvl.label}</div>
                    <div className="text-xs text-neutral-500 font-medium">{lvl.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={submitOnboarding}
            disabled={loading}
            fullWidth
            size="lg"
            className="py-5 font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/30"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Constructing Path...
              </span>
            ) : (
              <span className="flex items-center gap-2 text-base">
                <Rocket size={20} className="mr-2" /> Start My Journey
              </span>
            )}
          </Button>
        </Card>
      </Container>
    </div>
  );
};

export default Onboarding;
