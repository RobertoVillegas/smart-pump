import { isValidPhoneNumber } from "libphonenumber-js/min";
import { z } from "zod";

const phoneNumberSchema = z
  .string()
  .trim()
  .min(1, "Enter a phone number.")
  .refine(isValidPhoneNumber, "Enter a valid phone number.");

export const userProfileSchema = z.object({
  address: z.string(),
  age: z
    .number("Enter a valid number.")
    .int("Enter a whole number.")
    .min(0, "Enter a positive number."),
  company: z.string(),
  email: z.email(),
  eyeColor: z.string(),
  firstName: z.string(),
  id: z.string(),
  isActive: z.boolean(),
  lastName: z.string(),
  phone: phoneNumberSchema,
  picture: z.string(),
});

export const balanceResponseSchema = z.object({
  balance: z.string(),
});

export const updateProfileRequestSchema = z
  .object({
    address: z.string().trim().min(1, "Enter an address.").optional(),
    age: z
      .number("Enter a valid number.")
      .int("Enter a whole number.")
      .min(0, "Enter a positive number.")
      .optional(),
    email: z.email("Enter a valid email address.").optional(),
    eyeColor: z.string().trim().min(1, "Enter an eye color.").optional(),
    firstName: z.string().trim().min(1, "Enter a first name.").optional(),
    lastName: z.string().trim().min(1, "Enter a last name.").optional(),
    phone: phoneNumberSchema.optional(),
  })
  .strict();

export const updateProfileResponseSchema = z.object({
  user: userProfileSchema,
});

export const changePasswordRequestSchema = z
  .object({
    confirmPassword: z.string().min(1, "Confirm your new password."),
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters."),
  })
  .refine((input) => input.newPassword === input.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

export const changePasswordResponseSchema = z.object({
  success: z.literal(true),
});

export const userProfileResponseSchema = z.object({
  user: userProfileSchema,
});

export type BalanceResponse = z.infer<typeof balanceResponseSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;
export type ChangePasswordResponse = z.infer<
  typeof changePasswordResponseSchema
>;
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;
export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;
