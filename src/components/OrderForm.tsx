"use client";

import { useActionState, useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { submitOrder, type SubmitOrderState } from "@/app/order/actions";
import { isShortNotice, MAX_IMAGE_COUNT, MIN_LEAD_TIME_DAYS } from "@/lib/validation/order";
import {
  ORDER_OCCASIONS,
  CAKE_TYPES,
  SERVINGS_RANGES,
  DELIVERY_TYPES,
  BUDGET_RANGES,
  REFERRAL_SOURCES,
} from "@/lib/order-options";

const initialState: SubmitOrderState = { status: "idle" };

type FormValues = {
  occasion: string;
  eventDate: string;
  cakeType: string;
  servings: string;
  flavors: string;
  filling: string;
  designDescription: string;
  colorPalette: string;
  dietaryNotes: string;
  deliveryType: string;
  deliveryAddress: string;
  budgetRange: string;
  customerName: string;
  email: string;
  phone: string;
  referralSource: string;
};

const emptyValues: FormValues = {
  occasion: "",
  eventDate: "",
  cakeType: "",
  servings: "",
  flavors: "",
  filling: "",
  designDescription: "",
  colorPalette: "",
  dietaryNotes: "",
  deliveryType: "Delivery",
  deliveryAddress: "",
  budgetRange: "",
  customerName: "",
  email: "",
  phone: "",
  referralSource: "",
};

const inputClasses =
  "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent-deep focus:outline-none focus:ring-2 focus:ring-accent-deep/30";
const labelClasses = "text-sm font-medium text-heading";

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className={labelClasses}>
        {label} {required && <span className="text-accent-deep">*</span>}
      </span>
      {children}
      {error && <span className="text-xs text-accent-deep">{error}</span>}
    </label>
  );
}

