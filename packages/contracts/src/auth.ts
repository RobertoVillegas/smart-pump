import { z } from "zod";

export const loginRequestSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const sessionUserSchema = z.object({
  email: z.email(),
  firstName: z.string(),
  id: z.string(),
  isActive: z.boolean(),
  lastName: z.string(),
});

export const loginResponseSchema = z.object({
  user: sessionUserSchema,
});

export const sessionResponseSchema = z.object({
  authenticated: z.boolean(),
  user: sessionUserSchema.nullable(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
export type SessionUser = z.infer<typeof sessionUserSchema>;
