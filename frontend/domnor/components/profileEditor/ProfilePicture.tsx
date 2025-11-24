import { ProfileData } from "@/types/profileData/profileData";
import { useState } from "react";
import UploadImageModal from "./UploadImageModal";

export default function ProfilePicture({
  displayName,
  Camera,
}: {
  displayName: ProfileData["data"]["displayName"];
  Camera: React.ComponentType<{ size?: number; className?: string }>;
}) {
  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  const [showModal, setShowModal] = useState(false);

  function handleSaveImage(imageUrl: string, imageFile: File) {
    setCroppedImageUrl(imageUrl);
    console.log(imageFile);
    // TODO: Upload to server
    // const formData = new FormData();
    // formData.append('profilePicture', blob, 'profile.png');
    // await uploadProfilePicture(formData);
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
