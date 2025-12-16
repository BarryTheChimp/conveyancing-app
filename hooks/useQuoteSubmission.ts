"use client";

import { useState, useCallback } from "react";
import type { QuoteFormData } from "@/components/quote-form/schemas";

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

interface UseQuoteSubmissionReturn {
  submitQuote: (data: QuoteFormData) => Promise<void>;
  isSubmitting: boolean;
  quoteResult: QuoteResultData | null;
  error: string | null;
  resetQuote: () => void;
}

// Transform form data to API payload
function transformToApiPayload(data: QuoteFormData) {
  const payload: Record<string, unknown> = {
    transactionType: data.transactionType,
    contact: {
      firstName: data.contact.firstName,
      lastName: data.contact.lastName,
      email: data.contact.email,
      phone: data.contact.phone,
      preferredContactMethod: data.contact.preferredContactMethod,
      bestTimeToCall: data.contact.bestTimeToCall,
      marketingConsent: data.contact.marketingConsent,
    },
  };

  if (data.buying) {
    payload.purchase = {
      propertyPrice: data.buying.propertyPrice,
      propertyAddress: data.buying.propertyAddress,
      propertyPostcode: data.buying.propertyPostcode,
      propertyType: data.buying.propertyType,
      tenure: data.buying.tenure,
      purchaseType: data.buying.purchaseType,
      auctionDate: data.buying.auctionDate?.toISOString(),
      isFirstTimeBuyer: data.buying.isFirstTimeBuyer,
      isBuyToLet: data.buying.isBuyToLet,
      hasMortgage: data.buying.hasMortgage,
      mortgageLender: data.buying.mortgageLender,
      isUsingHelpToBuy: data.buying.isUsingHelpToBuy,
      isSharedOwnership: data.buying.isSharedOwnership,
      sharedOwnershipPercentage: data.buying.sharedOwnershipPercentage,
      hasGiftedDeposit: data.buying.hasGiftedDeposit,
      numberOfBuyers: data.buying.numberOfBuyers,
    };
  }

  if (data.selling) {
    payload.sale = {
      propertyPrice: data.selling.propertyPrice,
      propertyAddress: data.selling.propertyAddress,
      propertyPostcode: data.selling.propertyPostcode,
      tenure: data.selling.tenure,
      hasMortgage: data.selling.hasMortgage,
      mortgageLender: data.selling.mortgageLender,
      numberOfSellers: data.selling.numberOfSellers,
    };
  }

  return payload;
}

export function useQuoteSubmission(): UseQuoteSubmissionReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteResult, setQuoteResult] = useState<QuoteResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitQuote = useCallback(async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = transformToApiPayload(data);

      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to get quote: ${response.status}`
        );
      }

      const result = await response.json();
      setQuoteResult(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const resetQuote = useCallback(() => {
    setQuoteResult(null);
    setError(null);
  }, []);

  return {
    submitQuote,
    isSubmitting,
    quoteResult,
    error,
    resetQuote,
  };
}
