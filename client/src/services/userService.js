import api from "../config/api";

export const userService = {
  getUsers: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Failed to fetch users",
      };
    }
  },
};
