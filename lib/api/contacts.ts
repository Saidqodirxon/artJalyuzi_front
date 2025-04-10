import api from "./axios";

export interface ContactData {
  _id?: string;
  name: string;
  phone: string;
  createdAt?: string;
}

export const getContacts = async (): Promise<ContactData[]> => {
  try {
    const response = await api.get("/contacts");
    console.log("Get contacts response:", response.data);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error("Get contacts error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch contacts"
    );
  }
};

export const createContact = async (
  data: ContactData
): Promise<ContactData> => {
  try {
    console.log("Creating contact with data:", data);
    const response = await api.post("/contacts", data);
    console.log("Create contact response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Create contact error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create contact"
    );
  }
};
