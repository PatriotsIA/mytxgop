import emailjs from "@emailjs/browser";

export type ContactEmailPayload = {
  countyName: string;
  countySlug: string;
  toEmail: string;
  fromName: string;
  fromEmail: string;
  phone?: string;
  subject: string;
  message: string;
};

export type EventSubmissionPayload = {
  countyName: string;
  countySlug: string;
  toEmail: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone?: string;
  eventName: string;
  eventDate: string;
  eventStartTime?: string;
  eventEndTime?: string;
  eventLocation?: string;
  eventAddress?: string;
  eventDescription?: string;
  eventUrl?: string;
  requestedCalendar?: string;
  consent: boolean;
};

function getEmailConfig() {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error(
      "EmailJS is not configured. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY to .env.",
    );
  }

  return { serviceId, templateId, publicKey };
}

function buildContactMessage(payload: ContactEmailPayload) {
  return [
    `Submission type: Contact`,
    `County: ${payload.countyName} (${payload.countySlug})`,
    `Recipient: ${payload.toEmail}`,
    `Name: ${payload.fromName}`,
    `Email: ${payload.fromEmail}`,
    `Phone: ${payload.phone || "Not provided"}`,
    `Subject: ${payload.subject}`,
    "",
    payload.message,
  ].join("\n");
}

function buildEventSubmissionMessage(payload: EventSubmissionPayload) {
  return [
    `Submission type: Event`,
    `County: ${payload.countyName} (${payload.countySlug})`,
    `Recipient: ${payload.toEmail}`,
    `Submitter: ${payload.submitterName}`,
    `Submitter email: ${payload.submitterEmail}`,
    `Submitter phone: ${payload.submitterPhone || "Not provided"}`,
    "",
    `Event name: ${payload.eventName}`,
    `Event date: ${payload.eventDate}`,
    `Start time: ${payload.eventStartTime || "Not provided"}`,
    `End time: ${payload.eventEndTime || "Not provided"}`,
    `Location: ${payload.eventLocation || "Not provided"}`,
    `Address: ${payload.eventAddress || "Not provided"}`,
    `Event URL: ${payload.eventUrl || "Not provided"}`,
    `Requested calendar: ${payload.requestedCalendar || "Not provided"}`,
    `Consent confirmed: ${payload.consent ? "Yes" : "No"}`,
    "",
    payload.eventDescription || "No event description provided.",
  ].join("\n");
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  const config = getEmailConfig();
  const message = buildContactMessage(payload);

  return emailjs.send(
    config.serviceId,
    config.templateId,
    {
      county_name: payload.countyName,
      county_slug: payload.countySlug,
      submission_type: "contact",
      name: payload.fromName,
      email: payload.fromEmail,
      title: `Contact: ${payload.subject}`,
      reply_to: payload.fromEmail,
      user_name: payload.fromName,
      user_email: payload.fromEmail,
      to_email: payload.toEmail,
      from_name: payload.fromName,
      from_email: payload.fromEmail,
      phone: payload.phone || "",
      subject: payload.subject,
      message,
      raw_message: payload.message,
      page_url: window.location.href,
      submitted_at: new Date().toISOString(),
    },
    { publicKey: config.publicKey },
  );
}

export async function sendEventSubmissionEmail(payload: EventSubmissionPayload) {
  const config = getEmailConfig();
  const message = buildEventSubmissionMessage(payload);

  return emailjs.send(
    config.serviceId,
    config.templateId,
    {
      county_name: payload.countyName,
      county_slug: payload.countySlug,
      submission_type: "event",
      name: payload.submitterName,
      email: payload.submitterEmail,
      title: `Event Submission: ${payload.eventName}`,
      reply_to: payload.submitterEmail,
      user_name: payload.submitterName,
      user_email: payload.submitterEmail,
      to_email: payload.toEmail,
      submitter_name: payload.submitterName,
      submitter_email: payload.submitterEmail,
      submitter_phone: payload.submitterPhone || "",
      event_name: payload.eventName,
      event_date: payload.eventDate,
      event_start_time: payload.eventStartTime || "",
      event_end_time: payload.eventEndTime || "",
      event_location: payload.eventLocation || "",
      event_address: payload.eventAddress || "",
      event_description: payload.eventDescription || "",
      event_url: payload.eventUrl || "",
      requested_calendar: payload.requestedCalendar || "",
      consent: payload.consent ? "yes" : "no",
      message,
      page_url: window.location.href,
      submitted_at: new Date().toISOString(),
    },
    { publicKey: config.publicKey },
  );
}
