"use client";

import { useEffect, useRef, useState } from "react";
import { updateProfile } from "firebase/auth";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadAvatar } from "@/lib/api/uploads";
import { updateMyProfile } from "@/lib/syncUser";
import { useAuth } from "@/providers/AuthProvider";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;

export function PersonalInfoPanel() {
  const t = useTranslations("settings.account");
  const { user, profile, applyProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.firstName ?? "");
    setLastName(profile.lastName ?? "");
    setAvatarUrl(profile.avatarUrl ?? null);
  }, [profile]);

  const initials = `${(firstName || "?").charAt(0)}${(lastName || "?").charAt(0)}`.toUpperCase();

  const roleLabel =
    profile?.role === "owner"
      ? t("roles.owner")
      : profile?.role === "admin"
        ? t("roles.admin")
        : profile?.role ?? "";

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error(t("imageInvalidType"));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(t("imageTooLarge", { max: MAX_SIZE_MB }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const url = await uploadAvatar(file);
      setAvatarUrl(url);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("imageUploadFailed")
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    if (!trimmedFirst || !trimmedLast) {
      toast.error(t("nameRequired"));
      return;
    }

    setSaving(true);
    try {
      const updated = await updateMyProfile({
        firstName: trimmedFirst,
        lastName: trimmedLast,
        avatarUrl,
      });
      applyProfile(updated);

      if (user) {
        try {
          await updateProfile(user, {
            displayName: `${trimmedFirst} ${trimmedLast}`.trim(),
          });
        } catch {
          toast.warning(t("firebaseSyncWarning"));
        }
      }

      toast.success(t("saveSuccess"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex max-w-lg flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight">
          {t("tabs.personalInfo")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("personalInfoDescription")}</p>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="size-20 rounded-full">
          <AvatarImage src={avatarUrl ?? undefined} alt="" />
          <AvatarFallback className="rounded-full bg-primary/10 text-lg text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading || saving}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? t("uploading") : t("changePhoto")}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={handleAvatarChange}
          />
          <p className="text-xs text-muted-foreground">{t("photoHint")}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">{t("firstName")}</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={saving}
            autoComplete="given-name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">{t("lastName")}</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={saving}
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          value={profile?.email ?? ""}
          readOnly
          disabled
          className="bg-muted"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("role")}</Label>
        {roleLabel ? (
          <Badge variant="outline" className="w-fit capitalize">
            {roleLabel}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </div>

      <div>
        <Button type="submit" disabled={saving || uploading || !profile}>
          {saving ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
