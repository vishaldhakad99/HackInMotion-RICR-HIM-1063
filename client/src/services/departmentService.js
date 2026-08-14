import api from "../config/api";

export const departmentService = {
  getDepartments: async () => {
    const response = await api.get("/departments");
    return response.data;
  },

  getDepartmentById: async (id) => {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },

  getDepartmentIssues: async (id, params = {}) => {
    const response = await api.get(`/departments/${id}/issues`, { params });
    return response.data;
  },
};
