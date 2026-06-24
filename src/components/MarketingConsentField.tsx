import { Link } from "react-router-dom";
import { legalLinks } from "../lib/links";

type MarketingConsentFieldProps = {
  id: string;
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
};

export function MarketingConsentField({ id, checked, error, onChange }: MarketingConsentFieldProps) {
  return (
    <>
      <div className="checkbox-field marketing-consent-field">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.checked)}
        />
        <label htmlFor={id}>
          I consent to receive marketing, donation-related, and informational emails, calls and text messages from My
          Local GOP, including pre-recorded messages and via automated methods. Msg &amp; data rates may apply. Msg
          frequency may vary. Reply &quot;STOP&quot; to opt-out and &quot;HELP&quot; for help. I have read and agree to
          the <Link to={legalLinks.privacyPolicyPath}>Privacy Policy</Link> and{" "}
          <Link to={legalLinks.termsOfServicePath}>Terms &amp; Conditions</Link>.
        </label>
      </div>
      {error ? (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </>
  );
}
