import api from "./axios";
import type { ImageData } from "./banners";

export interface PortfolioData {
  _id?: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  image: ImageData[];
}

export const getPortfolios = async (): Promise<PortfolioData[]> => {
  try {
    const response = await api.get("/portfolios");
    console.log("Get portfolios response:", response.data);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error(
      "Get portfolios error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch portfolios"
    );
  }
};

export const getPortfolio = async (id: string): Promise<PortfolioData> => {
  try {
    const response = await api.get(`/portfolios/${id}`);
    console.log("Get portfolio response:", response.data);

    // Ensure image is always an array
    if (response.data && !Array.isArray(response.data.image)) {
      response.data.image = response.data.image ? [response.data.image] : [];
    }

    return response.data;
  } catch (error: any) {
    console.error(
      "Get portfolio error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch portfolio"
    );
  }
};

export const createPortfolio = async (
  data: PortfolioData
): Promise<PortfolioData> => {
  try {
    console.log("Creating portfolio with data:", data);
    const response = await api.post("/portfolios", data);
    console.log("Create portfolio response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Create portfolio error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create portfolio"
    );
  }
};

export const updatePortfolio = async (
  id: string,
  data: PortfolioData
): Promise<PortfolioData> => {
  try {
    console.log("Updating portfolio with data:", data);
    const response = await api.patch(`/portfolios/${id}`, data);
    console.log("Update portfolio response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Update portfolio error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update portfolio"
    );
  }
};

export const deletePortfolio = async (id: string): Promise<void> => {
  try {
    await api.delete(`/portfolios/${id}`);
  } catch (error: any) {
    console.error(
      "Delete portfolio error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete portfolio"
    );
  }
};
