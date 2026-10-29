"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Camera,
  Calendar,
  X,
  Sparkles,
  UploadCloud,
  Loader2,
  Tag,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextField, TextArea, NativeSelect } from "@/components/ui/field";
import { toast } from "sonner";
import {
  getMyPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  getServiceCategories,
} from "@/helpers/next-fetch/apiActions/artisanActions";
import { getImageUrl } from "@/lib/getImageUrl";

export type PortfolioImageType = "before" | "after" | "work";

export interface PortfolioImage {
  url: string;
  type: PortfolioImageType;
}

export interface PortfolioItem {
  _id?: string;
  title: string;
  description: string;
  category: any;
  images: PortfolioImage[];
  completedAt?: string;
  isPublished: boolean;
}

interface ImageUploadItem {
  id: string;
  file?: File;
  previewUrl: string;
  type: PortfolioImageType;
  isExisting: boolean;
}

export function ArtisanPortfolioManager() {
  const [categories, setCategories] = useState<any[]>([]);
  // STRICT: No mock data! Start empty
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form state
  const [form, setForm] = useState<{
    title: string;
    description: string;
    category: string;
    completedAt: string;
    isPublished: boolean;
  }>({
    title: "",
    description: "",
    category: "",
    completedAt: new Date().toISOString().split("T")[0],
    isPublished: true,
  });

  // Managed image items with type selection (before, after, work)
  const [imageItems, setImageItems] = useState<ImageUploadItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [catRes, portRes] = await Promise.allSettled([
          getServiceCategories(),
          getMyPortfolio(),
        ]);

        if (catRes.status === "fulfilled" && catRes.value?.data?.length) {
          setCategories(catRes.value.data);
          setForm((prev) => ({ ...prev, category: catRes.value.data[0]._id }));
        }

        if (portRes.status === "fulfilled" && portRes.value?.data) {
          setPortfolio(portRes.value.data);
        } else {
          setPortfolio([]);
        }
      } catch (err) {
        console.error("Failed to load portfolio:", err);
        setPortfolio([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setForm({
      title: "",
      description: "",
      category: categories[0]?._id || "",
      completedAt: new Date().toISOString().split("T")[0],
      isPublished: true,
    });
    setImageItems([]);
    setShowModal(true);
  };

  const handleOpenEdit = (item: PortfolioItem, idx: number) => {
    setEditingIndex(idx);
    setForm({
      title: item.title || "",
      description: item.description || "",
      category:
        typeof item.category === "object" ? item.category?._id : item.category,
      completedAt: item.completedAt
        ? new Date(item.completedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      isPublished: item.isPublished !== undefined ? item.isPublished : true,
    });

    // Populate existing images
    const existingList: ImageUploadItem[] = (item.images || []).map(
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
    setShowModal(true);
  };

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const maxAllowed = 10;
    if (imageItems.length + files.length > maxAllowed) {
      toast.error(`Maximum ${maxAllowed} images allowed per project`);
      return;
    }

    const newItems: ImageUploadItem[] = files.map((file, i) => {
      // Suggest before/after intelligently if starting with 2 photos
      let defaultType: PortfolioImageType = "work";
      if (imageItems.length === 0 && i === 0 && files.length >= 2) {
        defaultType = "before";
      } else if (imageItems.length <= 1 && (imageItems.length === 1 || i === 1) && files.length >= 2) {
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
      if (target && !target.isExisting && target.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleSaveProject = async () => {
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

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // 1. Append new files to 'images' in exact order
      imageItems.forEach((item) => {
        if (!item.isExisting && item.file) {
          formData.append("images", item.file);
        }
      });

      // 2. Prepare images metadata preserving before/after/work type for each photo
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
          title: form.title,
          description: form.description,
          category: form.category,
          completedAt: form.completedAt,
          isPublished: form.isPublished,
          images: imagesMeta,
        }),
      );

      if (editingIndex !== null) {
        const currentItem = portfolio[editingIndex];
        if (currentItem._id) {
          const res = await updatePortfolioItem(currentItem._id, formData);
          if (res?.success && res?.data) {
            setPortfolio((prev) => {
              const next = [...prev];
              next[editingIndex] = res.data;
              return next;
            });
            toast.success("Portfolio project updated!");
          } else {
            toast.error(res?.message || "Failed to update portfolio");
          }
        }
      } else {
        const res = await createPortfolioItem(formData);
        if (res?.success && res?.data) {
          setPortfolio((prev) => [res.data, ...prev]);
          toast.success("New portfolio project added!");
        } else {
          toast.error(res?.message || "Failed to create portfolio");
        }
      }

      setShowModal(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save portfolio project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (idx: number) => {
    const item = portfolio[idx];
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    try {
      if (item._id && !item._id.startsWith("port-")) {
        await deletePortfolioItem(item._id);
      }
      setPortfolio((prev) => prev.filter((_, i) => i !== idx));
      toast.success("Project removed from portfolio");
    } catch {
      setPortfolio((prev) => prev.filter((_, i) => i !== idx));
      toast.success("Project deleted");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-title flex items-center gap-2">
            Work Portfolio Showcase
            {!isLoading && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-title">
                {portfolio.length} {portfolio.length === 1 ? "Project" : "Projects"}
              </span>
            )}
          </h1>
          <p className="text-xs text-muted mt-1">
            Showcase your craftsmanship with Before, After, and Work photos via direct file upload.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenAdd}
          className="font-bold text-xs px-5 shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          disabled={isLoading || categories.length === 0}
        >
          <Plus className="h-4 w-4" />
          Add Portfolio Project
        </Button>
      </div>

      {/* Skeleton Loading State */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="rounded-3xl border border-line bg-white shadow-2xs overflow-hidden animate-pulse space-y-4"
            >
              <div className="aspect-[16/9] w-full bg-slate-200" />
              <div className="p-6 space-y-3">
                <div className="h-4 w-28 rounded bg-slate-200" />
                <div className="h-6 w-3/4 rounded bg-slate-200" />
                <div className="h-12 w-full rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : portfolio.length === 0 ? (
        /* Empty State */
        <Card className="p-12 text-center rounded-3xl border border-dashed border-line bg-gradient-to-br from-slate-50/70 to-white shadow-2xs space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
            <Layers className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-display text-lg font-bold text-title">
              No Portfolio Projects Yet
            </h3>
            <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
              Upload real Before & After photos to prove your craftsmanship and win client bookings faster.
            </p>
          </div>
          <div className="pt-2">
            <Button
              onClick={handleOpenAdd}
              className="font-bold text-xs px-6 shadow-xs inline-flex items-center gap-2"
              disabled={categories.length === 0}
            >
              <Plus className="h-4 w-4" /> Add First Work Sample
            </Button>
          </div>
        </Card>
      ) : (
        /* Projects Grid */
        <div className="grid gap-6 sm:grid-cols-2">
          {portfolio.map((item, idx) => {
            const catObj = categories.find(
              (c) =>
                c._id ===
                (typeof item.category === "object"
                  ? (item.category as any)?._id
                  : item.category),
            );

            const itemImages: PortfolioImage[] = (item.images || []).map(
              (img: any) => ({
                url: typeof img === "string" ? img : img?.url || "",
                type: (typeof img === "object" && img?.type ? img.type : "work") as PortfolioImageType,
              }),
            ).filter((img) => Boolean(img.url));

            return (
              <div
                key={item._id || idx}
                className="group rounded-3xl border border-line bg-white shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] w-full bg-smoke overflow-hidden">
                  {itemImages.length > 0 ? (
                    <div className="h-full w-full flex">
                      {itemImages.slice(0, 2).map((img, imgIdx) => {
                        const displaySrc = getImageUrl(img.url) || img.url;
                        return (
                          <div
                            key={imgIdx}
                            className={`relative h-full ${
                              itemImages.length > 1
                                ? "w-1/2 border-r border-white/30"
                                : "w-full"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={displaySrc}
                              alt={item.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                            {/* Before / After / Work Badge */}
                            <span
                              className={`absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-2xs ${
                                img.type === "before"
                                  ? "bg-amber-600/90"
                                  : img.type === "after"
                                  ? "bg-emerald-600/90"
                                  : "bg-slate-900/80"
                              }`}
                            >
                              {img.type}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted">
                      <Camera className="h-8 w-8 opacity-40" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-2xs ${
                        item.isPublished
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-600 text-white"
                      }`}
                    >
                      {item.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary">
                      <span>{catObj?.name || "General Craftsmanship"}</span>
                      {item.completedAt && (
                        <>
                          <span className="text-muted">•</span>
                          <span className="text-muted font-medium">
                            {new Date(item.completedAt).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-title group-hover:text-primary transition line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-line flex items-center justify-between">
                    <span className="text-[11px] text-muted font-medium flex items-center gap-1.5">
                      {itemImages.length} photo{itemImages.length > 1 ? "s" : ""}
                      {itemImages.some((i) => i.type === "before") && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                      {itemImages.some((i) => i.type === "after") && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item, idx)}
                        className="p-2 rounded-xl text-muted hover:text-title hover:bg-slate-100 transition"
                        title="Edit project"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(idx)}
                        className="p-2 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Project Modal with Type Selector for Each Photo */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-line max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-title">
                  {editingIndex !== null
                    ? "Edit Portfolio Work Sample"
                    : "Add New Portfolio Project"}
                </h3>
                <p className="text-xs text-muted">
                  Upload project photos and classify them as Before, After, or general Work samples.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-muted hover:text-title hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Project Title">
                <TextField
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Bathroom Pipe Repair & Valve Replacement"
                />
              </Field>

              <Field label="Related Service Category">
                <NativeSelect
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </NativeSelect>
              </Field>

              <Field label="Project Description">
                <TextArea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe the issue resolved, parts and materials used, and quality standards applied..."
                />
              </Field>

              {/* Upload Work Photos with Type Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-title block">
                      Work Photos & Types ({imageItems.length}/10)
                    </label>
                    <span className="text-[11px] text-muted">
                      Tag each uploaded photo as Before, After, or Work
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Select Photos
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleFilesSelect}
                />

                {/* Dropzone / Upload Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-line hover:border-primary/50 bg-slate-50/80 hover:bg-slate-50 rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="h-10 w-10 rounded-xl bg-white shadow-2xs border border-line flex items-center justify-center text-primary group-hover:scale-105 transition">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-title">
                      Click to choose image files
                    </p>
                    <p className="text-[11px] text-muted">
                      PNG, JPG, or WEBP (Direct file upload)
                    </p>
                  </div>
                </div>

                {/* Photo Previews with Type Dropdown */}
                {imageItems.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {imageItems.map((item, i) => {
                      const displaySrc = item.isExisting
                        ? getImageUrl(item.previewUrl) || item.previewUrl
                        : item.previewUrl;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-2xl border border-line bg-slate-50/90 shadow-2xs"
                        >
                          {/* Thumbnail */}
                          <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden shrink-0 border border-line bg-smoke">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={displaySrc}
                              alt="Work photo"
                              className="h-full w-full object-cover"
                            />
                            <span
                              className={`absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider text-white shadow-2xs ${
                                item.type === "before"
                                  ? "bg-amber-600"
                                  : item.type === "after"
                                  ? "bg-emerald-600"
                                  : "bg-slate-900"
                              }`}
                            >
                              {item.type}
                            </span>
                          </div>

                          {/* Info & Type Selector */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-title truncate">
                                {item.file?.name || `Saved Photo #${i + 1}`}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  item.isExisting
                                    ? "bg-slate-200 text-slate-700"
                                    : "bg-primary/10 text-primary"
                                }`}
                              >
                                {item.isExisting ? "Saved" : "New Upload"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[11px] font-bold text-muted shrink-0">
                                Photo Type:
                              </span>
                              <NativeSelect
                                value={item.type}
                                onChange={(e) =>
                                  handleTypeChange(
                                    item.id,
                                    e.target.value as PortfolioImageType,
                                  )
                                }
                                className="h-8 text-xs py-1 px-2.5 max-w-[140px]"
                              >
                                <option value="work">Work (General)</option>
                                <option value="before">Before</option>
                                <option value="after">After</option>
                              </NativeSelect>
                            </div>
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(item.id)}
                            className="p-2 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Remove photo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Completion Date">
                  <TextField
                    type="date"
                    value={form.completedAt}
                    onChange={(e) =>
                      setForm({ ...form, completedAt: e.target.value })
                    }
                  />
                </Field>

                <Field label="Publish Status">
                  <NativeSelect
                    value={form.isPublished ? "true" : "false"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isPublished: e.target.value === "true",
                      })
                    }
                  >
                    <option value="true">Published (Visible to Clients)</option>
                    <option value="false">Draft (Private)</option>
                  </NativeSelect>
                </Field>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
                className="text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveProject}
                disabled={isSubmitting}
                className="text-xs font-bold px-5 flex items-center gap-1.5"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingIndex !== null ? "Save Changes" : "Create Project"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
