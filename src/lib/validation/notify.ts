import { z } from "zod";

export const notifySignupSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

export type NotifySignupValues = z.infer<typeof notifySignupSchema>;
