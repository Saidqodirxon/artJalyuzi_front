import api from "./axios";

export interface LoginData {
  login: string;
  password: string;
}

export interface LoginResponse {
  data: {
    token: string;
  };
}

export interface AdminData {
  _id: string;
  login: string;
}

export const login = async (data: LoginData): Promise<{ token: string }> => {
  try {
    const response = await api.post("/login", data);
    console.log("Login response:", response.data);

    if (response.data && response.data.token) {
      return { token: response.data.token };
    }
    throw new Error("Invalid response format from server");
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const getMe = async (): Promise<AdminData> => {
  try {
    const response = await api.get("/admin/me");
    console.log("GetMe response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("GetMe error:", error.response?.data || error.message);
    throw error;
  }
};

// PATCH so'rovini qo'shish: admin ma'lumotlarini yangilash
export const updateMe = async (
  data: Partial<LoginData>
): Promise<AdminData> => {
  try {
    const response = await api.patch("/admin/me", data);
    console.log("UpdateMe response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("UpdateMe error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to update user data"
    );
  }
};
