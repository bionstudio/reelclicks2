"use client";

import { Suspense, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { services } from "@/lib/config";
import { BUDGETS, enquirySchema, enquiryWhatsappText, type EnquiryInput } from "@/lib/enquiry";
import { track } from "@/lib/track";
import { cn, whatsappLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { Turnstile } from "./Turnstile";

const ease = [0.16, 1, 0.3, 1] as const;

/** Enquiry form. `?service=<slug>` pre-selects the service. */
export function EnquiryForm({ whatsapp }: { whatsapp: string }) {
  return (
    <Suspense fallback={<Form whatsapp={whatsapp} initialService="" />}>
      <FormWithParams whatsapp={whatsapp} />
    </Suspense>
  );
}

function FormWithParams({ whatsapp }: { whatsapp: string }) {
  const requested = useSearchParams().get("service") ?? "";
  const initial = services.some((s) => s.slug === requested) ? requested : "";
  return <Form key={initial} whatsapp={whatsapp} initialService={initial} />;
}

function Form({ whatsapp, initialService }: { whatsapp: string; initialService: string }) {
  const [sent, setSent] = useState<EnquiryInput | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      service: initialService,
      eventDate: "",
      location: "",
      budget: "",
      message: "",
      website: "",
      turnstileToken: "",
    },
  });

  async function onSubmit(values: EnquiryInput) {
    setServerError(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: window.location.pathname + window.location.search }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setServerError(json.error || "Something went wrong. Please message us on WhatsApp.");
        setTurnstileReset((n) => n + 1);
        return;
      }
      track("form_submit", { service: values.service });
      setSent(values);
    } catch {
      setServerError("You seem to be offline. Please try again, or message us on WhatsApp.");
    }
  }

  if (sent) {
    return (
      <SuccessState
        name={sent.name}
        whatsappHref={whatsappLink(whatsapp, enquiryWhatsappText(sent))}
        onReset={() => {
          reset();
          setSent(null);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-x-8 gap-y-9 md:grid-cols-2" aria-label="Enquiry form">
      <Field id="name" label="Your name" required error={errors.name?.message}>
        <input {...register("name")} id="name" autoComplete="name" placeholder=" " className={inputCls} {...aria("name", errors.name)} />
      </Field>
      <Field id="phone" label="Phone / WhatsApp" required error={errors.phone?.message}>
        <input
          {...register("phone")}
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder=" "
          className={inputCls}
          {...aria("phone", errors.phone)}
        />
      </Field>
      <Field id="email" label="Email" error={errors.email?.message}>
        <input
          {...register("email")}
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder=" "
          className={inputCls}
          {...aria("email", errors.email)}
        />
      </Field>
      <Field id="service" label="Service" required error={errors.service?.message} floated>
        <SelectInput registration={register("service")} id="service" invalid={Boolean(errors.service)}>
          <option value="">Choose a service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field id="eventDate" label="Event date" error={errors.eventDate?.message} floated>
        <input
          {...register("eventDate")}
          id="eventDate"
          type="date"
          onFocus={(e) => {
            // Set "no past dates" at interaction time (avoids reading the clock during prerender).
            e.currentTarget.min = new Date().toISOString().slice(0, 10);
          }}
          className={inputCls}
          {...aria("eventDate", errors.eventDate)}
        />
      </Field>
      <Field id="location" label="City / Location" error={errors.location?.message}>
        <input
          {...register("location")}
          id="location"
          autoComplete="address-level2"
          placeholder=" "
          className={inputCls}
          {...aria("location", errors.location)}
        />
      </Field>
      <Field id="budget" label="Budget range" error={errors.budget?.message} floated className="md:col-span-2">
        <SelectInput registration={register("budget")} id="budget" invalid={Boolean(errors.budget)}>
          <option value="">Select a range (optional)</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field id="message" label="Tell us about your story" error={errors.message?.message} className="md:col-span-2">
        <textarea
          {...register("message")}
          id="message"
          rows={4}
          placeholder=" "
          className={cn(inputCls, "resize-y")}
          {...aria("message", errors.message)}
        />
      </Field>

      {/* Honeypot — hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input {...register("website")} id="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="md:col-span-2">
        <Turnstile onToken={(t) => setValue("turnstileToken", t)} resetKey={turnstileReset} />
      </div>

      <div className="flex flex-col gap-5 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-muted">
          We&apos;ll only use your details to reply to this enquiry by phone, WhatsApp or email.
        </p>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send Enquiry"}
        </Button>
      </div>

      <AnimatePresence>
        {serverError && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-[#F2A097]/40 px-5 py-4 text-sm text-[#F2A097] md:col-span-2"
          >
            {serverError}{" "}
            <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              Open WhatsApp
            </a>
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

const inputCls =
  "peer block w-full border-0 border-b border-ivory/20 bg-transparent px-0 pt-7 pb-3 text-base text-ivory transition-colors focus:border-ivory/20 focus:ring-0 focus-visible:outline-none aria-[invalid=true]:border-[#F2A097]/70";

function aria(id: string, error?: { message?: string }) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}

function Field({
  id,
  label,
  required,
  error,
  floated,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  /** Label always sits small at the top (selects, dates). */
  floated?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      {/* Field box: label and focus line are positioned against the input only (not the error). */}
      <div className="relative">
      {children}
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-0 origin-left transition-all duration-300 ease-expo-out",
          floated
            ? "top-0 text-[0.65rem] tracking-label text-gold uppercase"
            : "top-7 text-base text-muted peer-focus:top-0 peer-focus:text-[0.65rem] peer-focus:tracking-label peer-focus:text-gold peer-focus:uppercase peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:tracking-label peer-not-placeholder-shown:uppercase",
        )}
      >
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      {/* Gold focus line */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-expo-out peer-focus:scale-x-100"
      />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-[#F2A097]">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectInput({
  registration,
  id,
  invalid,
  children,
}: {
  registration: UseFormRegisterReturn;
  id: string;
  invalid: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <select
        {...registration}
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={cn(inputCls, "cursor-pointer appearance-none pr-8 [&>option]:bg-charcoal [&>option]:text-ivory")}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 8"
        className="pointer-events-none absolute right-1 bottom-5 h-2 w-3 text-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M1 1l5 5 5-5" />
      </svg>
    </>
  );
}

function SuccessState({ name, whatsappHref, onReset }: { name: string; whatsappHref: string; onReset: () => void }) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      className="flex flex-col items-start"
    >
      <svg viewBox="0 0 80 80" className="h-20 w-20 text-gold" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <motion.circle
          cx="40"
          cy="40"
          r="38"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease }}
        />
        <motion.path
          d="M25 41l10 10 21-22"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.7, ease }}
        />
      </svg>
      <h3 className="mt-8 font-display text-4xl font-light text-ivory md:text-6xl">
        Thank you, <em className="text-gold-soft">{name.split(" ")[0]}.</em>
      </h3>
      <p className="mt-5 max-w-md leading-relaxed text-muted">
        Your enquiry is with us. We usually reply within 2 hours — or continue the conversation on WhatsApp right now.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Button href={whatsappHref} newTab size="lg" data-track="whatsapp_click">
          <WhatsAppIcon className="h-4 w-4" />
          Continue on WhatsApp
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Send another enquiry
        </Button>
      </div>
    </motion.div>
  );
}
