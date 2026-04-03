import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Heart,
  Layers,
  MapPin,
  Palette,
  Ruler,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { HotWheelsCar } from "../types/hotwheels";

const COLOR_MAP: Record<string, string> = {
  Red: "#CC2200",
  Blue: "#1A4E8C",
  Green: "#1A5C2A",
  Yellow: "#C9A000",
  Orange: "#CC5500",
  Black: "#1A1A1A",
  White: "#CCCCCC",
  Silver: "#888899",
  "Papaya Orange": "#CC5500",
  Purple: "#5A1A8C",
  "Flat Black": "#111",
  Gold: "#A07000",
};

function getCarColor(color: string): string {
  const lower = color.toLowerCase();
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key.toLowerCase())) return val;
  }
  return "#2F3136";
}

interface CarDetailModalProps {
  car: HotWheelsCar;
  isFavorite: boolean;
  onToggleFavorite: (id: bigint) => void;
  onClose: () => void;
}

export default function CarDetailModal({
  car,
  isFavorite,
  onToggleFavorite,
  onClose,
}: CarDetailModalProps) {
  const [imgError, setImgError] = useState(false);
  const carColor = getCarColor(car.color);
  const showImage = !!car.imageUrl && !imgError;

  const specs = [
    {
      icon: <Calendar size={14} />,
      label: "Year",
      value: String(Number(car.year)),
    },
    { icon: <Layers size={14} />, label: "Series", value: car.series },
    { icon: <Ruler size={14} />, label: "Scale", value: car.scale },
    { icon: <Palette size={14} />, label: "Color", value: car.color },
    { icon: <MapPin size={14} />, label: "Origin", value: car.countryOfOrigin },
    { icon: <Layers size={14} />, label: "Tampo", value: car.tampo || "None" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        data-ocid="car-detail.modal"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
        />

        {/* Sheet */}
        <motion.div
          className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden"
          style={{
            background: "#111217",
            border: "1px solid rgba(255,59,48,0.2)",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Car image or CSS illustration */}
          <div
            className="w-full h-52 relative overflow-hidden"
            style={{ background: "#1C1D22" }}
          >
            {showImage ? (
              <img
                src={car.imageUrl}
                alt={car.name}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative">
                {/* Radial glow */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at center, ${carColor}44 0%, transparent 70%)`,
                  }}
                />
                {/* Car illustration */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  {/* Body */}
                  <div
                    className="w-36 h-14 rounded-xl relative"
                    style={{
                      background: `linear-gradient(135deg, ${carColor}ee, ${carColor}88)`,
                      boxShadow: `0 8px 32px ${carColor}55`,
                    }}
                  >
                    {/* Windshield */}
                    <div
                      className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-5 rounded-sm opacity-40"
                      style={{ background: "rgba(255,255,255,0.7)" }}
                    />
                    {/* Doors/details */}
                    <div
                      className="absolute bottom-1 left-3 right-3 h-1 rounded-full opacity-30"
                      style={{ background: "rgba(0,0,0,0.8)" }}
                    />
                  </div>
                  {/* Wheels */}
                  <div className="flex gap-20">
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{
                        background: "#111",
                        border: "3px solid #555",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
                      }}
                    />
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{
                        background: "#111",
                        border: "3px solid #555",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Color name label */}
            <div
              className="absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-bold font-body"
              style={{
                background: `${carColor}cc`,
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {car.color}
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "rgba(0,0,0,0.6)", color: "#F2F2F2" }}
              data-ocid="car-detail.close_button"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2
                  className="text-xl font-black font-display leading-tight"
                  style={{ color: "#F2F2F2" }}
                >
                  {car.name}
                </h2>
                <p
                  className="text-sm font-body mt-0.5"
                  style={{ color: "#B6B6B6" }}
                >
                  {car.model}
                </p>
              </div>
              <Button
                onClick={() => onToggleFavorite(car.id)}
                size="sm"
                className="flex-shrink-0 rounded-full w-10 h-10 p-0"
                style={{
                  background: isFavorite
                    ? "linear-gradient(135deg, #FF3B30, #FF5A1F)"
                    : "rgba(255,255,255,0.08)",
                  border: isFavorite ? "none" : "1px solid rgba(255,59,48,0.3)",
                  color: isFavorite ? "white" : "#B6B6B6",
                }}
                data-ocid="car-detail.toggle"
              >
                <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
              </Button>
            </div>

            {/* Description */}
            {car.description && (
              <p
                className="text-sm font-body leading-relaxed mb-4 pb-4"
                style={{
                  color: "#B6B6B6",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {car.description}
              </p>
            )}

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-2">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="px-3 py-2.5 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="flex items-center gap-1.5 mb-0.5"
                    style={{ color: "#FF3B30" }}
                  >
                    {spec.icon}
                    <span
                      className="text-xs font-semibold font-body uppercase tracking-wide"
                      style={{ color: "#B6B6B6" }}
                    >
                      {spec.label}
                    </span>
                  </div>
                  <p
                    className="text-sm font-semibold font-body truncate"
                    style={{ color: "#F2F2F2" }}
                  >
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="mt-4 flex gap-2 flex-wrap">
              <Badge
                className="font-body"
                style={{
                  background: "linear-gradient(135deg, #FF3B30, #FF5A1F)",
                  color: "white",
                  border: "none",
                }}
              >
                {String(Number(car.year))}
              </Badge>
              <Badge
                className="font-body"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "#B6B6B6",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {car.scale}
              </Badge>
              <Badge
                className="font-body"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#888",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {car.series}
              </Badge>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
