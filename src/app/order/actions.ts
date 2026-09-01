"use server";

import {
  orderFormSchema,
  MAX_IMAGE_SIZE_BYTES,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_COUNT,
} from "@/lib/validation/order";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { sendCustomerConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email";

export type SubmitOrderState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitOrder(
  _prevState: SubmitOrderState,
  formData: FormData,
): Promise<SubmitOrderState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = orderFormSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  const imageFiles = formData
    .getAll("referenceImages")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (imageFiles.length > MAX_IMAGE_COUNT) {
    return {
      status: "error",
      message: `Please upload at most ${MAX_IMAGE_COUNT} reference images.`,
    };
  }

  for (const file of imageFiles) {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return { status: "error", message: `${file.name} is too large — max 5MB per image.` };
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { status: "error", message: `${file.name} isn't a supported image type.` };
    }
  }

  const supabase = createPublicSupabaseClient();

  const imagePaths: string[] = [];
  for (const file of imageFiles) {
    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("order-references")
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      console.error("Reference image upload failed:", uploadError);
      return {
        status: "error",
        message: "We couldn't upload your reference images. Please try again.",
      };
    }
    imagePaths.push(path);
  }

  // No .select() chained on this insert — customers correctly have no
  // SELECT policy on `orders`, and requesting the row back would make
  // the whole insert fail. See supabase/schema.sql for the full story.
  const { error: insertError } = await supabase.from("orders").insert({
    occasion: data.occasion,
    event_date: data.eventDate,
    cake_type: data.cakeType,
    servings: data.servings,
    flavors: data.flavors,
    filling: data.filling || null,
    design_description: data.designDescription,
    reference_image_urls: imagePaths.length > 0 ? imagePaths : null,
    color_palette: data.colorPalette || null,
    dietary_notes: data.dietaryNotes || null,
    delivery_type: data.deliveryType,
    delivery_address: data.deliveryAddress || null,
    budget_range: data.budgetRange || null,
    customer_name: data.customerName,
    email: data.email,
    phone: data.phone || null,
    referral_source: data.referralSource || null,
  });

  if (insertError) {
    console.error("Order insert failed:", insertError);
    return {
      status: "error",
      message: "Something went wrong submitting your order. Please try again.",
    };
  }

  const emailDetails = {
    customerName: data.customerName,
    email: data.email,
    occasion: data.occasion,
    eventDate: data.eventDate,
  };

  // Best-effort — a failed email must never undo a successfully
  // submitted order.
  await Promise.allSettled([
    sendCustomerConfirmationEmail(emailDetails),
    sendAdminNotificationEmail(emailDetails),
  ]);

  return { status: "success" };
}
