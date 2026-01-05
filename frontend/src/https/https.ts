import axios from "axios";
import { AxiosError } from "axios";

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
  // first function handles successful responses
  (response) => response,
  // second function handles errors
  async (error) => {
    // save original request for each request
    const originalRequest = error.config;

    // Handle rate limit
    if (error.response?.status === 429) {
      alert("You are sending too many requests. Please wait and try again.");

      return Promise.reject(error);
    }

    // if (
    //   error.response?.status === 403 &&
    //   error.response?.data?.code === "TOKEN_INVALID"
    // ) {
    //   await axios.post(
    //     PUBLIC_API_BASE_URL + "/logout",
    //     {},
    //     { withCredentials: true }
    //   );
    //   window.location.href = "/";
    //   return Promise.reject(error);
    // }

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      // avoid multiple refresh attempts
      if (isRefreshing) {
     
        return (
          new Promise((resolve, reject) => {
            // queue the requests that arrive while refreshing
            // remember that this promise only resolves once processQueue is called
            // that's when we return the apiClient(originalRequest) below
            failedQueue.push({ resolve, reject });
          })
            // this only runs once the promise is resolved in processQueue
            .then(() => {
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            })
        );
      }
  

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post("/auth/refresh-token");

        // retry all the requests in the queue
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

// export async function postJSON<TRequest = unknown, TResponse = unknown>(
//   url: string,
//   data?: TRequest
// ): Promise<TResponse> {
//   const full = PUBLIC_API_BASE_URL + url;
//   const res = await fetch(full, {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: data !== undefined ? JSON.stringify(data) : undefined,
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Fetch POST ${res.status}: ${text}`);
//   }
//   return res.json() as Promise<TResponse>;
// }

// export async function putJSON<TRequest = unknown, TResponse = unknown>(
//   url: string,
//   data?: TRequest
// ): Promise<TResponse> {
//   const full = PUBLIC_API_BASE_URL + url;
//   const res = await fetch(full, {
//     method: "PUT",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: data !== undefined ? JSON.stringify(data) : undefined,
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Fetch PUT ${res.status}: ${text}`);
//   }
//   return res.json() as Promise<TResponse>;
// }

// export async function getJSON<TResponse = unknown>(
//   url: string
// ): Promise<TResponse> {
//   const full = PUBLIC_API_BASE_URL + url;
//   const res = await fetch(full, {
//     method: "GET",
//     credentials: "include",
//     next: { revalidate: 60 },
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Fetch ${res.status}: ${text}`);
//   }
//   return res.json() as Promise<TResponse>;
// }

// export async function patchJSON<TRequest = unknown, TResponse = unknown>(
//   url: string,
//   data?: TRequest
// ): Promise<TResponse> {
//   const full = PUBLIC_API_BASE_URL + url;
//   const res = await fetch(full, {
//     method: "PATCH",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: data !== undefined ? JSON.stringify(data) : undefined,
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Fetch PATCH ${res.status}: ${text}`);
//   }
//   return res.json() as Promise<TResponse>;
// }

// export async function deleteLink(url: string) {
//   const full = PUBLIC_API_BASE_URL + url;
//   const res = await fetch(full, {
//     method: "DELETE",
//     credentials: "include",
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Fetch DELETE ${res.status}: ${text}`);
//   }
//   return res.json();
// }

// export const uploadToCloudinary = async (url: string, formData: FormData) => {
//   try {
//     const response = await axios.post(url, formData, {
//       timeout: 30000,
//       headers: {},
//     });
//     return response.data;
//   } catch (err) {
//     console.error("Cloudinary upload error:", err);
//     throw err;
//   }
// };

// export const logout = async () => {
//   const full = PUBLIC_API_BASE_URL + "/logout";
//   const res = await fetch(full, { method: "POST", credentials: "include" });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`Logout failed ${res.status}: ${text}`);
//   }
// };
