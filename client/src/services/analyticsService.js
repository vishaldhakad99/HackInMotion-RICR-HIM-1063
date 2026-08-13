import api from "../config/api";

export const analyticsService = {
  getOverview: async () => {
    const response = await api.get("/analytics/overview");
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/analytics/categories");
    return response.data;
  },

  getStatus: async () => {
    const response = await api.get("/analytics/status");
    return response.data;
  },

  getDepartments: async () => {
    const response = await api.get("/analytics/departments");
    return response.data;
  },

  getHotspots: async () => {
    const response = await api.get("/analytics/hotspots");
    return response.data;
  },

  getResolutionTime: async () => {
    const response = await api.get("/analytics/resolution-time");
    return response.data;
  },
};
