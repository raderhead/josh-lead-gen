
import * as z from "zod";

export const formSchema = z.object({
  // Contact information (new required fields)
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  // Property location
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State is required.",
  }),
  zip: z.string().length(5, {
    message: "ZIP code must be 5 digits.",
  }),
  sqft: z.string().optional(),
  propertyType: z.string({
    required_error: "Please select a property type.",
  }),
  propertyCondition: z.string({
    required_error: "Please select the property condition.",
  }),
  acres: z.string().optional(),
  // Commercial property features
  isCornerLot: z.boolean().default(false),
  hasParkingLot: z.boolean().default(false),
  hasLoadingDock: z.boolean().default(false),
  recentRenovations: z.boolean().default(false),
  // Land-specific features
  hasWater: z.boolean().default(false),
  hasRoad: z.boolean().default(false),
  isLevelLot: z.boolean().default(false),
  hasMountainView: z.boolean().default(false),
});

export type FormValues = z.infer<typeof formSchema>;
