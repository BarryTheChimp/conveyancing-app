import { z } from "zod";
import { buyingSchema, type BuyingFormData } from "./buying.schema";
import { sellingSchema, type SellingFormData } from "./selling.schema";
import { contactSchema, type ContactFormData } from "./contact.schema";

export const transactionTypeSchema = z.enum(["buying", "selling", "both"], {
  required_error: "Please select a transaction type",
});

export type TransactionType = z.infer<typeof transactionTypeSchema>;

// Full quote form data combining all schemas
export interface QuoteFormData {
  transactionType: TransactionType;
  buying?: BuyingFormData;
  selling?: SellingFormData;
  contact: ContactFormData;
}

// Re-export everything
export { buyingSchema, sellingSchema, contactSchema };
export type { BuyingFormData, SellingFormData, ContactFormData };
