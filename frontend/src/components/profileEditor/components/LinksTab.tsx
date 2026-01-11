import { Link as LinkIcon, X } from "lucide-react";
import ProfileFormInput from "../../profileInput/profileInput";
import Button from "../../ui/Button";
import type { LinksTabProps } from "@/types/tabProps";
import { useTranslations } from "next-intl";

export default function LinksTab({
  register,
  errors,
  handleSubmit,
  onAddLink,
  onDelete,
  linkTitle,
  linkUrl,
  isValid,
  isAdding,
  initialData,
}: LinksTabProps) {
  const t = useTranslations("profileEditor");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-primary">
            {t("linksTab.title")}
          </h2>
          <p className="text-sm text-primary/60">{t("linksTab.description")}</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <ProfileFormInput
          register={register}
          fieldId="linkTitle"
          fieldInput="link.title"
          fieldStateError={errors.link?.title}
          fieldWatchValue={linkTitle}
          label={t("linksTab.linkTitle")}
          maxLength={50}
          hasInput={!!linkTitle}
        />
        <ProfileFormInput
          register={register}
          fieldId="linkUrl"
          fieldInput="link.url"
          fieldStateError={errors.link?.url}
          fieldWatchValue={linkUrl}
          label={t("linksTab.linkUrl")}
          maxLength={2000}
          hasInput={!!linkUrl}
        />
        <Button
          onClick={handleSubmit(onAddLink)}
          disabled={!isValid || isAdding}
          type="button"
        >
          {isAdding ? t("buttons.addingLink") : t("buttons.addLink")}
        </Button>
      </div>

      {initialData?.links.length === 0 ? (
        <div className="border-2 border-dashed border-primary/20 rounded-lg p-12 text-center">
          <LinkIcon size={48} className="mx-auto text-primary/40 mb-4" />
          <h3 className="text-lg font-medium text-primary mb-2">
            {t("linksTab.noLinks")}
          </h3>
          <p className="text-sm text-primary/60 mb-4">
            {t("linksTab.startAdding")}
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
              <button type="button" onClick={() => onDelete(link?._id)}>
                {/* delete link */}
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
