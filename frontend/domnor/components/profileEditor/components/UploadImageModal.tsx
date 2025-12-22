import ReactCrop, { type Crop, PixelCrop } from "react-image-crop";
import { makeAspectCrop, centerCrop } from "react-image-crop";
import { useState, useRef } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageUrl: string, imageFile: File) => void;
}

export default function UploadImageModal({
  isOpen,
  onClose,
  onSave,
}: UploadImageModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [imgSrc, setImgSrc] = useState("");
  const [scale, setScale] = useState(1);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  // Set Image source for cropper
  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(null);
      const file = e.target.files[0];

      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Invalid file type. Please select a valid image (JPEG, PNG, GIF, or WebP)"
        );
        e.target.value = "";
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB");
        e.target.value = "";
        return;
      }

      setImageFile(file);

      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(file);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function onImageSaveClick() {
    if (!imgRef.current) return;
    const image = imgRef.current;
    // Our final cropped area will be from this canvas
    const canvas = previewCanvasRef.current;
    // Limit max dimensions for profile pictures
    const MAX_DIMENSION = 800;

    if (!image || !canvas || !completedCrop) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // divided by scale to account for zoom level
    const cropWidth = (completedCrop.width * scaleX) / scale;
    const cropHeight = (completedCrop.height * scaleY) / scale;

    let outputWidth = cropWidth;
    let outputHeight = cropHeight;

    if (cropWidth > MAX_DIMENSION || cropHeight > MAX_DIMENSION) {
      const scale = MAX_DIMENSION / Math.max(cropWidth, cropHeight);
      outputWidth = cropWidth * scale;
      outputHeight = cropHeight * scale;
    }

    canvas.width = Math.floor(outputWidth);
    canvas.height = Math.floor(outputHeight);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    // Draw scaled image
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      outputWidth,
      outputHeight
    );

    // Convert canvas to blob and then to File for upload
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error("Failed to create blob");
          return;
        }

        // Convert blob to File object with proper name
        const croppedFile = new File(
          [blob],
          imageFile?.name.replace(/\.\w+$/, ".jpg") || "profile.jpg",
          {
            type: "image/jpeg",
            lastModified: Date.now(),
          }
        );

        const url = URL.createObjectURL(blob);
        onSave(url, croppedFile);

        // Reset state
        setImgSrc("");
        setCrop(undefined);
        setCompletedCrop(undefined);
        onClose();
      },
      "image/jpeg",
      0.85
    );
  }

  function handleClose() {
    setImgSrc("");
    setCrop(undefined);
    setCompletedCrop(undefined);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-foreground rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10">
          <h2 className="text-xl font-semibold text-primary">
            Upload Profile Picture
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-primary/5 rounded-lg transition-colors"
          >
            <X size={20} className="text-primary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <canvas ref={previewCanvasRef} className="hidden" />

          {!imgSrc ? (
            <div className="space-y-4">
              <p className="text-sm text-primary/60">
                Select an image to crop and set as your profile picture
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="block w-full text-sm text-primary
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-foreground
                  hover:file:bg-primary/90
                  file:cursor-pointer cursor-pointer"
              />
            </div>
          ) : (
            <div className="space-y-4 max-w-full">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                circularCrop
                locked={true}
              >
                <Image
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  width={500}
                  height={500}
                  style={{ transform: `scale(${scale})` }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>

              <div className="flex items-center gap-2">
                <label className="text-sm text-primary/70">Zoom:</label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-primary/70">
                  {scale.toFixed(1)}x
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-primary/10">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-primary/20 rounded-lg text-primary hover:bg-primary/5 transition-colors font-medium"
          >
            Cancel
          </button>
          {imgSrc && (
            <button
              type="button"
              onClick={onImageSaveClick}
              disabled={!completedCrop}
              className="px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
