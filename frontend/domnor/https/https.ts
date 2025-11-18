import axios from "axios";
import { ProfileFormInputValues } from "@/types/profileForm/profileFormInput";

const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const apiClient = axios.create({
  baseURL: PUBLIC_API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
});

export const postJSON = async (url: string, data: ProfileFormInputValues) => {
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Error posting JSON:", error);
    throw error;
  }
};