export function OrderForm() {
  const [state, formAction, isPending] = useActionState(submitOrder, initialState);
  // Every field is controlled from this one object. React 19 resets a
  // form's uncontrolled fields after a Server Action runs — including on
  // a validation error — so without this, a customer who mistypes one
  // field would lose everything else they'd already filled in.
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [imagePreviews, setImagePreviews] = useState<{ url: string; name: string }[]>([]);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setImagePreviews(files.map((file) => ({ url: URL.createObjectURL(file), name: file.name })));
  }

  // Object URLs are only good for this tab's session — revoke the
  // previous set whenever it's replaced, and on unmount, so previewing
  // large images doesn't quietly leak memory.
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-10 text-center">
        <h2 className="font-display text-2xl font-semibold text-heading">
          Thanks — your request is in!
        </h2>
        <p className="max-w-md text-muted">
          Jordyn will follow up by email soon to confirm details and provide a quote. You
          should also receive a confirmation email shortly.
        </p>
      </div>
    );
  }

  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {state.status === "error" && state.message && (
        <p className="rounded-lg bg-accent-tint px-4 py-3 text-sm text-accent-deep">
          {state.message}
        </p>
      )}

      <fieldset className="flex flex-col gap-4">
        <legend className="font-display text-lg font-semibold text-heading">
          Occasion &amp; date
        </legend>
        <p className="text-sm text-muted">
          Orders need at least {MIN_LEAD_TIME_DAYS / 7} weeks&apos; notice.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Occasion" required error={errors.occasion}>
            <select
              name="occasion"
              required
              value={values.occasion}
              onChange={(event) => update("occasion", event.target.value)}
              className={inputClasses}
            >
              <option value="" disabled>
                Choose an occasion
              </option>
              {ORDER_OCCASIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Event date" required error={errors.eventDate}>
            <input
              type="date"
              name="eventDate"
              required
              value={values.eventDate}
              onChange={(event) => update("eventDate", event.target.value)}
              className={inputClasses}
            />
          </Field>
        </div>
        {values.eventDate && isShortNotice(values.eventDate) && (
          <p className="text-xs text-accent-deep">
            That&apos;s less than {MIN_LEAD_TIME_DAYS / 7} weeks away — we&apos;ll do our
            best, but please reach out directly if it&apos;s urgent.
          </p>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="font-display text-lg font-semibold text-heading">
          Cake details
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Cake or cupcakes" required error={errors.cakeType}>
            <select
              name="cakeType"
              required
              value={values.cakeType}
              onChange={(event) => update("cakeType", event.target.value)}
              className={inputClasses}
            >
              <option value="" disabled>
                Choose one
              </option>
              {CAKE_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Servings" required error={errors.servings}>
            <select
              name="servings"
              required
              value={values.servings}
              onChange={(event) => update("servings", event.target.value)}
              className={inputClasses}
            >
              <option value="" disabled>
                Choose a size
              </option>
              {SERVINGS_RANGES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Flavor(s)" required error={errors.flavors}>
          <input
            type="text"
            name="flavors"
            required
            placeholder="e.g. vanilla with raspberry filling"
            value={values.flavors}
            onChange={(event) => update("flavors", event.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Filling / frosting preference" error={errors.filling}>
          <input
            type="text"
            name="filling"
            value={values.filling}
            onChange={(event) => update("filling", event.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Dietary restrictions or allergies" error={errors.dietaryNotes}>
          <input
            type="text"
            name="dietaryNotes"
            value={values.dietaryNotes}
            onChange={(event) => update("dietaryNotes", event.target.value)}
            className={inputClasses}
          />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="font-display text-lg font-semibold text-heading">
          Design &amp; inspiration
        </legend>
        <Field label="Tell us your vision" required error={errors.designDescription}>
          <textarea
            name="designDescription"
            required
            rows={4}
            placeholder="Describe the design, theme, or inspiration for your cake"
            value={values.designDescription}
            onChange={(event) => update("designDescription", event.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Color palette" error={errors.colorPalette}>
          <input
            type="text"
            name="colorPalette"
            value={values.colorPalette}
            onChange={(event) => update("colorPalette", event.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label={`Reference images (up to ${MAX_IMAGE_COUNT}, 5MB each)`}>
          <input
            type="file"
            name="referenceImages"
            accept="image/jpeg,image/png,image/webp,image/heic"
            multiple
            onChange={handleImageChange}
            className="text-sm text-muted"
          />
          {imagePreviews.length > MAX_IMAGE_COUNT && (
            <p className="text-xs text-accent-deep">
              That&apos;s {imagePreviews.length} images — please select at most{" "}
              {MAX_IMAGE_COUNT}.
            </p>
          )}
          {imagePreviews.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3">
              {imagePreviews.map((preview) => (
                <div key={preview.url} className="flex flex-col items-center gap-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="h-20 w-20 rounded-lg border border-border object-cover"
                  />
                  <span className="max-w-20 truncate text-xs text-muted" title={preview.name}>
                    {preview.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="font-display text-lg font-semibold text-heading">Delivery</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Delivery or pickup" required error={errors.deliveryType}>
            <select
              name="deliveryType"
              required
              value={values.deliveryType}
              onChange={(event) => update("deliveryType", event.target.value)}
              className={inputClasses}
            >
              {DELIVERY_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Budget range" error={errors.budgetRange}>
            <select
              name="budgetRange"
              value={values.budgetRange}
              onChange={(event) => update("budgetRange", event.target.value)}
              className={inputClasses}
            >
              <option value="">Prefer not to say</option>
              {BUDGET_RANGES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>
        {values.deliveryType === "Delivery" && (
          <Field label="Delivery address" required error={errors.deliveryAddress}>
            <input
              type="text"
              name="deliveryAddress"
              required
              value={values.deliveryAddress}
              onChange={(event) => update("deliveryAddress", event.target.value)}
              className={inputClasses}
            />
          </Field>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="font-display text-lg font-semibold text-heading">Your info</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required error={errors.customerName}>
            <input
              type="text"
              name="customerName"
              required
              value={values.customerName}
              onChange={(event) => update("customerName", event.target.value)}
              className={inputClasses}
            />
          </Field>
          <Field label="Email" required error={errors.email}>
            <input
              type="email"
              name="email"
              required
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              className={inputClasses}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" error={errors.phone}>
            <input
              type="tel"
              name="phone"
              value={values.phone}
              onChange={(event) => update("phone", event.target.value)}
              className={inputClasses}
            />
          </Field>
          <Field label="How did you hear about us?" error={errors.referralSource}>
            <select
              name="referralSource"
              value={values.referralSource}
              onChange={(event) => update("referralSource", event.target.value)}
              className={inputClasses}
            >
              <option value="">Prefer not to say</option>
              {REFERRAL_SOURCES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-accent-deep px-6 py-3 text-sm font-semibold text-surface transition-colors hover:bg-accent disabled:opacity-60"
      >
        {isPending ? "Submitting…" : "Submit order request"}
      </button>
    </form>
  );
}
