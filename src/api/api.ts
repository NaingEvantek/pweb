import axios, { isAxiosError } from "axios";

const api = axios.create({
  baseURL:import.meta.env.VITE_API_BASE_URL,
  timeout:10000,
  headers:{
    'Content-Type':'application/json'
  }
})

export function getApiErrorMessage(
  error: unknown,
  defaultMessage = "An error occurred"
): string {
  if (isAxiosError(error)) {
    const apiError = error.response?.data;

    if (error.response?.status === 401) {
      return typeof apiError === "string"
        ? apiError
        : "Unauthorized. Please log in again.";
    }

    if (typeof apiError === "string") {
      return apiError;
    }

    if (apiError?.ResultDescription) {
      return apiError.ResultDescription;
    }

    if (apiError?.message) {
      return apiError.message;
    }

    return defaultMessage;
  }

  return "Unexpected error occurred.";
}
export default api;