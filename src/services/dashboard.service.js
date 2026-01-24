import api from "./api.client";

/* =========================
   Dashboard Service
   ========================= */
const dashboardService = {
  /* -------- ROADMAP -------- */

  // GET roadmap by topic
  async getRoadmap(topic) {
    const res = await api.get(
      `/roadmap?topic=${encodeURIComponent(topic)}`
    );
    return res.data;
  },

  // REGENERATE roadmap
  async regenerateRoadmap(roadmapId) {
    const res = await api.post(
      `/roadmap/${roadmapId}/regenerate`
    );
    return res.data;
  },

  // TOGGLE roadmap step completion
  async toggleRoadmapStep(roadmapId, stepIndex, completed) {
    const res = await api.put(
      `/roadmap/${roadmapId}/step/${stepIndex}`,
      { completed }
    );
    return res.data;
  },

  /* -------- CHAT -------- */

  async getChatMessages(topic) {
    const res = await api.get(
      `/chat/messages?topic=${encodeURIComponent(topic)}`
    );
    return res.data;
  },

  // POST ask chat (AI Tutor)
  async askChat(topic, question) {
    const res = await api.post(
      "/chat/ask",
      { topic, question }
    );
    return res.data;
  },
};

export default dashboardService;
