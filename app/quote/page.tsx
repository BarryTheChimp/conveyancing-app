import { QuoteWizard } from "@/components/quote-form/QuoteWizard";

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Get Your Conveyancing Quote
          </h1>
          <p className="text-muted-foreground mt-2">
            Answer a few questions to receive an instant, no-obligation quote
          </p>
        </div>

        <QuoteWizard />
      </div>
    </main>
  );
}
