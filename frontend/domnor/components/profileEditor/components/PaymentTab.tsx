import { useState } from "react";
import { QrCode, ChevronDown, ChevronUp } from "lucide-react";
import Button from "../../ui/Button";
import ProfileFormInput from "../../profileInput/profileInput";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import type { khqrFormEditorInputValues } from "@/types/profileForm/profileFormInput";
import type { ProfileData } from "@/types/profileData/profileData";

interface PaymentTabProps {
  register: UseFormRegister<khqrFormEditorInputValues>;
  errors: FieldErrors<khqrFormEditorInputValues>;
  handleSubmit: UseFormHandleSubmit<khqrFormEditorInputValues>;
  onGenerateQR: (values: khqrFormEditorInputValues) => void;
  accountType: "individual" | "merchant";
  bakongAccountID: string;
  merchantName: string;
  merchantID: string;
  acquiringBank: string;
  accountInformation: string;
  currency: string;
  amount: string;
  merchantCity: string;
  billNumber: string;
  mobileNumber: string;
  storeLabel: string;
  terminalLabel: string;
  purposeOfTransaction: string;
  isValid: boolean;
  isGenerating: boolean;
  generatedQR: string;
  error: string;
  initialData?: ProfileData;
}

export default function PaymentTab({
  register,
  errors,
  handleSubmit,
  onGenerateQR,
  accountType,
  bakongAccountID,
  merchantName,
  merchantID,
  acquiringBank,
  accountInformation,
  currency,
  amount,
  merchantCity,
  billNumber,
  mobileNumber,
  storeLabel,
  terminalLabel,
  purposeOfTransaction,
  isValid,
  isGenerating,
  generatedQR,
  error,
  initialData,
}: PaymentTabProps) {
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const downloadQR = () => {
    if (!generatedQR) return;

    const link = document.createElement("a");
    link.href = generatedQR;
    link.download = `khqr-${accountType}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Bakong KHQR Payment
          </h2>
          <p className="text-sm text-primary/60">
            Generate a Bakong KHQR code for receiving payments
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Account Type Selection */}
        <div>
          <label
            htmlFor="accountType"
            className="block text-sm font-medium text-primary mb-2"
          >
            Account Type *
          </label>
          <select
            id="accountType"
            {...register("accountType")}
            className="w-full px-4 py-2 border-2 border-primary/70 rounded-sm text-primary bg-foreground focus:border-primary outline-none"
          >
            <option value="individual">Individual</option>
            <option value="merchant">Merchant</option>
          </select>
        </div>

        {/* Common Mandatory Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileFormInput
            register={register}
            fieldId="bakongAccountID"
            fieldInput="bakongAccountID"
            fieldStateError={errors.bakongAccountID}
            fieldWatchValue={bakongAccountID}
            label="Bakong Account ID *"
            maxLength={32}
            hasInput={!!bakongAccountID}
          />

          <ProfileFormInput
            register={register}
            fieldId="merchantName"
            fieldInput="merchantName"
            fieldStateError={errors.merchantName}
            fieldWatchValue={merchantName}
            label="Merchant Name *"
            maxLength={25}
            hasInput={!!merchantName}
          />
        </div>

        {/* Conditional Mandatory Fields for Merchant */}
        {accountType === "merchant" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileFormInput
              register={register}
              fieldId="merchantID"
              fieldInput="merchantID"
              fieldStateError={errors.merchantID}
              fieldWatchValue={merchantID}
              label="Merchant ID *"
              maxLength={32}
              hasInput={!!merchantID}
            />

            <ProfileFormInput
              register={register}
              fieldId="acquiringBank"
              fieldInput="acquiringBank"
              fieldStateError={errors.acquiringBank}
              fieldWatchValue={acquiringBank}
              label="Acquiring Bank *"
              maxLength={32}
              hasInput={!!acquiringBank}
            />
          </div>
        )}

        {/* Optional Fields for Individual */}
        {accountType === "individual" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileFormInput
              register={register}
              fieldId="accountInformation"
              fieldInput="accountInformation"
              fieldStateError={errors.accountInformation}
              fieldWatchValue={accountInformation}
              label="Account Information (Optional)"
              maxLength={32}
              hasInput={!!accountInformation}
            />

            <ProfileFormInput
              register={register}
              fieldId="acquiringBank"
              fieldInput="acquiringBank"
              fieldStateError={errors.acquiringBank}
              fieldWatchValue={acquiringBank}
              label="Acquiring Bank (Optional)"
              maxLength={32}
              hasInput={!!acquiringBank}
            />
          </div>
        )}

        {/* Currency and Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex">
            <select
              id="currency"
              {...register("currency")}
              className="w-full px-4 md:mb-4 py-2.5 border-2 border-primary/70 rounded-sm text-primary bg-foreground focus:border-primary outline-none"
            >
              <option value="KHR">KHR (Riel)</option>
              <option value="USD">USD (Dollar)</option>
            </select>
          </div>

          <ProfileFormInput
            register={register}
            fieldId="amount"
            fieldInput="amount"
            fieldStateError={errors.amount}
            fieldWatchValue={amount}
            label="Amount (Optional)"
            maxLength={13}
            hasInput={!!amount}
          />
        </div>

        {/* Toggle Button for Optional Fields */}
        <button
          type="button"
          onClick={() => setShowOptionalFields(!showOptionalFields)}
          className="flex items-center gap-2 text-primary/70 hover:text-primary transition-colors text-sm font-medium"
        >
          {showOptionalFields ? (
            <>
              <ChevronUp size={20} />
              Hide additional options
            </>
          ) : (
            <>
              <ChevronDown size={20} />
              Add additional options
            </>
          )}
        </button>

        {/* Collapsible Optional Fields */}
        {showOptionalFields && (
          <div className="space-y-4 p-4 border-2 border-primary/10 rounded-lg bg-primary/5">
            <h3 className="text-sm font-semibold text-primary mb-2">
              Additional Options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileFormInput
                register={register}
                fieldId="merchantCity"
                fieldInput="merchantCity"
                fieldStateError={errors.merchantCity}
                fieldWatchValue={merchantCity || ""}
                label="Merchant City"
                maxLength={15}
                hasInput={!!merchantCity}
              />

              <ProfileFormInput
                register={register}
                fieldId="billNumber"
                fieldInput="billNumber"
                fieldStateError={errors.billNumber}
                fieldWatchValue={billNumber}
                label="Bill Number"
                maxLength={25}
                hasInput={!!billNumber}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileFormInput
                register={register}
                fieldId="mobileNumber"
                fieldInput="mobileNumber"
                fieldStateError={errors.mobileNumber}
                fieldWatchValue={mobileNumber}
                label="Mobile Number"
                maxLength={25}
                hasInput={!!mobileNumber}
              />

              <ProfileFormInput
                register={register}
                fieldId="storeLabel"
                fieldInput="storeLabel"
                fieldStateError={errors.storeLabel}
                fieldWatchValue={storeLabel}
                label="Store Label"
                maxLength={25}
                hasInput={!!storeLabel}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileFormInput
                register={register}
                fieldId="terminalLabel"
                fieldInput="terminalLabel"
                fieldStateError={errors.terminalLabel}
                fieldWatchValue={terminalLabel}
                label="Terminal Label"
                maxLength={25}
                hasInput={!!terminalLabel}
              />

              <ProfileFormInput
                register={register}
                fieldId="purposeOfTransaction"
                fieldInput="purposeOfTransaction"
                fieldStateError={errors.purposeOfTransaction}
                fieldWatchValue={purposeOfTransaction}
                label="Purpose of Transaction"
                maxLength={25}
                hasInput={!!purposeOfTransaction}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleSubmit(onGenerateQR)}
            disabled={!isValid}
            isLoading={isGenerating}
          >
            Generate QR Code
          </Button>

          {generatedQR && (
            <Button
              type="button"
              variant="secondary"
              onClick={downloadQR}
              className="flex items-center gap-2"
            >
              Download QR
            </Button>
          )}
        </div>
      </div>

      {generatedQR ? (
        <div className="mt-6">
          <div className="border-2 border-primary/20 rounded-lg p-6 flex flex-col items-center">
            <h3 className="text-lg font-medium text-primary mb-4">
              Your KHQR Code
            </h3>
            <div className="bg-white p-4 rounded-lg">
              <img
                src={generatedQR}
                alt="KHQR Code"
                className="w-64 h-64 object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-primary/70">
                Account: {merchantName} ({bakongAccountID})
              </p>
              <p className="text-sm text-primary/70">
                Type:{" "}
                {accountType.charAt(0).toUpperCase() + accountType.slice(1)}
              </p>
              <p className="text-sm text-primary/70">
                Currency: {currency}
                {amount && ` | Amount: ${amount}`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-primary/20 rounded-lg p-12 text-center">
          <QrCode size={48} className="mx-auto text-primary/40 mb-4" />
          <h3 className="text-lg font-medium text-primary mb-2">
            No QR code generated
          </h3>
          <p className="text-sm text-primary/60">
            Fill in the details above and click &quot;Generate QR Code&quot;
          </p>
        </div>
      )}
    </div>
  );
}
