"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  Trash2,
  Camera,
  UploadCloud,
  Loader2,
  Calendar,
  Layers,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, TextField, TextArea, NativeSelect } from "@/components/ui/field";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/getImageUrl";
import type {
  PortfolioItem,
  PortfolioCategory,
  PortfolioImageType,
  ImageUploadItem,
  PortfolioFormState,
} from "../types";

interface AddEditPortfolioModalProps {
  isOpen: boolean;
  editingItem: PortfolioItem | null;
  categories: PortfolioCategory[];
  isSubmitting: boolean;
  onClose: () => void;
  onSave: (payload: FormData, itemId?: string) => Promise<boolean>;
}

export function AddEditPortfolioModal({
  isOpen,
  editingItem,
  categories,
  isSubmitting,
  onClose,
  onSave,
}: AddEditPortfolioModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<PortfolioFormState>({
    title: "",
    description: "",
    category: "",
    completedAt: new Date().toISOString().split("T")[0],
    isPublished: true,
  });

  const [imageItems, setImageItems] = useState<ImageUploadItem[]>([]);

  // Initialize or reset form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (editingItem) {
      setForm({
        title: editingItem.title || "",
        description: editingItem.description || "",
        category:
          typeof editingItem.category === "object" && editingItem.category !== null
            ? (editingItem.category as PortfolioCategory)._id
            : (editingItem.category as string) || "",
        completedAt: editingItem.completedAt
          ? new Date(editingItem.completedAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        isPublished:
          editingItem.isPublished !== undefined ? editingItem.isPublished : true,
      });

      // Populate existing images
      const existingList: ImageUploadItem[] = (editingItem.images || []).map(
        (img: any, i: number) => {
          const url = typeof img === "string" ? img : img?.url || "";
          const type: PortfolioImageType =
            typeof img === "object" && img?.type ? img.type : "work";
          return {
            id: `existing-${i}-${Date.now()}`,
            previewUrl: url,
            type: type,
            isExisting: true,
          };
        },
      );
      setImageItems(existingList);
    } else {
      setForm({
        title: "",
        description: "",
        category: categories[0]?._id || "",
        completedAt: new Date().toISOString().split("T")[0],
        isPublished: true,
      });
      setImageItems([]);
    }
  }, [isOpen, editingItem, categories]);

  // Clean up object URLs when modal closes
  useEffect(() => {
    return () => {
      imageItems.forEach((item) => {
        if (!item.isExisting && item.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [imageItems]);

  if (!isOpen) return null;

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const maxAllowed = 10;
    if (imageItems.length + files.length > maxAllowed) {
      toast.error(`Maximum ${maxAllowed} images allowed per project`);
      return;
    }

    const newItems: ImageUploadItem[] = files.map((file, i) => {
      let defaultType: PortfolioImageType = "work";
      if (imageItems.length === 0 && i === 0 && files.length >= 2) {
        defaultType = "before";
      } else if (
        imageItems.length <= 1 &&
        (imageItems.length === 1 || i === 1) &&
        files.length >= 2
      ) {
        defaultType = "after";
      }

      return {
        id: `new-${Date.now()}-${Math.random()}-${i}`,
        file,
        previewUrl: URL.createObjectURL(file),
        type: defaultType,
        isExisting: false,
      };
    });

    setImageItems((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTypeChange = (id: string, newType: PortfolioImageType) => {
    setImageItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, type: newType } : item)),
    );
  };

  const handleRemoveImage = (id: string) => {
    setImageItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (
        target &&
        !target.isExisting &&
        target.previewUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please provide a project title");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Please provide a project description");
      return;
    }
    if (!form.category) {
      toast.error("Please select a service category");
      return;
    }
    if (imageItems.length === 0) {
      toast.error("Please upload at least one work photo");
      return;
    }

    const formData = new FormData();

    // 1. Append new files to 'images' in exact order
    imageItems.forEach((item) => {
      if (!item.isExisting && item.file) {
        formData.append("images", item.file);
      }
    });

    // 2. Prepare images metadata preserving before/after/work type
    const imagesMeta = imageItems.map((item) => {
      if (item.isExisting) {
        return {
          url: item.previewUrl,
          type: item.type,
        };
      }
      return {
        type: item.type,
      };
    });

    formData.append(
      "data",
      JSON.stringify({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        completedAt: form.completedAt,
        isPublished: form.isPublished,
        images: imagesMeta,
      }),
    );

    const success = await onSave(formData, editingItem?._id);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-line bg-white shadow-2xl z-10 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5 bg-slate-50/70">
          <div>
            <h3 className="font-display text-lg font-bold text-title">
              {editingItem ? "Edit Portfolio Project" : "Add Portfolio Project"}
            </h3>
            <p className="text-xs text-muted">
              Showcase high-resolution photos, before/after stages, and scope notes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted hover:bg-slate-200 hover:text-title transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-140px)] overflow-y-auto">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleFilesSelect}
            className="hidden"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Project Title">
                <TextField
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Master Bathroom Tile & Vanity Renovation"
                  required
                />
              </Field>
            </div>

            <Field label="Category / Specialty">
              <NativeSelect
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>

            <Field label="Completion Date">
              <TextField
                type="date"
                value={form.completedAt}
                onChange={(e) =>
                  setForm({ ...form, completedAt: e.target.value })
                }
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Project Scope & Craftsmanship Statement">
                <TextArea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe the materials used, structural challenges solved, and specific client requirements..."
                  required
                />
              </Field>
            </div>

            <Field label="Showcase Visibility">
              <NativeSelect
                value={form.isPublished ? "true" : "false"}
                onChange={(e) =>
                  setForm({ ...form, isPublished: e.target.value === "true" })
                }
              >
                <option value="true">Published (Visible on Profile)</option>
                <option value="false">Draft (Private)</option>
              </NativeSelect>
            </Field>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-3 pt-2 border-t border-line">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-title block">
                  Project Gallery & Before / After Photos
                </label>
                <p className="text-xs text-muted">
                  Tag photos as Before, After, or Work In Progress (Max 10 photos).
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageItems.length >= 10}
                className="text-xs font-bold h-9 px-3 flex items-center gap-1.5"
              >
                <Camera className="h-4 w-4" />
                Upload Photos
              </Button>
            </div>

            {/* Drag & Drop / Click Upload Box */}
            {imageItems.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-2xl border-2 border-dashed border-line hover:border-primary/50 bg-slate-50/60 hover:bg-primary/5 p-8 text-center transition flex flex-col items-center justify-center gap-2"
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-title">
                    Click to browse or drag photos here
                  </p>
                  <p className="text-xs text-muted">
                    Supports high-res JPG, PNG, WebP up to 10MB each
                  </p>
                </div>
              </div>
            ) : (
              /* Image Grid with Tag Selector */
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {imageItems.map((item) => {
                  const displayUrl = item.isExisting
                    ? getImageUrl(item.previewUrl) || item.previewUrl
                    : item.previewUrl;

                  return (
                    <div
                      key={item.id}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xs"
                    >
                      {/* Image Preview */}
                      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={displayUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(item.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition"
                          title="Remove image"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Tag Switcher */}
                      <div className="p-2.5 bg-slate-50 border-t border-line flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-muted uppercase">
                          Stage:
                        </span>
                        <div className="inline-flex rounded-lg p-0.5 bg-white border border-line text-[11px] font-bold">
                          {(["before", "work", "after"] as const).map(
                            (type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => handleTypeChange(item.id, type)}
                                className={`px-2 py-0.5 rounded-md capitalize transition ${
                                  item.type === type
                                    ? type === "before"
                                      ? "bg-rose-500 text-white"
                                      : type === "after"
                                        ? "bg-emerald-600 text-white"
                                        : "bg-blue-600 text-white"
                                    : "text-muted hover:text-title"
                                }`}
                              >
                                {type}
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs font-bold px-6 flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {isSubmitting
                ? "Saving Project..."
                : editingItem
                  ? "Update Project"
                  : "Publish Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
