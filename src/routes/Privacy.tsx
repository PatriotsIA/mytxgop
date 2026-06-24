import { Link } from "react-router-dom";
import { LegalPageLayout } from "../components/LegalPageLayout";
import { phoneHref } from "../lib/contact";
import { legalOrganization } from "../lib/legal";
import { legalLinks } from "../lib/links";

export default function Privacy() {
  const { name, email, phone, mailingAddress, privacyEffectiveDate } = legalOrganization;

  return (
    <LegalPageLayout
      title={`Privacy Policy | ${name}`}
      description={`Privacy Policy for the ${name} website.`}
      canonicalPath={legalLinks.privacyPolicyPath}
      heroTitle="Privacy policy"
      heroIntro={`Privacy Policy for the ${name} website, structured for counsel review and aligned with common political texting expectations.`}
      metaLabel={`Effective date: ${privacyEffectiveDate}`}
    >
      <p>
        {name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting the privacy of visitors
        and users (&quot;you&quot; or &quot;your&quot;) of our website. This Privacy Policy outlines our practices
        regarding the collection, use, and disclosure of personal information through our website. By accessing and using
        our website, you consent to the terms of this Privacy Policy.
      </p>

      <h2>1. Information we collect</h2>
      <h3>a) Personal information</h3>
      <p>
        We may collect personal information you voluntarily provide, such as your name, email address, postal address,
        phone number, and any other information you submit through our website&apos;s forms.
      </p>
      <h3>b) Text messaging opt-in data</h3>
      <p>
        If you choose to opt in to receive text messages from us, we may collect your phone number and related data
        required for text messaging services.
      </p>
      <h3>c) Automatically collected information</h3>
      <p>
        When you visit our website, we may automatically collect certain information about your device, browser, and
        usage patterns. This information may include IP addresses, cookies, and other tracking technologies when those
        tools are enabled for this deployment.
      </p>

      <h2>2. Use of information</h2>
      <h3>a) General uses</h3>
      <p>We may use the personal information you provide to:</p>
      <ul>
        <li>Communicate with you, respond to your inquiries, and provide information about {name};</li>
        <li>Send updates, newsletters, fundraising and volunteer communications, and other organization-related information;</li>
        <li>Analyze and improve our website&apos;s performance, content, and user experience;</li>
        <li>
          Comply with legal obligations (including reporting requirements for political committees) and enforce our
          rights and agreements.
        </li>
      </ul>
      <h3>b) Text messaging opt-in data</h3>
      <p>
        Your phone number and related data collected for text messaging services will be used to send you
        organization-related text messages and updates you have consented to receive.
      </p>

      <h2>3. Sharing of information</h2>
      <h3>a) General</h3>
      <p>
        <strong>We will not share, sell, rent, or disclose your personal information to any third parties,</strong> except
        as described in this Privacy Policy or when required by law. For clarity, we may engage service providers (such
        as website hosting, form intake, email delivery, or SMS delivery vendors) solely to operate our programs on our
        behalf, under contractual obligations consistent with this Policy—they may not use your data for their own
        marketing.
      </p>
      <h3>b) Text messaging opt-in data</h3>
      <p>
        <strong>
          We will not share or sell your text messaging opt-in data, consent, or related personal information with any
          third parties,
        </strong>{" "}
        unless required by law.
      </p>

      <h2>4. Data security</h2>
      <p>
        We take reasonable measures to protect the security of your personal information and employ industry-standard
        security technologies where appropriate. However, no method of transmission over the internet or electronic
        storage is 100% secure, and we cannot guarantee absolute security.
      </p>

      <h2>5. Third-party services</h2>
      <p>
        Our website may contain links to third-party websites or services. We are not responsible for the privacy
        practices or content of such third parties. We encourage you to review the privacy policies of those third
        parties when you leave our site.
      </p>

      <h2>6. Children&apos;s privacy</h2>
      <p>
        Our website is not intended for use by individuals under the age of 13. We do not knowingly collect personal
        information from children under 13. If we become aware that we have collected personal information from a child
        under 13 without appropriate consent, we will take steps to remove such information.
      </p>

      <h2>7. Updates to this privacy policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational,
        legal, or regulatory reasons. Changes will be effective upon posting of the revised Privacy Policy on our website.
        We encourage you to review this page periodically.
      </p>

      <h2>8. Contact us</h2>
      <p>
        If you have any questions or concerns regarding this Privacy Policy or our privacy practices, please contact us
        at{" "}
        <a href={`mailto:${email}`}>{email}</a>, by phone at{" "}
        <a href={phoneHref(phone)}>{phone}</a>, by mail at {mailingAddress}, or through a county{" "}
        <Link to="/">Contact page</Link> on this website.
      </p>
    </LegalPageLayout>
  );
}
