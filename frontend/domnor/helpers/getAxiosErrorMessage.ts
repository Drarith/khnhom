import { AxiosError } from "axios";

export default function getAxiosErrorMessage(
  error: AxiosError<{ message?: string }>
) {
  return error.response?.data?.message;
}
