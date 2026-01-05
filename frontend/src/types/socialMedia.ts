import { UseFormSetValue , FieldValues} from "react-hook-form";

export interface SocialMediaFormProps<T extends FieldValues> {
  socials: Record<string, string>;
  setValue: UseFormSetValue<T>;
}

