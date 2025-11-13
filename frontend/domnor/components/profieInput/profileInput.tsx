import type { ProfileFormInputProps } from "@/types/profileForm/profileInputProps";
import { FieldValues } from "react-hook-form";

export default function ProfileFormInput<T extends FieldValues>({
  register,
  fieldId,
  fieldInput,
  fieldStateError,
  fieldWatchValue,
  label,
  maxLength,
}: ProfileFormInputProps<T>) {
  return (
    <div>
      <label htmlFor={fieldId}>{label}</label>
      <input id={fieldId} {...register(fieldInput)} />
      <div style={{ fontSize: 12, color: fieldStateError ? "red" : "#666" }}>
        {fieldStateError ? (
          <span role="alert">{fieldStateError.message}</span>
        ) : (
          maxLength && <span>{fieldWatchValue.length}/{maxLength}</span>
        )}
      </div>
    </div>
  );
}