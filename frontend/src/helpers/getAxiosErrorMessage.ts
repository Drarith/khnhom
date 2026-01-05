import { AxiosError } from "axios";

export default function getAxiosErrorMessage(
  error: AxiosError<{ message?: string }>
) {
  const errorMessage = error.response?.data?.message;
  const altMessage = error.message;
  return errorMessage ? errorMessage : altMessage;
}
