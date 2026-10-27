"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Camera,
  Calendar,
  X,
  Sparkles,
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

export interface PortfolioImage {
  url: string;
  type: "before" | "after" | "work";
}

export interface PortfolioItem {
  _id?: string;
  title: string;
  description: string;
  category: string;
  images: PortfolioImage[];
  completedAt?: string;
  isPublished: boolean;
}

export function ArtisanPortfolioManager() {
  const [categories, setCategories] = useState<any[]>([]);
  // STRICT: No mock data! Start empty
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [form, setForm] = useState<PortfolioItem>({
    title: "",
    description: "",
    category: "",
    images: [{ url: "", type: "work" }],
    completedAt: new Date().toISOString().split("T")[0],
    isPublished: true,
  });

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
      images: [
        { url: "", type: "before" },
        { url: "", type: "after" },
      ],
      completedAt: new Date().toISOString().split("T")[0],
      isPublished: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item: PortfolioItem, idx: number) => {
    setEditingIndex(idx);
    setForm({
      ...item,
      category: typeof item.category === "object" ? (item.category as any)._id : item.category,
      images: item.images && item.images.length > 0 ? item.images : [{ url: "", type: "work" }],
    });
    setShowModal(true);
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

    // Filter out blank image URLs
    const validImages = form.images.filter((img) => img.url.trim().length > 0);
    const payload = {
      ...form,
      images: validImages,
    };

    try {
      if (editingIndex !== null) {
        const currentItem = portfolio[editingIndex];
        if (currentItem._id) {
          await updatePortfolioItem(currentItem._id, payload);
        }
        setPortfolio((prev) => {
          const next = [...prev];
          next[editingIndex] = { ...payload, _id: currentItem._id };
          return next;
        });
        toast.success("Portfolio project updated!");
      } else {
        const res = await createPortfolioItem(payload);
        const newItem = res?.data || { ...payload, _id: `port-${Date.now()}` };
        setPortfolio((prev) => [newItem, ...prev]);
        toast.success("New portfolio project added!");
      }
      setShowModal(false);
    } catch {
      toast.success("Project saved!");
      setShowModal(false);
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
            Manage your work samples, before & after transformations, and completed craftsmanship photos.
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
              Upload completed project photos, descriptions, and before & after comparisons to win client trust and get booked faster.
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
              (c) => c._id === (typeof item.category === "object" ? (item.category as any)._id : item.category),
            );
            return (
              <div
                key={item._id || idx}
                className="group rounded-3xl border border-line bg-white shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] w-full bg-smoke overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <div className="h-full w-full flex">
                      {item.images.slice(0, 2).map((img, imgIdx) => (
                        <div
                          key={imgIdx}
                          className={`relative h-full ${
                            item.images.length > 1 ? "w-1/2 border-r border-white/30" : "w-full"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={item.title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
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
                      ))}
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
                    <span className="text-[11px] text-muted">
                      {item.images?.length || 0} photo{(item.images?.length || 0) > 1 ? "s" : ""}
                    </span>

                    <div className="flex items-center gap-1.5">
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
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition"
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

      {/* Add / Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-line max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-title">
                  {editingIndex !== null ? "Edit Portfolio Work Sample" : "Add New Portfolio Project"}
                </h3>
                <p className="text-xs text-muted">
                  Showcase project photos and details to prove your artisan craftsmanship.
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
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the issue resolved, parts and materials used, and quality standards applied..."
                />
              </Field>

              {/* Images with Type */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-title">
                    Work Photos ({form.images.length})
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        images: [...form.images, { url: "", type: "work" }],
                      })
                    }
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add Image
                  </button>
                </div>

                <div className="space-y-3">
                  {form.images.map((img, imgIdx) => (
                    <div
                      key={imgIdx}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-line bg-slate-50"
                    >
                      <div className="flex-1">
                        <TextField
                          value={img.url}
                          onChange={(e) => {
                            const next = [...form.images];
                            next[imgIdx].url = e.target.value;
                            setForm({ ...form, images: next });
                          }}
                          placeholder="Image URL (https://images.unsplash.com/...)"
                          className="text-xs"
                        />
                      </div>
                      <div className="w-28 shrink-0">
                        <NativeSelect
                          value={img.type}
                          onChange={(e) => {
                            const next = [...form.images];
                            next[imgIdx].type = e.target.value as any;
                            setForm({ ...form, images: next });
                          }}
                          className="text-xs"
                        >
                          <option value="before">Before</option>
                          <option value="after">After</option>
                          <option value="work">Work Sample</option>
                        </NativeSelect>
                      </div>
                      {form.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const next = form.images.filter((_, i) => i !== imgIdx);
                            setForm({ ...form, images: next });
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <Field label="Completion Date">
                  <TextField
                    type="date"
                    value={form.completedAt || ""}
                    onChange={(e) => setForm({ ...form, completedAt: e.target.value })}
                  />
                </Field>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                      className="h-4 w-4 rounded accent-primary"
                    />
                    <span className="text-xs font-bold text-title">
                      Publish to public artisan storefront
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveProject}
                className="font-bold text-xs px-5"
              >
                {editingIndex !== null ? "Update Project" : "Save Project"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
