"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { updateArtisanProfile } from "@/helpers/next-fetch/apiActions/artisanActions";
import { ProfileHeroCard } from "./components/ProfileHeroCard";
import { ProfileDetailsForm } from "./components/ProfileDetailsForm";
import type {
  ProfessionalProfileManagerProps,
  ProfileFormState,
  AvailabilityStatus,
} from "./types";

export function ProfessionalProfileManager({
  user,
}: ProfessionalProfileManagerProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Directly initialize form from the server-passed user response (Strictly no mock data)
  const [form, setForm] = useState<ProfileFormState>({
    name: user?.name || "",
    email: user?.email || "",
    image: user?.image || "",
    businessName: user?.businessName || "",
    trade: user?.trade || "",
    location: user?.location || "",
    phone: user?.phone || "",
    experienceYears: user?.experienceYears ?? 0,
    bio: user?.bio || "",
    availabilityStatus:
      (user?.availabilityStatus as AvailabilityStatus) || "Available",
    identityStatus: user?.identityStatus || "not_submitted",
  });

  // Sync state when user prop changes (e.g. Server Component revalidation)
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user?.name ?? prev.name,
        email: user?.email ?? prev.email,
        image: user?.image ?? prev.image,
        businessName: user?.businessName ?? prev.businessName,
        trade: user?.trade ?? prev.trade,
        location: user?.location ?? prev.location,
        phone: user?.phone ?? prev.phone,
        experienceYears: user?.experienceYears ?? prev.experienceYears,
        bio: user?.bio ?? prev.bio,
        availabilityStatus: user?.availabilityStatus ?? prev.availabilityStatus,
        identityStatus: user?.identityStatus ?? prev.identityStatus,
      }));
    }
  }, [user]);

  // Clean up object URL when component unmounts or previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle local image file selection
  const handleImagePick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate image type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file (JPG, PNG, WebP)");
        return;
      }

      // Max 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size must be less than 5MB");
        return;
      }

      // Clean up previous preview url if any
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const nextPreview = URL.createObjectURL(file);
      setSelectedImageFile(file);
      setPreviewUrl(nextPreview);
      toast.info("Image selected. Click 'Save Profile' to upload.");
    },
    [previewUrl],
  );

  // Handle resetting selected photo
  const handleResetImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImageFile(null);
    setPreviewUrl(null);
  }, [previewUrl]);

  // Handle generic field changes
  const handleFieldChange = useCallback(
    <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Handle availability change with instant live persistence
  const handleAvailabilityChange = useCallback(
    async (status: AvailabilityStatus) => {
      setForm((prev) => ({ ...prev, availabilityStatus: status }));

      try {
        const formData = new FormData();
        formData.append(
          "data",
          JSON.stringify({
            availabilityStatus: status,
          }),
        );

        const res = await updateArtisanProfile(formData);
        if (res?.success) {
          toast.success(`Availability status updated to ${status}`);
        } else {
          toast.error(res?.message || "Failed to update availability status");
        }
      } catch {
        toast.error("Failed to update availability status");
      }
    },
    [],
  );

  // Handle full profile submission using multipart FormData
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();

      // Append binary image with key 'image' if a new file was chosen
      if (selectedImageFile) {
        formData.append("image", selectedImageFile);
      }

      // Append JSON data string for backend validation schema
      const profileData = {
        name: form.name.trim(),
        businessName: form.businessName.trim(),
        trade: form.trade.trim(),
        location: form.location.trim(),
        phone: form.phone.trim(),
        experienceYears: Number(form.experienceYears) || 0,
        bio: form.bio.trim(),
        availabilityStatus: form.availabilityStatus,
      };

      formData.append("data", JSON.stringify(profileData));

      const res = await updateArtisanProfile(formData);

      if (res?.success) {
        toast.success("Professional profile saved successfully!");

        // If backend returned updated profile data with image path, update form state
        if (res.data?.image) {
          setForm((prev) => ({ ...prev, image: res.data.image }));
        }

        // Clear local file and preview
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setSelectedImageFile(null);
        setPreviewUrl(null);
      } else {
        toast.error(res?.message || "Failed to save profile");
      }
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <ProfileHeroCard
        form={form}
        previewUrl={previewUrl}
        hasNewImage={Boolean(selectedImageFile)}
        isSaving={isSaving}
        onImagePick={handleImagePick}
        onResetImage={handleResetImage}
        onAvailabilityChange={handleAvailabilityChange}
        onSave={handleSave}
      />

      <ProfileDetailsForm
        form={form}
        isSaving={isSaving}
        onChange={handleFieldChange}
        onSave={handleSave}
      />
    </div>
  );
}

export * from "./types";
