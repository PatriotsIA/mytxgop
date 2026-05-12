import { useState } from "react";
import type { CountySite } from "../data/countyTypes";
import { sendEventSubmissionEmail } from "../lib/email";
import { hasMinimumLength, isValidEmail, sanitizeText, type FieldErrors } from "../lib/validation";
import { Button } from "./Button";
import { FormField } from "./FormField";
import { FormStatus } from "./FormStatus";

type EventFields = "submitterName" | "submitterEmail" | "eventName" | "eventDate" | "eventDescription" | "consent";

const blankEvent = {
  submitterName: "",
  submitterEmail: "",
  submitterPhone: "",
  eventName: "",
  eventDate: "",
  eventStartTime: "",
  eventEndTime: "",
  eventLocation: "",
  eventAddress: "",
  eventDescription: "",
  eventUrl: "",
  requestedCalendar: "",
  consent: false,
  website: "",
};

export function SubmitEventForm({ county }: { county: CountySite }) {
  const [form, setForm] = useState({ ...blankEvent, requestedCalendar: `${county.displayName} Community Calendar` });
  const [errors, setErrors] = useState<FieldErrors<EventFields>>({});
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string }>();
  const [sending, setSending] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);

  const update = (key: keyof typeof form) => (value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const nextErrors: FieldErrors<EventFields> = {};
    if (!form.submitterName.trim()) nextErrors.submitterName = "Your name is required.";
    if (!isValidEmail(form.submitterEmail)) nextErrors.submitterEmail = "Enter a valid email address.";
    if (!form.eventName.trim()) nextErrors.eventName = "Event name is required.";
    if (!form.eventDate) nextErrors.eventDate = "Event date is required.";
    if (!hasMinimumLength(form.eventDescription, 15)) nextErrors.eventDescription = "Description must be at least 15 characters.";
    if (!form.consent) nextErrors.consent = "Please confirm the review process.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.website || Date.now() < cooldownUntil || !validate()) return;

    setSending(true);
    setStatus(undefined);
    try {
      await sendEventSubmissionEmail({
        countyName: county.displayName,
        countySlug: county.slug,
        toEmail: county.emailSettings?.eventSubmissionToEmail || import.meta.env.VITE_DEFAULT_CONTACT_TO_EMAIL || "info@mytexasgop.com",
        submitterName: sanitizeText(form.submitterName),
        submitterEmail: sanitizeText(form.submitterEmail),
        submitterPhone: sanitizeText(form.submitterPhone),
        eventName: sanitizeText(form.eventName),
        eventDate: form.eventDate,
        eventStartTime: form.eventStartTime,
        eventEndTime: form.eventEndTime,
        eventLocation: sanitizeText(form.eventLocation),
        eventAddress: sanitizeText(form.eventAddress),
        eventDescription: sanitizeText(form.eventDescription),
        eventUrl: sanitizeText(form.eventUrl),
        requestedCalendar: sanitizeText(form.requestedCalendar),
        consent: form.consent,
      });
      setForm({ ...blankEvent, requestedCalendar: `${county.displayName} Community Calendar` });
      setStatus({ type: "success", message: "Thank you. Your event has been submitted for review." });
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
      <label className="honeypot" htmlFor="event-website">Website</label>
      <input className="honeypot" id="event-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website")(event.target.value)} />
      <div className="form-grid">
        <FormField id="submitterName" label="Your Name" value={form.submitterName} error={errors.submitterName} required onChange={update("submitterName")} />
        <FormField id="submitterEmail" label="Your Email" value={form.submitterEmail} error={errors.submitterEmail} required type="email" onChange={update("submitterEmail")} />
        <FormField id="submitterPhone" label="Phone" value={form.submitterPhone} onChange={update("submitterPhone")} />
        <FormField id="eventName" label="Event Name" value={form.eventName} error={errors.eventName} required onChange={update("eventName")} />
        <FormField id="eventDate" label="Event Date" value={form.eventDate} error={errors.eventDate} required type="date" onChange={update("eventDate")} />
        <FormField id="eventStartTime" label="Start Time" value={form.eventStartTime} type="time" onChange={update("eventStartTime")} />
        <FormField id="eventEndTime" label="End Time" value={form.eventEndTime} type="time" onChange={update("eventEndTime")} />
        <FormField id="eventLocation" label="Event Location Name" value={form.eventLocation} onChange={update("eventLocation")} />
        <FormField id="eventAddress" label="Event Address" value={form.eventAddress} onChange={update("eventAddress")} />
        <FormField id="eventUrl" label="Event URL / Community Link" value={form.eventUrl} type="url" onChange={update("eventUrl")} />
        <FormField id="requestedCalendar" label="Requested Calendar" value={form.requestedCalendar} as="select" onChange={update("requestedCalendar")}>
          <option>{county.displayName} Community Calendar</option>
        </FormField>
      </div>
      <FormField id="eventDescription" label="Event Description" value={form.eventDescription} error={errors.eventDescription} required as="textarea" onChange={update("eventDescription")} />
      <div className="checkbox-field">
        <input id="consent" type="checkbox" checked={form.consent} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} onChange={(event) => update("consent")(event.target.checked)} />
        <label htmlFor="consent">I understand this submission will be reviewed before being added to the calendar.</label>
      </div>
      {errors.consent ? <p className="field-error" id="consent-error">{errors.consent}</p> : null}
      <FormStatus status={status} />
      <Button type="submit" disabled={sending || Date.now() < cooldownUntil}>{sending ? "Sending..." : "Submit Event"}</Button>
    </form>
  );
}
