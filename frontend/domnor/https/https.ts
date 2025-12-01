import axios, { AxiosError } from "axios";

const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const apiClient = axios.create({
  baseURL: PUBLIC_API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
});

export async function postJSON<TRequest = unknown, TResponse = unknown>(
  url: string,
  data?: TRequest
): Promise<TResponse> {
  try {
    const response = await apiClient.post<TResponse>(url, data);
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error(`[API Error] POST ${url}`, {
      status: axiosError.response?.status,
      message: axiosError.message,
      errorData: axiosError.response?.data,
    });

    throw err;
  }
}

export async function putJSON<TRequest = unknown, TResponse = unknown>(
  url: string,
  data?: TRequest
): Promise<TResponse> {
  try {
    const response = await apiClient.put<TResponse>(url, data);
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error(`[API Error] PUT ${url}`, {
      status: axiosError.response?.status,
      message: axiosError.message,
      errorData: axiosError.response?.data,
    });
    throw err;
  }
}

export async function getJSON<TResponse = unknown>(
  url: string
): Promise<TResponse> {
  try {
    const response = await apiClient.get<TResponse>(url);
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error(`[API Error] GET ${url}`, {
      status: axiosError.response?.status,
      message: axiosError.message,
      errorData: axiosError.response?.data,
    });
    throw err;
  }
}

export async function patchJSON<TRequest = unknown, TResponse = unknown>(
  url: string,
  data?: TRequest
): Promise<TResponse> {
  try {
    const response = await apiClient.patch<TResponse>(url, data);
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error(`[API Error] PATCH ${url}`, {
      status: axiosError.response?.status,
      message: axiosError.message,
      errorData: axiosError.response?.data,
    });
    throw err;
  }
}

export async function deleteLink(url: string) {
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error(`[API Error] PATCH ${url}`, {
      status: axiosError.response?.status,
      message: axiosError.message,
      errorData: axiosError.response?.data,
    });
    throw err;
  }
}

export const uploadToCloudinary = async (url: string, formData: FormData) => {
  try {
    const response = await axios.post(url, formData, {
      timeout: 30000,
      headers: {},
    });
    return response.data;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};
