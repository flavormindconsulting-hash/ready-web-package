
import React from "react";
import { Printer } from "lucide-react";

export const OrderPrintButton: React.FC = () => {
  return (
    <button
      onClick={() => window.print()}
      className="w-full py-3 bg-neutral-900 hover:bg-neutral-850 text-neutral-200 text-xs font-semibold uppercase tracking-widest border border-neutral-700 rounded flex items-center justify-center gap-2 transition-colors"
    >
      <Printer className="w-4 h-4 text-amber-300" />
      <span>Print Atelier Commission Receipt</span>
    </button>
  );
};
