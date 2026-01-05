export default function QRImageUpload({
  initialData,
  Camera,
}: {
  initialData?: { paymentQrCodeUrl?: string };
  Camera: React.ComponentType<{ size: number; className?: string }>;
}) {
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
          <p className="text-sm text-primary/60">Upload payment QR code</p>
          <input
            type="file"
            className="text-sm text-primary hover:text-primary/80"
          ></input>
        </div>
      )}
    </div>
  </div>;
}
