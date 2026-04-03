import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Search, Shield, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { CarInput, HWBackend, HotWheelsCar } from "../types/hotwheels";

import CarForm from "./CarForm";

interface AdminPanelProps {
  backend: HWBackend | null;
  isAdmin: boolean;
  cars: HotWheelsCar[];
  onCarsUpdate: (cars: HotWheelsCar[]) => void;
}

export default function AdminPanel({
  backend,
  isAdmin,
  cars,
  onCarsUpdate,
}: AdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCar, setEditingCar] = useState<HotWheelsCar | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCars = cars.filter(
    (c) =>
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.series.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const refreshCars = useCallback(async () => {
    if (!backend) return;
    try {
      const updated = await backend.listCars();
      onCarsUpdate(updated);
    } catch (e) {
      console.error(e);
    }
  }, [backend, onCarsUpdate]);

  const handleAdd = async (input: CarInput) => {
    if (!backend) {
      toast.error("Backend not connected");
      return;
    }
    setIsSubmitting(true);
    try {
      await backend.addCar(input);
      await refreshCars();
      setShowAddDialog(false);
      toast.success("Car added successfully!");
    } catch (e) {
      toast.error(
        `Failed to add car: ${e instanceof Error ? e.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (input: CarInput) => {
    if (!backend || !editingCar) {
      toast.error("Backend not connected");
      return;
    }
    setIsSubmitting(true);
    try {
      await backend.updateCar(editingCar.id, input);
      await refreshCars();
      setEditingCar(null);
      toast.success("Car updated successfully!");
    } catch (e) {
      toast.error(
        `Failed to update: ${e instanceof Error ? e.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!backend || deletingId === null) return;
    setIsSubmitting(true);
    try {
      await backend.deleteCar(deletingId);
      await refreshCars();
      setDeletingId(null);
      toast.success("Car deleted.");
    } catch (e) {
      toast.error(
        `Failed to delete: ${e instanceof Error ? e.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] px-6 gap-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        data-ocid="admin.panel"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,59,48,0.1)",
            border: "2px solid rgba(255,59,48,0.3)",
          }}
        >
          <Shield size={36} style={{ color: "#FF3B30" }} />
        </div>
        <div className="text-center">
          <h2
            className="text-xl font-black font-display"
            style={{ color: "#F2F2F2" }}
          >
            Access Restricted
          </h2>
          <p className="text-sm font-body mt-2" style={{ color: "#B6B6B6" }}>
            This area is for administrators only.
          </p>
          <p className="text-sm font-body mt-1" style={{ color: "#B6B6B6" }}>
            Contact the catalog owner to request admin access.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-6" data-ocid="admin.panel">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            className="text-lg font-black font-display"
            style={{ color: "#F2F2F2" }}
          >
            Admin Panel
          </h2>
          <p className="text-xs font-body" style={{ color: "#B6B6B6" }}>
            {cars.length} cars in catalog
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          size="sm"
          className="gap-1.5 font-body font-semibold rounded-lg"
          style={{
            background: "linear-gradient(135deg, #FF3B30, #FF5A1F)",
            border: "none",
            color: "white",
            boxShadow: "0 4px 16px rgba(255,59,48,0.3)",
          }}
          data-ocid="admin.add.open_modal_button"
        >
          <Plus size={16} />
          Add Car
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "#B6B6B6" }}
        />
        <Input
          placeholder="Search admin list…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 font-body text-sm"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,59,48,0.2)",
            color: "#F2F2F2",
          }}
          data-ocid="admin.search_input"
        />
      </div>

      {/* Car list */}
      {filteredCars.length === 0 ? (
        <div
          className="flex flex-col items-center py-16 gap-3"
          data-ocid="admin.empty_state"
        >
          <span className="text-4xl">🚗</span>
          <p className="text-sm font-body" style={{ color: "#B6B6B6" }}>
            {searchQuery ? "No matching cars" : "No cars yet. Add one!"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredCars.map((car, idx) => (
            <motion.div
              key={String(car.id)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className="flex items-center gap-3 px-3 py-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              data-ocid={`admin.item.${idx + 1}`}
            >
              {/* Color swatch */}
              <div
                className="w-8 h-8 rounded-lg flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #E6E6E6, #8A8B8E)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold font-body truncate"
                  style={{ color: "#F2F2F2" }}
                >
                  {car.name}
                </p>
                <p
                  className="text-xs font-body truncate"
                  style={{ color: "#B6B6B6" }}
                >
                  {car.series} · {String(Number(car.year))}
                </p>
              </div>
              {/* Actions */}
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-lg"
                  style={{ color: "#B6B6B6" }}
                  onClick={() => setEditingCar(car)}
                  data-ocid={`admin.edit_button.${idx + 1}`}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-lg hover:bg-red-900/30"
                  style={{ color: "#FF3B30" }}
                  onClick={() => setDeletingId(car.id)}
                  data-ocid={`admin.delete_button.${idx + 1}`}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent
          className="max-w-md"
          style={{
            background: "#111217",
            border: "1px solid rgba(255,59,48,0.2)",
            color: "#F2F2F2",
          }}
          data-ocid="admin.add.dialog"
        >
          <DialogHeader>
            <DialogTitle
              className="font-display font-black"
              style={{ color: "#F2F2F2" }}
            >
              Add New Car
            </DialogTitle>
          </DialogHeader>
          <CarForm
            onSubmit={handleAdd}
            onCancel={() => setShowAddDialog(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCar}
        onOpenChange={(open) => !open && setEditingCar(null)}
      >
        <DialogContent
          className="max-w-md"
          style={{
            background: "#111217",
            border: "1px solid rgba(255,59,48,0.2)",
            color: "#F2F2F2",
          }}
          data-ocid="admin.edit.dialog"
        >
          <DialogHeader>
            <DialogTitle
              className="font-display font-black"
              style={{ color: "#F2F2F2" }}
            >
              Edit Car
            </DialogTitle>
          </DialogHeader>
          {editingCar && (
            <CarForm
              initialData={editingCar}
              onSubmit={handleEdit}
              onCancel={() => setEditingCar(null)}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent
          style={{
            background: "#111217",
            border: "1px solid rgba(255,59,48,0.3)",
            color: "#F2F2F2",
          }}
          data-ocid="admin.delete.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              className="font-display font-black"
              style={{ color: "#F2F2F2" }}
            >
              Delete this car?
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "#B6B6B6" }}>
              This action cannot be undone. The car will be permanently removed
              from the catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeletingId(null)}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "#F2F2F2",
                border: "none",
              }}
              data-ocid="admin.delete.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              style={{
                background: "linear-gradient(135deg, #FF3B30, #FF5A1F)",
                color: "white",
                border: "none",
              }}
              data-ocid="admin.delete.confirm_button"
            >
              {isSubmitting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
