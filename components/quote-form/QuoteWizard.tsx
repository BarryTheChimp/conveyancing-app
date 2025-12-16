"use client";

import { useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { StepIndicator } from "./StepIndicator";
import { TransactionTypeStep } from "./steps/TransactionTypeStep";
import { BuyingFormStep } from "./steps/BuyingFormStep";
import { SellingFormStep } from "./steps/SellingFormStep";
import { ContactDetailsStep } from "./steps/ContactDetailsStep";
import { QuoteResult } from "./steps/QuoteResult";

import {
  type QuoteFormData,
  type TransactionType,
  buyingSchema,
  sellingSchema,
  contactSchema,
} from "./schemas";

import { useQuoteSubmission } from "@/hooks/useQuoteSubmission";

type Step = {
  id: string;
  title: string;
  description: string;
};

const ALL_STEPS: Step[] = [
  { id: "transaction", title: "Transaction Type", description: "What would you like to do?" },
  { id: "selling", title: "Selling Details", description: "Tell us about your sale" },
  { id: "buying", title: "Buying Details", description: "Tell us about your purchase" },
  { id: "contact", title: "Contact Details", description: "How can we reach you?" },
];

function getStepsForTransaction(transactionType: TransactionType | null): Step[] {
  if (!transactionType) {
    return [ALL_STEPS[0]]; // Just show transaction type step
  }

  const steps = [ALL_STEPS[0]]; // Always start with transaction type

  if (transactionType === "selling" || transactionType === "both") {
    steps.push(ALL_STEPS[1]); // Selling
  }

  if (transactionType === "buying" || transactionType === "both") {
    steps.push(ALL_STEPS[2]); // Buying
  }

  steps.push(ALL_STEPS[3]); // Contact always last

  return steps;
}

// Dynamic schema based on transaction type
function getSchemaForStep(stepId: string) {
  switch (stepId) {
    case "transaction":
      return z.object({ transactionType: z.enum(["buying", "selling", "both"]) });
    case "buying":
      return z.object({ buying: buyingSchema });
    case "selling":
      return z.object({ selling: sellingSchema });
    case "contact":
      return z.object({ contact: contactSchema });
    default:
      return z.object({});
  }
}

export function QuoteWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [transactionType, setTransactionType] = useState<TransactionType | null>(null);
  const [showResult, setShowResult] = useState(false);

  const { submitQuote, isSubmitting, quoteResult, error, resetQuote } = useQuoteSubmission();

  const form = useForm<QuoteFormData>({
    mode: "onChange",
    defaultValues: {
      transactionType: undefined,
      buying: undefined,
      selling: undefined,
      contact: {
        marketingConsent: false,
        termsAccepted: false,
      },
    },
  });

  const steps = getStepsForTransaction(transactionType);
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleTransactionTypeChange = useCallback((type: TransactionType) => {
    setTransactionType(type);
    form.setValue("transactionType", type);
  }, [form]);

  const validateCurrentStep = async (): Promise<boolean> => {
    const schema = getSchemaForStep(currentStep.id);
    const values = form.getValues();

    try {
      let dataToValidate: Record<string, unknown> = {};

      switch (currentStep.id) {
        case "transaction":
          dataToValidate = { transactionType: values.transactionType };
          break;
        case "buying":
          dataToValidate = { buying: values.buying };
          break;
        case "selling":
          dataToValidate = { selling: values.selling };
          break;
        case "contact":
          dataToValidate = { contact: values.contact };
          break;
      }

      schema.parse(dataToValidate);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Trigger form validation to show errors
        if (currentStep.id === "buying") {
          await form.trigger("buying");
        } else if (currentStep.id === "selling") {
          await form.trigger("selling");
        } else if (currentStep.id === "contact") {
          await form.trigger("contact");
        } else if (currentStep.id === "transaction") {
          await form.trigger("transactionType");
        }
      }
      return false;
    }
  };

  const goToNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    if (isLastStep) {
      // Submit the form
      const values = form.getValues();
      await submitQuote(values);
      setShowResult(true);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const startOver = () => {
    form.reset();
    setTransactionType(null);
    setCurrentStepIndex(0);
    setShowResult(false);
    resetQuote();
  };

  if (showResult) {
    return (
      <QuoteResult
        result={quoteResult}
        error={error}
        formData={form.getValues()}
        onStartOver={startOver}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <StepIndicator steps={steps} currentStepIndex={currentStepIndex} />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{currentStep.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{currentStep.description}</p>
        </CardHeader>

        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={(e) => e.preventDefault()}>
              {currentStep.id === "transaction" && (
                <TransactionTypeStep
                  value={transactionType}
                  onChange={handleTransactionTypeChange}
                />
              )}

              {currentStep.id === "buying" && <BuyingFormStep />}

              {currentStep.id === "selling" && <SellingFormStep />}

              {currentStep.id === "contact" && <ContactDetailsStep />}

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={isFirstStep}
                >
                  Previous
                </Button>

                <Button
                  type="button"
                  onClick={goToNextStep}
                  disabled={isSubmitting || (currentStep.id === "transaction" && !transactionType)}
                >
                  {isSubmitting
                    ? "Getting Quote..."
                    : isLastStep
                    ? "Get My Quote"
                    : "Continue"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
