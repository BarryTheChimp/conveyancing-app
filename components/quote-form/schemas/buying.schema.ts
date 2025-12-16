import { z } from "zod";

export const purchaseTypeOptions = [
  { value: "standard", label: "Standard Purchase" },
  { value: "auction", label: "Auction" },
  { value: "newBuild", label: "New Build" },
] as const;

export const tenureOptions = [
  { value: "freehold", label: "Freehold" },
  { value: "leasehold", label: "Leasehold" },
] as const;

export const propertyTypeOptions = [
  { value: "house", label: "House" },
  { value: "flat", label: "Flat/Apartment" },
  { value: "bungalow", label: "Bungalow" },
  { value: "maisonette", label: "Maisonette" },
] as const;

export const buyingSchema = z
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

    propertyType: z.enum(["house", "flat", "bungalow", "maisonette"], {
      required_error: "Please select a property type",
    }),

    tenure: z.enum(["freehold", "leasehold"], {
      required_error: "Please select the tenure type",
    }),

    // Purchase Details
    purchaseType: z.enum(["standard", "auction", "newBuild"], {
      required_error: "Please select the purchase type",
    }),

    auctionDate: z.date().optional(),

    isFirstTimeBuyer: z.boolean({
      required_error: "Please indicate if you are a first time buyer",
    }),

    isBuyToLet: z.boolean({
      required_error: "Please indicate if this is a buy to let purchase",
    }),

    // Mortgage Details
    hasMortgage: z.boolean({
      required_error: "Please indicate if you have a mortgage",
    }),

    mortgageLender: z.string().optional(),

    // Additional
    isUsingHelpToBuy: z.boolean().default(false),

    isSharedOwnership: z.boolean().default(false),

    sharedOwnershipPercentage: z
      .number()
      .min(25, "Minimum share is 25%")
      .max(75, "Maximum share is 75%")
      .optional(),

    hasGiftedDeposit: z.boolean().default(false),

    numberOfBuyers: z
      .number()
      .min(1, "At least one buyer required")
      .max(4, "Maximum 4 buyers")
      .default(1),
  })
  .refine(
    (data) => {
      // Auction date required for auction purchases
      if (data.purchaseType === "auction" && !data.auctionDate) {
        return false;
      }
      return true;
    },
    {
      message: "Auction date is required for auction purchases",
      path: ["auctionDate"],
    }
  )
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
  )
  .refine(
    (data) => {
      // Shared ownership percentage required if shared ownership
      if (data.isSharedOwnership && !data.sharedOwnershipPercentage) {
        return false;
      }
      return true;
    },
    {
      message: "Please specify the shared ownership percentage",
      path: ["sharedOwnershipPercentage"],
    }
  );

export type BuyingFormData = z.infer<typeof buyingSchema>;
