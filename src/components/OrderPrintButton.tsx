import { Button } from "@/components/ui/button";

import React from "react";
import { Printer } from "lucide-react";

export const OrderPrintButton: React.FC = () => {
  return (
    <Button variant="atelier"
      onClick={() => window.print()}
      className="w-full py-3 bg-muted hover:bg-secondary text-foreground text-xs font-semibold uppercase tracking-widest border border-border rounded flex items-center justify-center gap-2 transition-colors"
    >
      <Printer className="w-4 h-4 text-primary" />
      <span>Print Atelier Commission Receipt</span>
    </Button>
  );
};
