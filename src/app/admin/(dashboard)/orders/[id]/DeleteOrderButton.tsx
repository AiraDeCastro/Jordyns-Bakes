"use client";

import { useRef } from "react";
import { deleteOrder } from "@/app/admin/actions";

export function DeleteOrderButton({ orderId }: { orderId: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={deleteOrder.bind(null, orderId)}>
      <button
        type="button"
        onClick={() => {
          if (window.confirm("Delete this order permanently? This can't be undone.")) {
            formRef.current?.requestSubmit();
          }
        }}
        className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted hover:border-accent-deep hover:text-accent-deep"
      >
        Delete order
      </button>
    </form>
  );
}
