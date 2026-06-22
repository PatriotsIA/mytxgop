import { legalLinks } from "../lib/links";

export function FormLegalNotice() {
  return (
    <p className="form-legal-notice">
      By submitting this form, you agree to MyLocalGOP&apos;s{" "}
      <a href={legalLinks.privacyPolicyUrl} target="_blank" rel="noreferrer">
        Privacy Policy
      </a>{" "}
      and{" "}
      <a href={legalLinks.termsOfServiceUrl} target="_blank" rel="noreferrer">
        Terms of Service
      </a>
      .
    </p>
  );
}
