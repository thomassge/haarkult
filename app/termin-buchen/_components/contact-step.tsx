"use client";

type ContactStepProps = {
  submitLabel: string;
  pending: boolean;
  disabled: boolean;
  fieldErrors?: Record<string, string[]>;
  contact: {
    name: string;
    phone: string;
    email: string;
    note: string;
  };
  onContactChange: (field: "name" | "phone" | "email" | "note", value: string) => void;
  onSubmit: () => void;
};

export function ContactStep({
  submitLabel,
  pending,
  disabled,
  fieldErrors,
  contact,
  onContactChange,
  onSubmit,
}: ContactStepProps) {
  return (
    <section className="rounded-lg border border-[#d9e1da] bg-white p-6">
      <h2 className="text-[20px] font-semibold leading-[1.2] tracking-normal">
        Kontakt
      </h2>
      <p className="mt-3 text-[16px] leading-[1.5] text-[#5f6b62]">
        Wir nutzen deine Angaben nur fuer diese Terminanfrage. Du brauchst kein
        Kundenkonto.
      </p>

      <div className="mt-5 grid gap-4">
        <FieldError messages={fieldErrors?.name} />
        <label
          htmlFor="booking-name"
          className="grid gap-2 text-[14px] font-semibold leading-[1.4] tracking-normal"
        >
          Name
          <input
            id="booking-name"
            value={contact.name}
            required
            onChange={(event) => onContactChange("name", event.target.value)}
            className="min-h-11 rounded-lg border border-[#d9e1da] px-3 py-2 text-[16px] font-normal leading-[1.5] tracking-normal"
          />
        </label>

        <FieldError messages={fieldErrors?.phone} />
        <label
          htmlFor="booking-phone"
          className="grid gap-2 text-[14px] font-semibold leading-[1.4] tracking-normal"
        >
          Telefon
          <input
            id="booking-phone"
            value={contact.phone}
            required
            onChange={(event) => onContactChange("phone", event.target.value)}
            className="min-h-11 rounded-lg border border-[#d9e1da] px-3 py-2 text-[16px] font-normal leading-[1.5] tracking-normal"
          />
        </label>

        <FieldError messages={fieldErrors?.email} />
        <label
          htmlFor="booking-email"
          className="grid gap-2 text-[14px] font-semibold leading-[1.4] tracking-normal"
        >
          E-Mail
          <input
            id="booking-email"
            value={contact.email}
            required
            type="email"
            onChange={(event) => onContactChange("email", event.target.value)}
            className="min-h-11 rounded-lg border border-[#d9e1da] px-3 py-2 text-[16px] font-normal leading-[1.5] tracking-normal"
          />
        </label>

        <label
          htmlFor="booking-note"
          className="grid gap-2 text-[14px] font-semibold leading-[1.4] tracking-normal"
        >
          Hinweis (optional)
          <textarea
            id="booking-note"
            value={contact.note}
            onChange={(event) => onContactChange("note", event.target.value)}
            className="min-h-24 rounded-lg border border-[#d9e1da] px-3 py-2 text-[16px] font-normal leading-[1.5] tracking-normal"
          />
        </label>
        <p className="text-[14px] font-normal leading-[1.4] text-[#5f6b62]">
          Wuensche, Besonderheiten oder eine bevorzugte Rueckrufzeit kannst du hier
          eintragen.
        </p>
      </div>

      <button
        type="button"
        disabled={disabled || pending}
        onClick={onSubmit}
        className="mt-5 min-h-11 rounded-lg bg-[#23624f] px-5 py-3 text-[14px] font-semibold leading-[1.4] tracking-normal text-white disabled:cursor-not-allowed disabled:bg-[#5f6b62]"
      >
        {pending ? "Wird gesendet..." : submitLabel}
      </button>
    </section>
  );
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) {
    return null;
  }

  return (
    <p className="text-[14px] font-semibold leading-[1.4] tracking-normal text-[#b42318]">
      {messages[0]}
    </p>
  );
}
