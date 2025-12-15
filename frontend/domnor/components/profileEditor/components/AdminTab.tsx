"use client";

import { useState } from "react";
import { ShieldOff, Shield, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface AdminTabProps {
  onDeactivate: (username: string) => void;
  onReactivate: (username: string) => void;
  isProcessing: boolean;
}

export default function AdminTab({
  onDeactivate,
  onReactivate,
  isProcessing,
}: AdminTabProps) {
  const [deactivateUsername, setDeactivateUsername] = useState("");
  const [reactivateUsername, setReactivateUsername] = useState("");

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
      <div>
        <h2 className="text-xl font-semibold mb-2 text-primary flex items-center gap-2">
          <Shield size={24} className="text-red-500" />
          Admin Controls
        </h2>
        <p className="text-sm text-primary/60">
          Manage user accounts. Use these controls carefully.
        </p>
      </div>

      {/* Deactivate Account Section */}
      <div className="border border-primary/10 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <ShieldOff size={20} className="text-red-500" />
          <h3 className="text-lg font-semibold text-primary">
            Deactivate Account
          </h3>
        </div>
        <p className="text-sm text-primary/60 mb-4">
          Enter the username of the account you want to deactivate. The user
          will no longer be able to access or modify their profile.
        </p>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="deactivate-username"
              className="block text-sm font-medium text-primary/70 mb-2"
            >
              Username to Deactivate
            </label>
            <input
              id="deactivate-username"
              type="text"
              value={deactivateUsername}
              onChange={(e) => setDeactivateUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isProcessing}
              onKeyDown={(e) => {
                if (e.key === "Enter" && deactivateUsername.trim()) {
                  handleDeactivate(e);
                }
              }}
              className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span>Processing...</span>
              </>
            ) : (
              <>
                <ShieldOff size={18} />
                <span>Deactivate Account</span>
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
            Reactivate Account
          </h3>
        </div>
        <p className="text-sm text-primary/60 mb-4">
          Enter the username of the account you want to reactivate. The user
          will regain access to their profile.
        </p>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="reactivate-username"
              className="block text-sm font-medium text-primary/70 mb-2"
            >
              Username to Reactivate
            </label>
            <input
              id="reactivate-username"
              type="text"
              value={reactivateUsername}
              onChange={(e) => setReactivateUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isProcessing}
              onKeyDown={(e) => {
                if (e.key === "Enter" && reactivateUsername.trim()) {
                  handleReactivate(e);
                }
              }}
              className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Shield size={18} />
                <span>Reactivate Account</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Warning Message */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          <strong>Warning:</strong> Make sure you
          have the correct username before proceeding.
        </p>
      </div>
    </div>
  );
}
