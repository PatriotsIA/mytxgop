import { Link } from "react-router-dom";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { phoneHref } from "../lib/contact";
import { legalOrganization } from "../lib/legal";
import { legalLinks } from "../lib/links";

export default function Terms() {
  const { name, email, phone, mailingAddress, termsLastRevised } = legalOrganization;

  return (
    <LegalPageLayout
      title={`Terms of Service | ${name}`}
      description={`Terms and conditions for use of ${name} online services.`}
      canonicalPath={legalLinks.termsOfServicePath}
      heroTitle="Terms & conditions"
      heroIntro={`Terms for use of ${name} online services, including mobile communications disclosures used for political texting program vetting.`}
      metaLabel={`Last revised: ${termsLastRevised}`}
    >
      <p>
        These Terms and Conditions (&quot;Terms&quot;) apply to your access to and use of the websites and other online
        services (collectively, the &quot;Services&quot;) provided by {name} (&quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;). By accessing and using the Services, you agree to these Terms. If you do not agree to these
        Terms, do not use the Services.
      </p>
      <p>
        We may update these Terms from time to time by revising the &quot;Last revised&quot; date above; when required
        we may provide additional notice. Continued use after changes constitutes acceptance unless you stop using the
        Services.
      </p>
      <p>
        Questions: <a href={`mailto:${email}`}>{email}</a>, by phone at{" "}
        <a href={phoneHref(phone)}>{phone}</a>, or by mail to {mailingAddress}.
      </p>

      <h2>Privacy policy</h2>
      <p>
        For information about how we collect, use, and share information about you, please see our{" "}
        <Link to={legalLinks.privacyPolicyPath}>Privacy Policy</Link>.
      </p>

      <h2>Mobile communications</h2>
      <p>
        If you subscribe to receive messages or calls, you consent to receive automated messages from us via your mobile
        device. Subscribers may receive multiple messages a week from us, depending on the program you join.
      </p>
      <p>
        We do not charge for these services. However, your carrier&apos;s normal messaging, data, and other rates and
        fees will still apply. You should check with your carrier to find out what plans are available and how much they
        cost. At any time, you may text STOP to cancel or HELP for customer support information. For all questions about
        the services provided, you can send an email to <a href={`mailto:${email}`}>{email}</a>.
      </p>
      <p>Carriers are not liable for delayed or undelivered messages.</p>
      <p>
        By entering your phone number and selecting to opt in, you consent to join a recurring SMS/MMS text messaging
        program that may provide alerts, donation requests, updates, and other important information. By participating,
        you agree to the terms &amp; privacy policy for auto-dialed messages from us to the phone number you provide. No
        consent is required to buy goods or services. Msg &amp; data rates may apply. Reply HELP for help or STOP to
        opt-out at any time. SMS information is not rented, sold, or shared. See our{" "}
        <Link to={legalLinks.privacyPolicyPath}>Privacy Policy</Link> and these Terms.
      </p>

      <h2>Donations</h2>
      <p>
        Donations are processed through Anedot. We do not collect raw payment-card details on this site. Refunds and
        chargeback rules are governed by the processor and applicable law.
      </p>

      <h2>User submissions</h2>
      <p>
        Event submissions, messages, and other content you provide may be reviewed, edited for clarity, or declined. Do
        not submit confidential information you are not authorized to share.
      </p>

      <h2>Disclaimer &amp; limitation of liability</h2>
      <p>
        THE SERVICES AND CONTENT ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES
        OF ANY KIND, EXPRESS OR IMPLIED, TO THE FULLEST EXTENT PERMITTED BY LAW. TO THE FULLEST EXTENT PERMITTED BY LAW,
        WE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
        DATA, PROFITS, OR REVENUE, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES.
      </p>
    </LegalPageLayout>
  );
}
