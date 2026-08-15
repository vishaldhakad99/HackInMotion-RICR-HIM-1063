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
        params: { category, limit: 20 },
      });
      const issues = response.data?.data?.issues || [];

      // Filter for active/unresolved issues first
      const activeIssues = issues.filter((iss) =>
        ["Reported", "In Progress", "Reopened"].includes(iss.status)
      );

      if (activeIssues.length === 0) {
        return { hasDuplicate: false };
      }

      // If location coordinates are available, check proximity (~500m / 0.005 degrees)
      if (location && location.latitude != null && location.longitude != null) {
        const nearby = activeIssues.find((iss) => {
          if (iss.location?.latitude != null && iss.location?.longitude != null) {
            const latDiff = Math.abs(iss.location.latitude - location.latitude);
            const lngDiff = Math.abs(iss.location.longitude - location.longitude);
            // ~0.005 degrees is approx 500 meters
            return latDiff <= 0.005 && lngDiff <= 0.005;
          }
          return false;
        });

        if (nearby) {
          return { hasDuplicate: true, duplicate: nearby };
        }
        return { hasDuplicate: false };
      }

      // Fallback if no coordinates: treat first active issue in category as potential candidate
      return {
        hasDuplicate: true,
        duplicate: activeIssues[0],
      };
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
