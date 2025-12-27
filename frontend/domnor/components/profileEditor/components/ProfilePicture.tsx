import { ProfileData } from "@/types/profileData";
import { useState, useEffect } from "react";
import UploadImageModal from "./UploadImageModal";
import { getJSON, patchJSON, uploadToCloudinary } from "@/https/https";
import { toast } from "react-toastify";
import { SignatureResponse } from "@/types/PDResponse";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import getAxiosErrorMessage from "@/helpers/getAxiosErrorMessage";
import { useTranslations } from "next-intl";
import "../../themeCard/themeCard.css";

export default function ProfilePicture({
  displayName,
  Camera,
  profilePictureUrl,
}: {
  displayName: ProfileData["displayName"];
  Camera: React.ComponentType<{ size?: number; className?: string }>;
  profilePictureUrl: ProfileData["profilePictureUrl"];
}) {
  const t = useTranslations("profileEditor.profileTab");
  const CLOUDINARY_UPLOAD_ENDPOINT =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_ENDPOINT || "";
  const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "";

  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  const [showModal, setShowModal] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    setCroppedImageUrl(profilePictureUrl);
  }, [profilePictureUrl]);

  const { mutate: uploadProfilePicture, isPending: isUploading } = useMutation({
    mutationFn: async ({ imageFile }: { imageFile: File }) => {
      // Get signature from backend
      const signatureResponse = await getJSON<SignatureResponse>(
        "/sign-upload"
      );
      if (!signatureResponse) {
        throw new Error("Failed to get upload signature");
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

      if (!response || !response.secure_url) {
        throw new Error("Invalid response from Cloudinary");
      }

      // Update profile picture URL in backend
      await patchJSON("/profile/picture", {
        profilePictureUrl: response.secure_url,
      });

      return response.secure_url;
    },
    onSuccess: (secureUrl) => {
      setCroppedImageUrl(secureUrl);
      toast.success(t("uploadSuccess"));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      toast.error(t("uploadError", { error: errorMessage }));
      console.error(error);
      setCroppedImageUrl(profilePictureUrl);
    },
  });

  function handleSaveImage(imageUrl: string, imageFile: File) {
    setCroppedImageUrl(imageUrl);
    uploadProfilePicture({ imageFile });
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
              <Image
                src={croppedImageUrl}
                loading="eager"
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              displayName?.[0]?.toUpperCase() || "U"
            )}
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"/>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            disabled={isUploading}
            className="absolute bottom-0 right-0 p-2 bg-foreground rounded-full shadow-lg border-2 border-primary/10 hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera size={16} className="text-primary" />
          </button>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-primary mb-2">{t("profilePic")}</h3>
          <p className="text-sm text-primary/60 mb-3">{t("profilePicP")}</p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            disabled={isUploading}
            className="px-4 py-2 border border-primary/20 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading && (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
            {isUploading ? t("uploading") : t("buttons.uploadPhoto")}
          </button>
        </div>
      </div>
    </div>
  );
}
