import axios from "axios";
import {
  ProfileFormInputValues,
  ProfileFormEditorInputValues,
} from "@/types/profileForm/profileFormInput";

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
  } catch (err) {
    console.error("Error posting JSON:", err);
    if (axios.isAxiosError(err)) {
      throw err;
    }
    throw err;
  }
};

export const putJSON = async (
  url: string,
  data: ProfileFormEditorInputValues
) => {
  try {
    const response = await apiClient.put(url, data);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getJSON = async (url: string) => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (err) {
    console.error("Axios get request error" + err);
    throw err;
  }
};
