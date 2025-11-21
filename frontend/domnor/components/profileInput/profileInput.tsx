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
  initialValue = "",
  textArea = false,
  hasInput = false,
}: ProfileFormInputProps<T>) {
  const labelFloatClass = hasInput
    ? "text-secondary text-sm -translate-y-4"
    : "text-md tracking-wide";

  return (
    <div className="">
      <label htmlFor={fieldId} className="relative text-primary/70">
        {textArea ? (
          <textarea
            defaultValue={initialValue}
            className={`px-8 py-2 border-primary/70 border-2 rounded-sm text-primary outline-none duration-200 peer focus:border-primary w-full`}
            id={fieldId}
            {...register(fieldInput)}
            rows={4}
            maxLength={maxLength}
            autoFocus
          />
        ) : (
          <input
            defaultValue={initialValue}
            className={`px-4 py-2 border-primary/70 border-2 rounded-sm text-primary outline-none duration-200 peer focus:border-primary w-full`}
            id={fieldId}
            {...register(fieldInput)}
            maxLength={maxLength}
            autoFocus
          />
        )}
        <span
          className={`absolute left-3 mt-2 px-1 pointer-events-none duration-200 bg-foreground
            ${labelFloatClass}
            peer-focus:text-secondary peer-focus:text-sm peer-focus:-translate-y-4`}
        >
          {label}
        </span>
      </label>

      <div style={{ fontSize: 12, color: fieldStateError ? "red" : "#666" }}>
        {fieldStateError ? (
          <span role="alert">{fieldStateError.message}</span>
        ) : (
          maxLength && (
            <span>
              {fieldWatchValue.length}/{maxLength}
            </span>
          )
        )}
      </div>
    </div>
  );
}
