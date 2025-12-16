"use client";

import { Home, ArrowRightLeft, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransactionType } from "../schemas";

interface TransactionTypeStepProps {
  value: TransactionType | null;
  onChange: (type: TransactionType) => void;
}

const transactionOptions = [
  {
    value: "buying" as const,
    label: "Buying",
    description: "I'm purchasing a property",
    icon: Home,
  },
  {
    value: "selling" as const,
    label: "Selling",
    description: "I'm selling a property",
    icon: Building2,
  },
  {
    value: "both" as const,
    label: "Both",
    description: "I'm buying and selling",
    icon: ArrowRightLeft,
  },
];

export function TransactionTypeStep({ value, onChange }: TransactionTypeStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-6">
        Select the type of transaction you need a quote for. We'll tailor the
        questions based on your needs.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {transactionOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "flex flex-col items-center p-6 rounded-lg border-2 transition-all",
                "hover:border-primary hover:bg-accent",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isSelected
                  ? "border-primary bg-accent"
                  : "border-border bg-background"
              )}
            >
              <Icon
                className={cn(
                  "h-8 w-8 mb-3",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "font-semibold",
                  isSelected ? "text-primary" : "text-foreground"
                )}
              >
                {option.label}
              </span>
              <span className="text-xs text-muted-foreground mt-1 text-center">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
