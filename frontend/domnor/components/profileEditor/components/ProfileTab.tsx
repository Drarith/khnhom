import { Camera } from "lucide-react";
import ProfileFormInput from "../../profileInput/profileInput";
import ProfilePicture from "../components/ProfilePicture";
import type { ProfileData } from "@/types/profileData/profileData";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ProfileFormEditorInputValues } from "@/types/profileForm/profileFormInput";

interface ProfileTabProps {
  register: UseFormRegister<ProfileFormEditorInputValues>;
  errors: FieldErrors<ProfileFormEditorInputValues>;
  displayName: string;
  bio: string;
  initialData?: ProfileData;
}

export default function ProfileTab({
  register,
  errors,
  displayName,
  bio,
  initialData,
}: ProfileTabProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-primary">
          Profile Information
        </h2>
      </div>

      {/* Profile Picture */}
      {initialData?.displayName && (
        <ProfilePicture
          displayName={initialData?.displayName}
          Camera={Camera}
          profilePictureUrl={initialData?.profilePictureUrl}
        />
      )}

      <div className="border-t border-primary/10 pt-6 space-y-6">
        {/* Display Name */}
        <ProfileFormInput
          register={register}
          fieldId="displayName"
          fieldInput="displayName"
          initialValue={initialData?.displayName}
          fieldStateError={errors.displayName}
          fieldWatchValue={displayName}
          label="Display Name"
          maxLength={30}
          hasInput={!!displayName}
        />

        {/* Bio */}
        <ProfileFormInput
          register={register}
          fieldId="bio"
          fieldInput="bio"
          initialValue={initialData?.bio}
          fieldStateError={errors.bio}
          fieldWatchValue={bio}
          label="Bio"
          maxLength={1000}
          textArea={true}
          hasInput={!!bio}
        />

        {/* Payment QR Code */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary/70 mb-2">
            Payment QR Code
          </label>
          <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
            {initialData?.paymentQrCodeUrl ? (
              <div className="space-y-3">
                <div className="w-32 h-32 mx-auto bg-primary/5 rounded-lg"></div>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Change QR Code
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-primary/40">
                  <Camera size={32} className="mx-auto" />
                </div>
                <p className="text-sm text-primary/60">
                  Upload payment QR code
                </p>
                <input
                  type="file"
                  className="text-sm text-primary hover:text-primary/80"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
