import { Button } from "@/components/ui/button";

import React, { useState } from "react";
import { X, Sparkles, Check } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [heightVal, setHeightVal] = useState<string>("5'10\"");
  const [weightVal, setWeightVal] = useState<string>("165");
  const [fitPreference, setFitPreference] = useState<"tailored" | "relaxed">("tailored");
  const [predictedSize, setPredictedSize] = useState<string | null>(null);

  if (!isOpen) return null;

  // Chart data
  const measurementsInches = [
    { size: "S", chest: "38 - 40", neck: "15.0", sleeve: "33.5", length: "29.5" },
    { size: "M", chest: "40 - 42", neck: "15.75", sleeve: "34.5", length: "30.0" },
    { size: "L", chest: "42 - 44", neck: "16.5", sleeve: "35.5", length: "30.5" },
    { size: "XL", chest: "44 - 47", neck: "17.25", sleeve: "36.25", length: "31.25" },
    { size: "XXL", chest: "47 - 50", neck: "18.0", sleeve: "37.0", length: "32.0" },
  ];

  const measurementsCm = [
    { size: "S", chest: "96 - 101", neck: "38.0", sleeve: "85.0", length: "75.0" },
    { size: "M", chest: "101 - 107", neck: "40.0", sleeve: "87.5", length: "76.5" },
    { size: "L", chest: "107 - 112", neck: "42.0", sleeve: "90.0", length: "77.5" },
    { size: "XL", chest: "112 - 119", neck: "44.0", sleeve: "92.0", length: "79.5" },
    { size: "XXL", chest: "119 - 127", neck: "45.7", sleeve: "94.0", length: "81.0" },
  ];

  const currentData = unit === "in" ? measurementsInches : measurementsCm;

  const handleCalculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weightVal) || 165;
    let base = "M";
    if (weightNum < 145) base = "S";
    else if (weightNum <= 170) base = "M";
    else if (weightNum <= 195) base = "L";
    else if (weightNum <= 220) base = "XL";
    else base = "XXL";

    if (fitPreference === "relaxed" && base === "S") base = "M";
    setPredictedSize(base);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-overlay/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-background border border-border text-foreground shadow-2xl p-6 sm:p-8 rounded-sm z-10 animate-fade-in my-8">
        <Button variant="atelier"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground"
          aria-label="Close size guide"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="text-center pb-4 border-b border-border">
          <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-mono">
            HENRO SARTORIAL ATELIER
          </span>
          <h2 className="text-xl sm:text-2xl font-editorial tracking-wider uppercase mt-1">
            Size & Fit Architecture
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Our shirts are engineered with an Italian v-taper silhouette, sculpted back darts, and relaxed armholes for effortless mobility.
          </p>
        </div>

        {/* Unit Toggle */}
        <div className="flex flex-wrap gap-3 justify-between items-center mt-6 mb-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Measurements</span>
          <div className="flex border border-border rounded bg-muted p-0.5 text-xs font-mono">
            <Button variant="atelier"
              onClick={() => setUnit("in")}
              className={`px-3 py-1 rounded transition-colors ${
                unit === "in" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              INCHES
            </Button>
            <Button variant="atelier"
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 rounded transition-colors ${
                unit === "cm" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              CENTIMETERS
            </Button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto border border-border rounded">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground uppercase font-mono tracking-wider border-b border-border">
              <tr>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Chest ({unit})</th>
                <th className="py-2.5 px-3">Collar / Neck</th>
                <th className="py-2.5 px-3">Sleeve</th>
                <th className="py-2.5 px-3">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-foreground">
              {currentData.map((row) => (
                <tr key={row.size} className="hover:bg-muted/50">
                  <td className="py-2.5 px-3 font-semibold text-foreground">{row.size}</td>
                  <td className="py-2.5 px-3">{row.chest}</td>
                  <td className="py-2.5 px-3">{row.neck}</td>
                  <td className="py-2.5 px-3">{row.sleeve}</td>
                  <td className="py-2.5 px-3">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Interactive Fit Predictor */}
        <div className="mt-6 p-4 sm:p-5 bg-muted/70 border border-border rounded">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Interactive Fit Predictor
            </h3>
          </div>

          <form onSubmit={handleCalculateSize} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Your Approx. Weight (lbs)
              </label>
              <input
                type="number"
                value={weightVal}
                onChange={(e) => setWeightVal(e.target.value)}
                placeholder="165"
                className="w-full bg-background border border-border rounded px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Fit Silhouette
              </label>
              <select
                value={fitPreference}
                onChange={(e) => setFitPreference(e.target.value as "tailored" | "relaxed")}
                className="w-full bg-background border border-border rounded px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
              >
                <option value="tailored">Tailored / Sharp</option>
                <option value="relaxed">Relaxed / Casual</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="atelier"
                type="submit"
                className="w-full py-2 bg-primary hover:bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                Find Recommended Size
              </Button>
            </div>
          </form>

          {predictedSize && (
            <div className="mt-3 p-3 bg-background border border-primary/60 rounded flex items-center justify-between">
              <div className="text-xs">
                <span className="text-muted-foreground">Recommended Henro Size:</span>{" "}
                <strong className="text-primary text-sm font-mono font-bold ml-1">
                  Size {predictedSize}
                </strong>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Calculated based on {fitPreference} drape guarantee with 7-day free sizing exchange.
                </p>
              </div>
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
            </div>
          )}
        </div>

        {/* Measure guidance */}
        <div className="mt-4 pt-4 border-t border-border text-[11px] text-muted-foreground flex flex-wrap gap-4 justify-between">
          <span>• Chest: Measure around the fullest part under armpits</span>
          <span>• Sleeve: Measure from center back neck across shoulder to wrist</span>
          <span>• Free exchanges on all first shirt purchases</span>
        </div>
      </div>
    </div>
  );
};
