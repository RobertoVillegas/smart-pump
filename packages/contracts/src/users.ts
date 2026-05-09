import { z } from "zod";

export const userProfileSchema = z.object({
  address: z.string(),
  age: z.number().int().min(0),
  company: z.string(),
  email: z.email(),
  eyeColor: z.string(),
  firstName: z.string(),
  id: z.string(),
  isActive: z.boolean(),
  lastName: z.string(),
  phone: z.string(),
  picture: z.string(),
});

export const balanceResponseSchema = z.object({
  balance: z.string(),
});

export const updateProfileRequestSchema = z
  .object({
    address: z.string().min(1).optional(),
    age: z.number().int().min(0).optional(),
    eyeColor: z.string().min(1).optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
  })
  .strict();

export const updateProfileResponseSchema = z.object({
  user: userProfileSchema,
});

export const userProfileResponseSchema = z.object({
  user: userProfileSchema,
});

export type BalanceResponse = z.infer<typeof balanceResponseSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;
export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;
