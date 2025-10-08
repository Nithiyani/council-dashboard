// lib/validation.ts
import { z } from "zod";

export const multilingualTextSchema = z.object({
  en: z.string().min(1, "English text is required"),
  ta: z.string().min(1, "Tamil text is required"),
  si: z.string().min(1, "Sinhala text is required"),
});

export const contactInfoSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  address: multilingualTextSchema,
});

export const tenureInfoSchema = z.object({
  startDate: multilingualTextSchema,
  currentTerm: multilingualTextSchema,
});

export const chairmanDataSchema = z.object({
  name: multilingualTextSchema,
  position: multilingualTextSchema,
  photo: z.string().min(1, "Photo is required"),
  message: multilingualTextSchema,
  contact: contactInfoSchema,
  tenure: tenureInfoSchema,
});

export const infoCardItemSchema = z.object({
  id: z.string(),
  title: multilingualTextSchema,
  subtext: multilingualTextSchema.optional(),
});