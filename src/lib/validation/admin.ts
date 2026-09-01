import { z } from "zod";
import { ORDER_STATUSES } from "@/lib/order-options";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const statusUpdateSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});
