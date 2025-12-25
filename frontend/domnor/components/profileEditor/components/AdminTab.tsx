"use client";


import { useState } from "react";
import { ShieldOff, Shield, Loader2, Star, Award, UserCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";

import { patchJSON } from "@/https/https";
import { Axios, AxiosError } from "axios";

interface AdminTabProps {
  onDeactivate: (username: string) => void;
  onReactivate: (username: string) => void;
  isProcessing: boolean;
}

type ToggleType = "supporter" | "gold" | "dev" | "verified";



export default function AdminTab({
  onDeactivate,
  onReactivate,
  isProcessing,
}: AdminTabProps) {
  const [deactivateUsername, setDeactivateUsername] = useState("");
  const [reactivateUsername, setReactivateUsername] = useState("");
  const [toggleUsernames, setToggleUsernames] = useState({
    supporter: "",
    gold: "",
    dev: "",
    verified: "",
  });
  const [toggleLoading, setToggleLoading] = useState<ToggleType | null>(null);
  const [toggleMessage, setToggleMessage] = useState("");
  const t = useTranslations("profileEditor");
  const handleToggle = async (type: ToggleType) => {
    const username = toggleUsernames[type].trim();
    if (!username) return;
    setToggleLoading(type);
    setToggleMessage("");
    let statusType = "";
    switch (type) {
      case "supporter":
        statusType = "supporter";
        break;
      case "gold":
        statusType = "gold";
        break;
      case "dev":
        statusType = "dev";
        break;
      case "verified":
        statusType = "verified";
        break;
    }
    try {
      const res = await patchJSON("/user/toggle-status", { username, statusType });
      setToggleMessage(res?.message || "success");
      setToggleUsernames((prev) => ({ ...prev, [type]: "" }));
    } catch (err: AxiosError) {
      setToggleMessage(err?.response?.data?.message || "error");
    } finally {
      setToggleLoading(null);
    }
  };

  const handleDeactivate = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (deactivateUsername.trim()) {
      onDeactivate(deactivateUsername.trim());
      setDeactivateUsername("");
    }
  };

  const handleReactivate = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (reactivateUsername.trim()) {
      onReactivate(reactivateUsername.trim());
      setReactivateUsername("");
    }
  };

  return (
    <div className="p-6 space-y-8">
            {/* Toggle Supporter Status Section */}
            <div className="border border-primary/10 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Star size={20} className="text-yellow-500" />
                <h3 className="text-lg font-semibold text-primary">Toggle Supporter</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="toggle-supporter-username" className="block text-sm font-medium text-primary/70 mb-2">Username</label>
                  <input
                    id="toggle-supporter-username"
                    type="text"
                    value={toggleUsernames.supporter}
                    onChange={(e) => setToggleUsernames((prev) => ({ ...prev, supporter: e.target.value }))}
                    placeholder="Enter username"
                    disabled={toggleLoading === "supporter"}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && toggleUsernames.supporter.trim()) {
                        handleToggle("supporter");
                      }
                    }}
                    className="w-full px-4 py-2 bg-foreground border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => handleToggle("supporter")}
                  disabled={!toggleUsernames.supporter.trim() || toggleLoading === "supporter"}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {toggleLoading === "supporter" ? <Loader2 size={18} className="animate-spin" /> : <Star size={18} />}
                  <span>Toggle Supporter</span>
                </Button>
              </div>
            </div>

            {/* Toggle Gold Supporter Status Section */}
            <div className="border border-primary/10 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Award size={20} className="text-amber-700" />
                <h3 className="text-lg font-semibold text-primary">Toggle Gold Supporter</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="toggle-gold-username" className="block text-sm font-medium text-primary/70 mb-2">Username</label>
                  <input
                    id="toggle-gold-username"
                    type="text"
                    value={toggleUsernames.gold}
                    onChange={(e) => setToggleUsernames((prev) => ({ ...prev, gold: e.target.value }))}
                    placeholder="Enter username"
                    disabled={toggleLoading === "gold"}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && toggleUsernames.gold.trim()) {
                        handleToggle("gold");
                      }
                    }}
                    className="w-full px-4 py-2 bg-foreground border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => handleToggle("gold")}
                  disabled={!toggleUsernames.gold.trim() || toggleLoading === "gold"}
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {toggleLoading === "gold" ? <Loader2 size={18} className="animate-spin" /> : <Award size={18} />}
                  <span>Toggle Gold Supporter</span>
                </Button>
              </div>
            </div>

            {/* Toggle Dev Status Section */}
            <div className="border border-primary/10 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck size={20} className="text-blue-500" />
                <h3 className="text-lg font-semibold text-primary">Toggle Dev Status</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="toggle-dev-username" className="block text-sm font-medium text-primary/70 mb-2">Username</label>
                  <input
                    id="toggle-dev-username"
                    type="text"
                    value={toggleUsernames.dev}
                    onChange={(e) => setToggleUsernames((prev) => ({ ...prev, dev: e.target.value }))}
                    placeholder="Enter username"
                    disabled={toggleLoading === "dev"}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && toggleUsernames.dev.trim()) {
                        handleToggle("dev");
                      }
                    }}
                    className="w-full px-4 py-2 bg-foreground border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => handleToggle("dev")}
                  disabled={!toggleUsernames.dev.trim() || toggleLoading === "dev"}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {toggleLoading === "dev" ? <Loader2 size={18} className="animate-spin" /> : <UserCheck size={18} />}
                  <span>Toggle Dev Status</span>
                </Button>
              </div>
            </div>

            {/* Toggle Verified Status Section */}
            <div className="border border-primary/10 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={20} className="text-green-500" />
                <h3 className="text-lg font-semibold text-primary">Toggle Verified Status</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="toggle-verified-username" className="block text-sm font-medium text-primary/70 mb-2">Username</label>
                  <input
                    id="toggle-verified-username"
                    type="text"
                    value={toggleUsernames.verified}
                    onChange={(e) => setToggleUsernames((prev) => ({ ...prev, verified: e.target.value }))}
                    placeholder="Enter username"
                    disabled={toggleLoading === "verified"}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && toggleUsernames.verified.trim()) {
                        handleToggle("verified");
                      }
                    }}
                    className="w-full px-4 py-2 bg-foreground border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => handleToggle("verified")}
                  disabled={!toggleUsernames.verified.trim() || toggleLoading === "verified"}
                  className="w-full bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {toggleLoading === "verified" ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
                  <span>Toggle Verified Status</span>
                </Button>
              </div>
            </div>

            {toggleMessage && (
              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded text-primary">
                {toggleMessage}
              </div>
            )}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-primary flex items-center gap-2">
          <Shield size={24} className="text-red-500" />
          {t("adminTab.title")}
        </h2>
        <p className="text-sm text-primary/60">
          {t("adminTab.description")}
        </p>
      </div>

      {/* Deactivate Account Section */}
      <div className="border border-primary/10 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <ShieldOff size={20} className="text-red-500" />
          <h3 className="text-lg font-semibold text-primary">
            {t("adminTab.deactivateTitle")}
          </h3>
        </div>
        <p className="text-sm text-primary/60 mb-4">
          {t("adminTab.deactivateDesc")}
        </p>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="deactivate-username"
              className="block text-sm font-medium text-primary/70 mb-2"
            >
              {t("adminTab.deactivateLabel")}
            </label>
            <input
              id="deactivate-username"
              type="text"
              value={deactivateUsername}
              onChange={(e) => setDeactivateUsername(e.target.value)}
              placeholder={t("adminTab.deactivatePlaceholder")}
              disabled={isProcessing}
              onKeyDown={(e) => {
                if (e.key === "Enter" && deactivateUsername.trim()) {
                  handleDeactivate(e);
                }
              }}
              className="w-full px-4 py-2 bg-foreground border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <Button
            type="button"
            onClick={handleDeactivate}
            disabled={!deactivateUsername.trim() || isProcessing}
            className="w-full bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{t("buttons.processing")}</span>
              </>
            ) : (
              <>
                <ShieldOff size={18} />
                <span>{t("buttons.deactivateAccount")}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Reactivate Account Section */}
      <div className="border border-primary/10 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={20} className="text-green-500" />
          <h3 className="text-lg font-semibold text-primary">
            {t("adminTab.reactivateTitle")}
          </h3>
        </div>
        <p className="text-sm text-primary/60 mb-4">
          {t("adminTab.reactivateDesc")}
        </p>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="reactivate-username"
              className="block text-sm font-medium text-primary/70 mb-2"
            >
              {t("adminTab.reactivateLabel")}
            </label>
            <input
              id="reactivate-username"
              type="text"
              value={reactivateUsername}
              onChange={(e) => setReactivateUsername(e.target.value)}
              placeholder={t("adminTab.reactivatePlaceholder")}
              disabled={isProcessing}
              onKeyDown={(e) => {
                if (e.key === "Enter" && reactivateUsername.trim()) {
                  handleReactivate(e);
                }
              }}
              className="w-full px-4 py-2 bg-foreground border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <Button
            type="button"
            onClick={handleReactivate}
            disabled={!reactivateUsername.trim() || isProcessing}
            className="w-full bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{t("buttons.processing")}</span>
              </>
            ) : (
              <>
                <Shield size={18} />
                <span>{t("buttons.reactivateAccount")}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Warning Message */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          <strong>{t("adminTab.warning")}</strong> {t("adminTab.warningText")}
        </p>
      </div>
    </div>
  );
}
