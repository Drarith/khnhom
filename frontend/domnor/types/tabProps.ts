import { UseFormSetValue , UseFormRegister, FieldErrors, UseFormHandleSubmit} from "react-hook-form";
import { linkFormEditorInputValues, ProfileFormEditorInputValues } from "./profileFormInput";
import { ProfileData } from "./profileData";

export interface SocialsTabProps {
  socials: Record<string, string>;
  setValue: UseFormSetValue<ProfileFormEditorInputValues>;
}

export interface ProfileTabProps {
  register: UseFormRegister<ProfileFormEditorInputValues>;
  errors: FieldErrors<ProfileFormEditorInputValues>;
  displayName: string;
  bio: string;
  initialData?: ProfileData;
}

export interface LinksTabProps {
  register: UseFormRegister<linkFormEditorInputValues>;
  errors: FieldErrors<linkFormEditorInputValues>;
  handleSubmit: UseFormHandleSubmit<linkFormEditorInputValues>;
  onAddLink: (values: linkFormEditorInputValues) => void;
  onDelete: (id: string) => void;
  linkTitle: string;
  linkUrl: string;
  isValid: boolean;
  isAdding: boolean;
  initialData?: ProfileData;
}