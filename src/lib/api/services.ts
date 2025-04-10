import api from "./axios";
import type { ImageData } from "./banners";

export interface ServiceData {
  _id?: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  image: ImageData[];
}

export const getServices = async (): Promise<ServiceData[]> => {
  try {
    const response = await api.get("/services");
    console.log("Get services response:", response.data);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error("Get services error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch services"
    );
  }
};

export const getService = async (id: string): Promise<ServiceData> => {
  try {
    const response = await api.get(`/services/${id}`);
    console.log("Get service response:", response.data);

    // Ensure image is always an array
    if (response.data && !Array.isArray(response.data.image)) {
      response.data.image = response.data.image ? [response.data.image] : [];
    }

    return response.data;
  } catch (error: any) {
    console.error("Get service error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch service");
  }
};

export const createService = async (
  data: ServiceData
): Promise<ServiceData> => {
  try {
    console.log("Creating service with data:", data);
    const response = await api.post("/services", data);
    console.log("Create service response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Create service error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create service"
    );
  }
};

export const updateService = async (
  id: string,
  data: ServiceData
): Promise<ServiceData> => {
  try {
    console.log("Updating service with data:", data);
    const response = await api.patch(`/services/${id}`, data);
    console.log("Update service response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Update service error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update service"
    );
  }
};

export const deleteService = async (id: string): Promise<void> => {
  try {
    await api.delete(`/services/${id}`);
  } catch (error: any) {
    console.error(
      "Delete service error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete service"
    );
  }
};
