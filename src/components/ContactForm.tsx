import { useEffect, useState } from "react";
import type { CountySite } from "../data/countyTypes";
import { sendContactEmail } from "../lib/email";
import { hasMinimumLength, isValidEmail, sanitizeText, type FieldErrors } from "../lib/validation";
import { Button } from "./Button";
import { FormField } from "./FormField";
import { FormLegalNotice } from "./FormLegalNotice";
import { FormStatus } from "./FormStatus";

type ContactFields = "name" | "email" | "subject" | "message";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  website: "",
};

export function ContactForm({ county }: { county: CountySite }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors<ContactFields>>({});
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string }>();
  const [sending, setSending] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);

  useEffect(() => {
    if (!cooldownUntil) return;

    const timeoutId = window.setTimeout(() => setCooldownUntil(0), Math.max(0, cooldownUntil - Date.now()));
    return () => window.clearTimeout(timeoutId);
  }, [cooldownUntil]);

  const update = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const nextErrors: FieldErrors<ContactFields> = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!isValidEmail(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!form.subject.trim()) nextErrors.subject = "Subject is required.";
    if (!hasMinimumLength(form.message, 10)) nextErrors.message = "Message must be at least 10 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.website || cooldownUntil > 0 || !validate()) return;

    setSending(true);
    setStatus(undefined);
    try {
      await sendContactEmail({
        countyName: county.displayName,
        countySlug: county.slug,
        toEmail: county.emailSettings?.contactToEmail || import.meta.env.VITE_DEFAULT_CONTACT_TO_EMAIL || "info@mytexasgop.com",
        fromName: sanitizeText(form.name),
        fromEmail: sanitizeText(form.email),
        phone: sanitizeText(form.phone),
        subject: sanitizeText(form.subject),
        message: sanitizeText(form.message),
      });
      setForm(initialForm);
      setStatus({ type: "success", message: "Your message has been sent. We'll get back to you soon." });
    } catch {
      setStatus({ type: "error", message: "Something went wrong. Please try again or email us directly." });
    } finally {
      setCooldownUntil(Date.now() + 5000);
      setSending(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="countyName" value={county.displayName} />
      <input type="hidden" name="countySlug" value={county.slug} />
      <label className="honeypot" htmlFor="contact-website">Website</label>
      <input className="honeypot" id="contact-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website")(event.target.value)} />
      <div className="form-grid">
        <FormField id="name" label="Name" value={form.name} error={errors.name} required onChange={update("name")} />
        <FormField id="email" label="Email" value={form.email} error={errors.email} required type="email" onChange={update("email")} />
        <FormField id="phone" label="Phone" value={form.phone} onChange={update("phone")} />
        <FormField id="subject" label="Subject" value={form.subject} error={errors.subject} required onChange={update("subject")} />
      </div>
      <FormField id="message" label="Message" value={form.message} error={errors.message} required as="textarea" onChange={update("message")} />
      <FormLegalNotice />
      <FormStatus status={status} />
      <Button type="submit" disabled={sending || cooldownUntil > 0}>{sending ? "Sending..." : "Send Message"}</Button>
    </form>
  );
}
