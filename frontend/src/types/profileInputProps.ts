import {
  Path,
  FieldError,
  UseFormRegister,
  FieldValues,
} from "react-hook-form";

export interface ProfileFormInputProps<T extends FieldValues> {
  fieldId: string;
  fieldInput: Path<T>; // Use Path<T> for type safety on field names
  fieldStateError: FieldError | undefined;
  fieldWatchValue: string;
  register: UseFormRegister<T>; 
  label: string;
  maxLength?: number;
  textArea?: boolean;
  hasInput?: boolean;
  initialValue?: string;
  extraClassName?: string;
}
