"use client";

import React, { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from "@/helpers/next-fetch/apiActions/artisanActions";
import { PortfolioCard } from "./components/PortfolioCard";
import { EmptyPortfolioState } from "./components/EmptyPortfolioState";
import { AddEditPortfolioModal } from "./components/AddEditPortfolioModal";
import type {
  ArtisanPortfolioManagerProps,
  PortfolioItem,
} from "./types";

export function ArtisanPortfolioManager({
  initialPortfolio = [],
  categories = [],
}: ArtisanPortfolioManagerProps) {
  // STRICT: No mock data! Directly initialize from server props
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio);

  // Modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deletingItem, setDeletingItem] = useState<PortfolioItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state if initialPortfolio prop updates
  React.useEffect(() => {
    setPortfolio(initialPortfolio);
  }, [initialPortfolio]);

  // Open add modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsAddEditOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsAddEditOpen(true);
  };

  // Save (Create or Update)
  const handleSave = async (
    formData: FormData,
    itemId?: string,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      if (itemId) {
        // Update existing item
        const res = await updatePortfolioItem(itemId, formData);
        if (res?.success) {
          toast.success("Portfolio project updated successfully!");
          setPortfolio((prev) =>
            prev.map((p) =>
              p._id === itemId ? { ...p, ...(res.data || {}) } : p,
            ),
          );
          return true;
        } else {
          toast.error(res?.message || "Failed to update portfolio project");
          return false;
        }
      } else {
        // Create new item
        const res = await createPortfolioItem(formData);
        if (res?.success) {
          toast.success("New portfolio project published successfully!");
          if (res.data) {
            setPortfolio((prev) => [res.data, ...prev]);
          }
          return true;
        } else {
          toast.error(res?.message || "Failed to publish portfolio project");
          return false;
        }
      }
    } catch {
      toast.error("An error occurred while saving the project");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete project
  const handleConfirmDelete = async () => {
    if (!deletingItem?._id) return;

    setIsDeleting(true);
    try {
      const res = await deletePortfolioItem(deletingItem._id);
      if (res?.success) {
        toast.success("Project removed from your portfolio");
        setPortfolio((prev) =>
          prev.filter((p) => p._id !== deletingItem._id),
        );
        setDeletingItem(null);
      } else {
        toast.error(res?.message || "Failed to delete project");
      }
    } catch {
      toast.error("Failed to delete project. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Clean Simple Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-title">
              Portfolio Showcase
            </h1>
            <span className="text-xs font-semibold text-muted bg-slate-100 rounded-full px-2.5 py-0.5">
              {portfolio.length}
            </span>
          </div>
          <p className="text-xs text-muted">
            Showcase your completed craftsmanship, before & after project transformations, and verified client work.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenAdd}
          className="h-10 px-5 text-sm font-bold shadow-sm shrink-0 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Main Content: Grid 2 */}
      {portfolio.length === 0 ? (
        <EmptyPortfolioState onOpenAdd={handleOpenAdd} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {portfolio.map((item) => (
            <PortfolioCard
              key={item._id || item.title}
              item={item}
              onEdit={handleOpenEdit}
              onDelete={setDeletingItem}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      <AddEditPortfolioModal
        isOpen={isAddEditOpen}
        editingItem={editingItem}
        categories={categories}
        isSubmitting={isSubmitting}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeletingItem(null)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-2xl z-10 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display text-lg font-bold text-title">
                Delete Portfolio Project?
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Are you sure you want to delete &ldquo;
                <strong className="text-title">{deletingItem.title}</strong>
                &rdquo;? All uploaded photos and project records will be permanently removed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDeletingItem(null)}
                disabled={isDeleting}
                className="text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete Project"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export * from "./types";
