import { Container } from "@/components/Container";

const FAQS = [
  {
    question: "How far in advance do I need to order?",
    answer:
      "At least 2 weeks before your event. Every cake is made to order, so more notice is always appreciated for larger or more detailed designs.",
  },
  {
    question: "How much will my cake cost?",
    answer:
      "Every order is quoted individually based on size, design, and flavors — there's no fixed price list. Submit an order request and you'll hear back with a quote before anything is confirmed.",
  },
  {
    question: "Do you offer delivery, or is it pickup only?",
    answer:
      "Both — you can choose delivery or pickup on the order form. Delivery availability depends on your location, so it'll be confirmed along with your quote.",
  },
  {
    question: "Can you accommodate allergies or dietary restrictions?",
    answer:
      "Let us know on the order form and we'll do our best to accommodate. Please mention any allergies as early as possible so it can be factored into the design and ingredients.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex flex-1 flex-col py-16">
      <Container className="mx-auto flex max-w-2xl flex-col gap-8">
        <h1 className="text-center font-display text-3xl font-semibold text-heading">
          Frequently Asked Questions
        </h1>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-border bg-surface p-5"
            >
              <summary className="cursor-pointer list-none font-medium text-heading marker:content-none">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </div>
  );
}
