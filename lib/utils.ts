import { siteConfig } from "@/lib/config";

/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Build a wa.me link with an optional prefilled message. */
export function whatsappLink(
  number: string = siteConfig.people.founder.whatsapp,
  message: string = siteConfig.whatsappMessages.general,
) {
  const digits = number.replace(/\D/g, "");
  return message
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${digits}`;
}

/** Build a tel: link from any formatted phone number. */
export function telLink(phone: string) {
  return `tel:+${phone.replace(/\D/g, "")}`;
}

/** Safe sessionStorage access (throws in private mode / blocked storage). */
export const safeSession = {
  get(key: string): string | null {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};
