import { z } from "zod";

export const contactSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string({ required_error: "Last name is required" })
    .min(2, "Last name must be at least 2 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),

  phone: z
    .string({ required_error: "Phone number is required" })
    .regex(
      /^(?:(?:\+44)|(?:0))(?:\d\s?){9,10}$/,
      "Please enter a valid UK phone number"
    ),

  preferredContactMethod: z.enum(["email", "phone", "either"], {
    required_error: "Please select your preferred contact method",
  }),

  bestTimeToCall: z.enum(["morning", "afternoon", "evening", "anytime"]).optional(),

  marketingConsent: z.boolean().default(false),

  termsAccepted: z
    .boolean({ required_error: "You must accept the terms and conditions" })
    .refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
