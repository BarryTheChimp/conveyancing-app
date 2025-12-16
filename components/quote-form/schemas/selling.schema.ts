import { z } from "zod";

export const sellingSchema = z
  .object({
    // Property Details
    propertyPrice: z
      .number({ required_error: "Property price is required" })
      .min(1, "Property price must be greater than 0"),

    propertyAddress: z
      .string({ required_error: "Property address is required" })
      .min(5, "Please enter a valid address"),

    propertyPostcode: z
      .string({ required_error: "Postcode is required" })
      .regex(
        /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
        "Please enter a valid UK postcode"
      ),

    tenure: z.enum(["freehold", "leasehold"], {
      required_error: "Please select the tenure type",
    }),

    // Sale Details
    hasMortgage: z.boolean({
      required_error: "Please indicate if you have a mortgage to pay off",
    }),

    mortgageLender: z.string().optional(),

    numberOfSellers: z
      .number()
      .min(1, "At least one seller required")
      .max(4, "Maximum 4 sellers")
      .default(1),
  })
  .refine(
    (data) => {
      // Mortgage lender required if has mortgage
      if (data.hasMortgage && !data.mortgageLender) {
        return false;
      }
      return true;
    },
    {
      message: "Please specify your mortgage lender",
      path: ["mortgageLender"],
    }
  );

export type SellingFormData = z.infer<typeof sellingSchema>;
