import { Heart } from "lucide-react";
import { motion } from "motion/react";
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

const CURRENT_YEAR = new Date().getFullYear();

interface CarCardProps {
  car: HotWheelsCar;
  isFavorite: boolean;
  onToggleFavorite: (id: bigint) => void;
  onClick: () => void;
  index: number;
}

export default function CarCard({
  car,
  isFavorite,
  onToggleFavorite,
  onClick,
  index,
}: CarCardProps) {
  const [imgError, setImgError] = useState(false);
  const carYear = Number(car.year);
  const isNew = carYear >= CURRENT_YEAR - 2;
  const carColor = getCarColor(car.color);
  const showImage = !!car.imageUrl && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="relative rounded-xl overflow-hidden cursor-pointer group"
      style={{
        background:
          "linear-gradient(135deg, #E6E6E6 0%, #BFC0C2 60%, #8A8B8E 100%)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
      }}
      onClick={onClick}
      whileHover={{ scale: 1.02, boxShadow: "0 6px 24px rgba(255,59,48,0.2)" }}
      whileTap={{ scale: 0.98 }}
      data-ocid={`catalog.item.${index}`}
    >
      {/* Year badge */}
      <div
        className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-xs font-bold font-body"
        style={{ background: "rgba(0,0,0,0.65)", color: "#F2F2F2" }}
      >
        {carYear}
      </div>

      {/* NEW badge */}
      {isNew && (
        <div
          className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-xs font-bold font-display"
          style={{
            background: "linear-gradient(135deg, #FF3B30, #FF5A1F)",
            color: "white",
          }}
        >
          NEW
        </div>
      )}

      {/* Car image or CSS illustration fallback */}
      <div
        className="w-full h-28 relative overflow-hidden"
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
            <div
              className="w-16 h-16 rounded-full opacity-60 blur-xl absolute"
              style={{ background: carColor }}
            />
            {/* Car body */}
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className="w-20 h-8 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${carColor}ee, ${carColor}88)`,
                  boxShadow: `0 4px 16px ${carColor}55`,
                }}
              />
              {/* Windshield highlight */}
              <div
                className="absolute top-0.5 left-1/2 -translate-x-1/2 w-10 h-3 rounded-sm opacity-40"
                style={{ background: "rgba(255,255,255,0.6)" }}
              />
              {/* Wheels */}
              <div className="flex gap-12 mt-0.5">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ background: "#111", border: "2px solid #555" }}
                />
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ background: "#111", border: "2px solid #555" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card info */}
      <div
        className="px-3 py-2.5"
        style={{ background: "rgba(17,18,23,0.85)" }}
      >
        <p
          className="text-xs font-black font-display leading-tight truncate"
          style={{ color: "#F2F2F2" }}
          title={car.name}
        >
          {car.name}
        </p>
        <p
          className="text-xs truncate mt-0.5 font-body"
          style={{ color: "#B6B6B6" }}
        >
          {car.series}
        </p>
      </div>

      {/* Favorite button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(car.id);
        }}
        className="absolute bottom-2 right-2 p-1 rounded-full transition-all"
        style={{
          background: isFavorite ? "rgba(255,59,48,0.9)" : "rgba(0,0,0,0.5)",
          color: isFavorite ? "white" : "#B6B6B6",
        }}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        data-ocid={`catalog.toggle.${index}`}
      >
        <Heart size={12} fill={isFavorite ? "currentColor" : "none"} />
      </button>
    </motion.div>
  );
}
