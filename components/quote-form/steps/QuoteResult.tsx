"use client";

import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuoteFormData } from "../schemas";

interface QuoteResultData {
  totalFee: number;
  legalFees: number;
  disbursements: number;
  stampDuty?: number;
  breakdown: {
    description: string;
    amount: number;
  }[];
}

interface QuoteResultProps {
  result: QuoteResultData | null;
  error: string | null;
  formData: QuoteFormData;
  onStartOver: () => void;
}

export function QuoteResult({
  result,
  error,
  formData,
  onStartOver,
}: QuoteResultProps) {
  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <XCircle className="h-6 w-6" />
            <CardTitle>Unable to Generate Quote</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={onStartOver} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Start Over
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
            <CardTitle>Your Quote</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div className="text-center py-6 bg-accent rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">
              Estimated Total Cost
            </p>
            <p className="text-4xl font-bold text-primary">
              {formatCurrency(result.totalFee)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Including VAT and disbursements
            </p>
          </div>

          {/* Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold">Cost Breakdown</h3>

            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span>Legal Fees</span>
                <span className="font-medium">
                  {formatCurrency(result.legalFees)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span>Disbursements</span>
                <span className="font-medium">
                  {formatCurrency(result.disbursements)}
                </span>
              </div>

              {result.stampDuty !== undefined && result.stampDuty > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span>Stamp Duty (SDLT)</span>
                  <span className="font-medium">
                    {formatCurrency(result.stampDuty)}
                  </span>
                </div>
              )}
            </div>

            {/* Detailed breakdown */}
            {result.breakdown.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-primary hover:underline">
                  View detailed breakdown
                </summary>
                <div className="mt-2 pl-4 space-y-1 text-sm text-muted-foreground">
                  {result.breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.description}</span>
                      <span>{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>

          {/* Transaction summary */}
          <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
            <h4 className="font-medium mb-2">Quote for:</h4>
            <ul className="space-y-1 text-muted-foreground">
              {formData.transactionType === "both" && (
                <li>Sale and Purchase</li>
              )}
              {formData.transactionType === "buying" && <li>Purchase only</li>}
              {formData.transactionType === "selling" && <li>Sale only</li>}

              {formData.buying && (
                <li>
                  Purchasing at {formatCurrency(formData.buying.propertyPrice)}
                </li>
              )}
              {formData.selling && (
                <li>
                  Selling at {formatCurrency(formData.selling.propertyPrice)}
                </li>
              )}
            </ul>
          </div>

          {/* Contact info */}
          <div className="text-center pt-4 border-t">
            <p className="text-muted-foreground text-sm">
              We'll send a copy of this quote to{" "}
              <strong>{formData.contact.email}</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button onClick={onStartOver} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Get Another Quote
        </Button>

        <Button>Proceed with Instruction</Button>
      </div>
    </div>
  );
}
