import { Path, FieldError, UseFormRegister, FieldValues } from "react-hook-form";

export interface ProfileFormInputProps<T extends FieldValues> {
  fieldId: string;
  fieldInput: Path<T>; // Use Path<T> for type safety on field names
  fieldStateError: FieldError | undefined;
  fieldWatchValue: string;
  register: UseFormRegister<T>; // Correctly type the register function
  label: string;
  maxLength?: number;
}
