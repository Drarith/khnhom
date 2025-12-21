import axios, { AxiosError } from "axios";

const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const apiClient = axios.create({
  baseURL: PUBLIC_API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// run on every response
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post("/refresh-token");
        processQueue(null, "token");
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Redirect to login
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

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

export const logout = async () => {
  try {
    await apiClient.post("/logout");
  } catch (err) {
    const axiosError = err as AxiosError;
    console.error(`[API Error] POST /logout`, {
      status: axiosError.response?.status,
      message: axiosError.message,
      errorData: axiosError.response?.data,
    });
    throw err;
  }
};
