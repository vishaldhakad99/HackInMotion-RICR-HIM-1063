import api from "../config/api";

export const issueService = {
  createIssue: async (issueData) => {
    const response = await api.post("/issues", issueData);
    return response.data;
  },

  getIssues: async (params = {}) => {
    const response = await api.get("/issues", { params });
    return response.data;
  },

  getMyIssues: async (params = {}) => {
    const response = await api.get("/issues/my", { params });
    return response.data;
  },

  getIssueById: async (id) => {
    const response = await api.get(`/issues/${id}`);
    return response.data;
  },

  updateIssue: async (id, updateData) => {
    const response = await api.put(`/issues/${id}`, updateData);
    return response.data;
  },

  upvoteIssue: async (id) => {
    const response = await api.post(`/issues/${id}/upvote`);
    return response.data;
  },

  verifyIssue: async (id, payload) => {
    const response = await api.post(`/issues/${id}/verify`, payload);
    return response.data;
  },

  reopenIssue: async (id, reason) => {
    const response = await api.post(`/issues/${id}/reopen`, { reason });
    return response.data;
  },

  verifyPhotoIssue: async (id, payload) => {
    const response = await api.post(`/issues/${id}/verify-photo`, payload);
    return response.data;
  },

  checkDuplicate: async (category, location) => {
    try {
      const response = await api.get("/issues", {
        params: { category, limit: 5 },
      });
      const issues = response.data?.data?.issues || [];
      // If any issue matches category, consider it a potential duplicate candidate
      if (issues.length > 0) {
        return {
          hasDuplicate: true,
          duplicate: issues[0],
        };
      }
      return { hasDuplicate: false };
    } catch {
      return { hasDuplicate: false };
    }
  },

  // Admin issue management methods
  getAdminDashboard: async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  getAdminIssues: async (params = {}) => {
    const response = await api.get("/admin/issues", { params });
    return response.data;
  },

  getAdminIssueById: async (id) => {
    const response = await api.get(`/admin/issues/${id}`);
    return response.data;
  },

  updateStatus: async (id, payload) => {
    const response = await api.put(`/admin/issues/${id}/status`, payload);
    return response.data;
  },

  submitResolution: async (id, payload) => {
    const response = await api.post(`/admin/issues/${id}/resolution`, payload);
    return response.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
