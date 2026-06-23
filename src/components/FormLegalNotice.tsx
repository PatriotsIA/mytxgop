import { Link } from "react-router-dom";
import { legalLinks } from "../lib/links";

export function FormLegalNotice() {
  return (
    <p className="form-legal-notice">
      By submitting this form, you agree to My Local GOP&apos;s{" "}
      <Link to={legalLinks.privacyPolicyPath}>Privacy Policy</Link> and{" "}
      <Link to={legalLinks.termsOfServicePath}>Terms of Service</Link>.
    </p>
  );
}
