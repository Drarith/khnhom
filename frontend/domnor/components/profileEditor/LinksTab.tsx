import { Link as LinkIcon, X } from "lucide-react";
import ProfileFormInput from "../profileInput/profileInput";
import Button from "../ui/Button";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import type { linkFormEditorInputValues } from "@/types/profileForm/profileFormInput";
import type { ProfileData } from "@/types/profileData/profileData";

interface LinksTabProps {
  register: UseFormRegister<linkFormEditorInputValues>;
  errors: FieldErrors<linkFormEditorInputValues>;
  handleSubmit: UseFormHandleSubmit<linkFormEditorInputValues>;
  onAddLink: (values: linkFormEditorInputValues) => void;
  linkTitle: string;
  linkUrl: string;
  isValid: boolean;
  isAdding: boolean;
  initialData?: ProfileData;
}

export default function LinksTab({
  register,
  errors,
  handleSubmit,
  onAddLink,
  linkTitle,
  linkUrl,
  isValid,
  isAdding,
  initialData,
}: LinksTabProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Custom Links
          </h2>
          <p className="text-sm text-primary/60">
            Add custom links to your profile
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <ProfileFormInput
          register={register}
          fieldId="linkTitle"
          fieldInput="link.title"
          fieldStateError={errors.link?.title}
          fieldWatchValue={linkTitle}
          label="Link Title"
          maxLength={50}
          hasInput={!!linkTitle}
        />
        <ProfileFormInput
          register={register}
          fieldId="linkUrl"
          fieldInput="link.url"
          fieldStateError={errors.link?.url}
          fieldWatchValue={linkUrl}
          label="Link URL"
          maxLength={200}
          hasInput={!!linkUrl}
        />
        <Button
          onClick={handleSubmit(onAddLink)}
          disabled={!isValid || isAdding}
          type="button"
        >
          {isAdding ? "Adding Link..." : "Add Link"}
        </Button>
      </div>

      {initialData?.links.length === 0 ? (
        <div className="border-2 border-dashed border-primary/20 rounded-lg p-12 text-center">
          <LinkIcon size={48} className="mx-auto text-primary/40 mb-4" />
          <h3 className="text-lg font-medium text-primary mb-2">
            No links yet
          </h3>
          <p className="text-sm text-primary/60 mb-4">
            Start adding custom links to share with your audience
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {initialData?.links.map((link, index) => (
            <div
              key={index}
              className="p-4 border text-primary border-primary/10 rounded-lg flex items-center justify-between"
            >
              <h4 className="font-medium">{link.title}</h4>
              <X size={16} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
