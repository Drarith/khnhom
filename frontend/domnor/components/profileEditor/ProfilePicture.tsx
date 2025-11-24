import { ProfileData } from "@/types/profileData/profileData";
import ReactCrop, { type Crop, PixelCrop } from "react-image-crop";
import { makeAspectCrop, centerCrop } from "react-image-crop";
import { useState, useRef } from "react";
import "react-image-crop/dist/ReactCrop.css";

export default function ProfilePicture({
  displayName,
  Camera,
}: {
  displayName: ProfileData["data"]["displayName"];
  Camera: React.ComponentType<{ size?: number; className?: string }>;
}) {
  const [crop, setCrop] = useState<Crop>();
  const [imgSrc, setImgSrc] = useState("");
  const [scale, setScale] = useState(1);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState("");

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const aspect: number = 1;

  function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
  ) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function onImageSaveClick() {
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;

    if (!image || !canvas || !completedCrop) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    ctx.save();

    ctx.translate(-cropX, -cropY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    ctx.restore();

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Failed to create blob");
        return;
      }

      // Create URL for preview
      const url = URL.createObjectURL(blob);
      setCroppedImageUrl(url);

      // upload the blob to server
      // const formData = new FormData();
      // formData.append('profilePicture', blob, 'profile.png');
      // await uploadProfilePicture(formData);

 
      setImgSrc("");
    }, "image/png");
  }

  return (
    <div className="text-primary">
      {/* Hidden canvas for processing */}
      <canvas ref={previewCanvasRef} style={{ display: "none" }} />

      <div className="flex items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-linear-to-br from-purple-400 to-pink-600 flex items-center justify-center text-foreground text-3xl font-bold">
            {croppedImageUrl ? (
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
          <input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="px-4 py-2 border border-primary/20 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
          />
          {!!imgSrc && (
            <div className="mt-4">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                // circularCrop
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  style={{ transform: `scale(${scale})`, maxHeight: "400px" }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
              <button type="button" onClick={onImageSaveClick}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
