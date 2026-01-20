import axios from "axios";

const API_BASE = "http://localhost:5000/api";

/* =========================
   Auth Header Helper
   ========================= */
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No auth token found");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* =========================
   Dashboard Service
   ========================= */
const dashboardService = {
  /* -------- ROADMAP -------- */

  // GET roadmap by topic
  async getRoadmap(topic) {
    const config = getAuthConfig();
    const res = await axios.get(
      `${API_BASE}/roadmap?topic=${encodeURIComponent(topic)}`,
      config
    );
    return res.data;
  },

  // REGENERATE roadmap
  async regenerateRoadmap(roadmapId) {
    const config = getAuthConfig();
    const res = await axios.post(
      `${API_BASE}/roadmap/${roadmapId}/regenerate`,
      {},
      config
    );
    return res.data;
  },

  // TOGGLE roadmap step completion
  async toggleRoadmapStep(roadmapId, stepIndex, completed) {
    const config = getAuthConfig();
    const res = await axios.put(
      `${API_BASE}/roadmap/${roadmapId}/step/${stepIndex}`,
      { completed },
      config
    );
    return res.data;
  },

  /* -------- CHAT -------- */

  async getChatMessages(topic) {
    const config = getAuthConfig();
    const res = await axios.get(
      `${API_BASE}/chat/messages?topic=${encodeURIComponent(topic)}`,
      config
    );
    return res.data;
  },

  // POST ask chat (AI Tutor)
  async askChat(topic, question) {
    const config = getAuthConfig();
    const res = await axios.post(
      `${API_BASE}/chat/ask`,
      { topic, question },
      config
    );
    return res.data;
  },
};

export default dashboardService;
