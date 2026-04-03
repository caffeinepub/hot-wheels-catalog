import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { CarInput, HotWheelsCar } from "../types/hotwheels";

interface CarFormProps {
  initialData?: HotWheelsCar;
  onSubmit: (input: CarInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const fieldStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,59,48,0.2)",
  color: "#F2F2F2",
};

const labelStyle = { color: "#B6B6B6" };

export default function CarForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: CarFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [model, setModel] = useState(initialData?.model ?? "");
  const [year, setYear] = useState(
    initialData
      ? String(Number(initialData.year))
      : String(new Date().getFullYear()),
  );
  const [series, setSeries] = useState(initialData?.series ?? "");
  const [scale, setScale] = useState(initialData?.scale ?? "1:64");
  const [color, setColor] = useState(initialData?.color ?? "");
  const [tampo, setTampo] = useState(initialData?.tampo ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [countryOfOrigin, setCountryOfOrigin] = useState(
    initialData?.countryOfOrigin ?? "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!model.trim()) errs.model = "Model is required";
    if (!year.trim() || Number.isNaN(Number(year)))
      errs.year = "Valid year is required";
    if (!series.trim()) errs.series = "Series is required";
    if (!scale.trim()) errs.scale = "Scale is required";
    if (!color.trim()) errs.color = "Color is required";
    if (!countryOfOrigin.trim()) errs.countryOfOrigin = "Country is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const input: CarInput = {
      name: name.trim(),
      model: model.trim(),
      year: BigInt(Number(year.trim())),
      series: series.trim(),
      scale: scale.trim(),
      color: color.trim(),
      tampo: tampo.trim(),
      description: description.trim(),
      countryOfOrigin: countryOfOrigin.trim(),
    };
    await onSubmit(input);
  };

  const fields = [
    {
      id: "name",
      label: "Car Name",
      value: name,
      onChange: setName,
      placeholder: "e.g. '67 Camaro",
      required: true,
    },
    {
      id: "model",
      label: "Model",
      value: model,
      onChange: setModel,
      placeholder: "e.g. Camaro",
      required: true,
    },
    {
      id: "year",
      label: "Year",
      value: year,
      onChange: setYear,
      placeholder: "e.g. 1967",
      type: "number",
      required: true,
    },
    {
      id: "series",
      label: "Series",
      value: series,
      onChange: setSeries,
      placeholder: "e.g. Muscle Mania",
      required: true,
    },
    {
      id: "scale",
      label: "Scale",
      value: scale,
      onChange: setScale,
      placeholder: "e.g. 1:64",
      required: true,
    },
    {
      id: "color",
      label: "Color",
      value: color,
      onChange: setColor,
      placeholder: "e.g. Red",
      required: true,
    },
    {
      id: "tampo",
      label: "Tampo",
      value: tampo,
      onChange: setTampo,
      placeholder: "e.g. Racing stripes",
    },
    {
      id: "countryOfOrigin",
      label: "Country of Origin",
      value: countryOfOrigin,
      onChange: setCountryOfOrigin,
      placeholder: "e.g. USA",
      required: true,
    },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ScrollArea className="max-h-[60vh] pr-4">
        <div className="flex flex-col gap-3 py-1">
          {fields.map((f) => (
            <div key={f.id}>
              <Label
                htmlFor={f.id}
                className="text-xs mb-1 block font-body"
                style={labelStyle}
              >
                {f.label}
                {f.required && <span style={{ color: "#FF3B30" }}> *</span>}
              </Label>
              <Input
                id={f.id}
                type={f.type ?? "text"}
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                placeholder={f.placeholder}
                className="h-9 text-sm font-body"
                style={fieldStyle}
                data-ocid={`admin.${f.id}.input`}
              />
              {errors[f.id] && (
                <p
                  className="text-xs mt-0.5 font-body"
                  style={{ color: "#FF3B30" }}
                  data-ocid={`admin.${f.id}_error`}
                >
                  {errors[f.id]}
                </p>
              )}
            </div>
          ))}

          {/* Description textarea */}
          <div>
            <Label
              htmlFor="description"
              className="text-xs mb-1 block font-body"
              style={labelStyle}
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the car…"
              rows={3}
              className="text-sm font-body resize-none"
              style={fieldStyle}
              data-ocid="admin.description.textarea"
            />
          </div>
        </div>
      </ScrollArea>

      {/* Actions */}
      <div
        className="flex gap-2 pt-4 mt-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="flex-1 font-body"
          style={{ color: "#B6B6B6" }}
          data-ocid="admin.form.cancel_button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 font-body font-semibold"
          style={{
            background: "linear-gradient(135deg, #FF3B30, #FF5A1F)",
            border: "none",
            color: "white",
          }}
          data-ocid="admin.form.submit_button"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : initialData ? (
            "Save Changes"
          ) : (
            "Add Car"
          )}
        </Button>
      </div>
    </form>
  );
}
