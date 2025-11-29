import { ProfileData } from "@/types/profileData/profileData";
import { useState } from "react";
import UploadImageModal from "./UploadImageModal";
import { getJSON, patchJSON, uploadToCloudinary } from "@/https/https";
import { toast } from "react-toastify";
import { SignatureResponse } from "@/types/profileForm/PDResponse";

export default function ProfilePicture({
  displayName,
  Camera,
}: {
  displayName: ProfileData["displayName"];
  Camera: React.ComponentType<{ size?: number; className?: string }>;
}) {
  const CLOUDINARY_UPLOAD_ENDPOINT =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_ENDPOINT || "";
  const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "";

  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  const [showModal, setShowModal] = useState(false);

  async function handleSaveImage(imageUrl: string, imageFile: File) {
    setCroppedImageUrl(imageUrl);
    try {
      // Get signature from backend
      const signatureResponse = await getJSON<SignatureResponse>(
        "/sign-upload"
      );
      if (!signatureResponse) {
        toast.error("Failed to get upload signature");
        setCroppedImageUrl("");
        return;
      }

      const { signature, timestamp, publicId } = signatureResponse;

      // Prepare form data for Cloudinary
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("api_key", CLOUDINARY_API_KEY);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("public_id", publicId);
      formData.append("folder", "profile_pictures");

      // Upload to Cloudinary
      const response = await uploadToCloudinary(
        CLOUDINARY_UPLOAD_ENDPOINT,
        formData
      );
      // Set image then post to backend to update
      // if (response && response.secure_url) {
      //   setImageUrl(response.secure_url);
      //   toast.success("Profile picture uploaded successfully");
      // } else {
      //   throw new Error("Invalid response from Cloudinary");
      // }
      if (response && response.secure_url) {
        try {
          await patchJSON("profile/picture", {
            profilePictureUrl: response.secure_url,
          });
          toast.success("Profile picture uploaded successfully");
        } catch (err) {
          throw err;
        }
      } else {
        throw new Error("Invalid response from Cloudinary");
      }
    } catch (err) {
      toast.error(
        `Unable to upload your image: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      console.error(err);
      setCroppedImageUrl("");
    }
  }

  return (
    <div className="text-primary">
      <UploadImageModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveImage}
      />

      <div className="flex items-start gap-6">
        <div className="relative">
          <div className=" w-24 h-24 rounded-full overflow-hidden bg-linear-to-br from-purple-400 to-pink-600 flex items-center justify-center text-foreground text-3xl font-bold">
            {croppedImageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={croppedImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              displayName?.[0]?.toUpperCase() || "U"
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="absolute bottom-0 right-0 p-2 bg-foreground rounded-full shadow-lg border-2 border-primary/10 hover:bg-primary/5 transition-colors"
          >
            <Camera size={16} className="text-primary" />
          </button>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-primary mb-2">Profile Picture</h3>
          <p className="text-sm text-primary/60 mb-3">
            Upload a profile picture that represents you
          </p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 border border-primary/20 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            Upload Photo
          </button>
        </div>
      </div>
    </div>
  );
}
