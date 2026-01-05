import { useState } from "react";
import { QrCode, ChevronDown, ChevronUp } from "lucide-react";
import Button from "../../ui/Button";
import Select from "../../ui/Select";
import ProfileFormInput from "../../profileInput/profileInput";
import type { PaymentTabProps } from "@/types/paymentTabProp";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function GenerateQrTab({
  register,
  setValue,
  errors,
  handleSubmit,
  onGenerateQR,
  accountType,
  bakongAccountID,
  merchantName,
  merchantID,
  acquiringBank,
  accountInformation,
  amount,
  merchantCity,
  isValid,
  isGenerating,
  error,
  initialData,
  currency,
}: PaymentTabProps) {
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const t = useTranslations("profileEditor.paymentTab");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-primary">
            {t("title")}
          </h2>
          <p className="text-sm text-primary/60">{t("description")}</p>
          <br />
          <p className="text-sm text-primary/60">
            Don&apos;t have Bakong account? Check out{" "}
            <a
              className="text-red-600 underline"
              href="https://bakong.nbc.gov.kh/"
            >
              Bakong
            </a>
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
            {t("accountType")}
          </label>
          <Select
            value={accountType}
            onChange={(val) =>
              setValue("accountType", val as "individual" | "merchant", {
                shouldValidate: true,
              })
            }
            options={[
              { value: "individual", label: t("individual") },
              { value: "merchant", label: t("merchant") },
            ]}
            className="w-full"
          />
        </div>

        {/* Common Mandatory Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileFormInput
            register={register}
            fieldId="bakongAccountID"
            fieldInput="bakongAccountID"
            fieldStateError={errors.bakongAccountID}
            fieldWatchValue={bakongAccountID}
            label={t("bakongAccountID")}
            maxLength={32}
            hasInput={!!bakongAccountID}
          />

          <ProfileFormInput
            register={register}
            fieldId="merchantName"
            fieldInput="merchantName"
            fieldStateError={errors.merchantName}
            fieldWatchValue={merchantName}
            label={t("merchantName")}
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
              // @ts-expect-error because of zod discrimination typescript is not cooperating
              fieldStateError={errors.merchantID}
              fieldWatchValue={merchantID}
              label={t("merchantID")}
              maxLength={32}
              hasInput={!!merchantID}
            />

            <ProfileFormInput
              register={register}
              fieldId="acquiringBank"
              fieldInput="acquiringBank"
              fieldStateError={errors.acquiringBank}
              fieldWatchValue={acquiringBank || ""}
              label={t("acquiringBank")}
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
              // @ts-expect-error because of zod discrimination typescript is not cooperating
              fieldStateError={errors.accountInformation}
              fieldWatchValue={accountInformation || ""}
              label={t("accountInformation")}
              maxLength={32}
              hasInput={!!accountInformation}
            />

            <ProfileFormInput
              register={register}
              fieldId="acquiringBank"
              fieldInput="acquiringBank"
              fieldStateError={errors.acquiringBank}
              fieldWatchValue={acquiringBank || ""}
              label={t("acquiringBankOptional")}
              maxLength={32}
              hasInput={!!acquiringBank}
            />
          </div>
        )}

        {/* Currency and Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex">
            <Select
              value={currency || "KHR"}
              onChange={(val) =>
                setValue("currency", val as "KHR" | "USD", {
                  shouldValidate: true,
                })
              }
              options={[
                { value: "KHR", label: "KHR (Riel)" },
                { value: "USD", label: "USD (Dollar)" },
              ]}
              className="w-full md:mb-4"
            />
          </div>

          <ProfileFormInput
            register={register}
            fieldId="amount"
            fieldInput="amount"
            fieldStateError={errors.amount}
            fieldWatchValue={amount || ""}
            label={t("amount")}
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
              {t("hideOptions")}
            </>
          ) : (
            <>
              <ChevronDown size={20} />
              {t("addOptions")}
            </>
          )}
        </button>

        {/* Collapsible Optional Fields */}
        {showOptionalFields && (
          <div className="space-y-4 p-4 border-2 border-primary/10 rounded-lg bg-foreground">
            <h3 className="text-sm font-semibold text-primary mb-2">
              {t("additionalOptions")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileFormInput
                register={register}
                fieldId="merchantCity"
                fieldInput="merchantCity"
                fieldStateError={errors.merchantCity}
                fieldWatchValue={merchantCity || ""}
                label={t("merchantCity")}
                maxLength={15}
                hasInput={!!merchantCity}
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
            {t("buttons.generateQR")}
          </Button>
        </div>
      </div>

      {initialData?.paymentQrCodeUrl ? (
        <div className="mt-6">
          <div className="border-2 border-primary/20 rounded-lg p-6 flex flex-col items-center">
            <h3 className="text-lg font-medium text-primary mb-4">
              {t("yourKhqr")}
            </h3>
            <div className="bg-white p-4 rounded-lg">
              <Image
                src={initialData.paymentQrCodeUrl}
                width={500}
                height={500}
                alt="KHQR Code"
                className="w-64 h-64 object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-primary/70">
                {t("account")}: {initialData?.paymentInfo.merchantName} (
                {initialData?.paymentInfo.bakongAccountID})
              </p>
              <p className="text-sm text-primary/70">
                {t("currency")}: {initialData?.paymentInfo.currency}
                {initialData?.paymentInfo.amount &&
                  ` | Amount: ${initialData.paymentInfo.amount}`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-primary/20 rounded-lg p-12 text-center">
          <QrCode size={48} className="mx-auto text-primary/40 mb-4" />
          <h3 className="text-lg font-medium text-primary mb-2">{t("noQr")}</h3>
          <p className="text-sm text-primary/60">{t("fillDetails")}</p>
        </div>
      )}
    </div>
  );
}
