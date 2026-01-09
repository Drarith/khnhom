import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Khnhom",
  description: "Terms of Service for Khnhom.",
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using Khnhom (&quot;the Service&quot;), you accept and agree
            to be bound by the terms and provision of this agreement. In
            addition, when using these particular services, you shall be subject
            to any posted guidelines or rules applicable to such services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            2. Description of Service
          </h2>
          <p>
            Khnhom is a platform that allows users to create a personalized page
            to house all their important links (&quot;Link-in-Bio&quot;). The Service is
            provided &quot;as is&quot; and is free to use, though we may accept voluntary
            donations to support the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            3. User Accounts
          </h2>
          <p>
            To access certain features of the Service, you may be required to
            create an account. You are responsible for maintaining the
            confidentiality of your account and password and for restricting
            access to your computer, and you agree to accept responsibility for
            all activities that occur under your account or password.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            4. User Content and Conduct
          </h2>
          <p>
            You retain all rights to the content (text, images, links) you post
            on Khnhom. However, by posting content, you grant us a worldwide,
            non-exclusive, royalty-free license to use, reproduce, and display
            such content in connection with the Service.
          </p>
          <p className="mt-2">
            <strong>You agree NOT to use the Service to:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              Upload or link to content that is unlawful, harmful, threatening,
              abusive, harassing, defamatory, vulgar, obscene, libelous,
              invasive of another&apos;s privacy, hateful, or racially, ethnically,
              or otherwise objectionable.
            </li>
            <li>Harm minors in any way.</li>
            <li>Impersonate any person or entity.</li>
            <li>
              Upload or link to malware, viruses, or any other malicious code.
            </li>
            <li>Engage in &quot;spamming&quot; or sending unsolicited messages.</li>
          </ul>
          <p className="mt-2">
            We reserve the right to remove any content or terminate any account
            that violates these terms, at our sole discretion and without prior
            notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            5. Donations and Payments
          </h2>
          <p>
            Khnhom is free to use. We may provide mechanisms for users to
            support the platform via donations (e.g., KHQR). Donations are
            voluntary and non-refundable. We are not responsible for any issues
            arising from third-party payment processors.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            6. Intellectual Property
          </h2>
          <p>
            The Service and its original content (excluding Content provided by
            users), features, and functionality are and will remain the
            exclusive property of Khnhom and its licensors. The Service is
            protected by copyright, trademark, and other laws of both Cambodia
            and foreign countries.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            7. Termination
          </h2>
          <p>
            We may terminate or suspend access to our Service immediately,
            without prior notice or liability, for any reason whatsoever,
            including without limitation if you breach the Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            8. Limitation of Liability
          </h2>
          <p>
            In no event shall Khnhom, nor its directors, employees, partners,
            agents, suppliers, or affiliates, be liable for any indirect,
            incidental, special, consequential or punitive damages, including
            without limitation, loss of profits, data, use, goodwill, or other
            intangible losses, resulting from (i) your access to or use of or
            inability to access or use the Service; (ii) any conduct or content
            of any third party on the Service; (iii) any content obtained from
            the Service; and (iv) unauthorized access, use or alteration of your
            transmissions or content, whether based on warranty, contract, tort
            (including negligence) or any other legal theory, whether or not we
            have been informed of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            9. Governing Law
          </h2>
          <p>
            These Terms shall be governed and construed in accordance with the
            laws of Cambodia, without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            10. Changes
          </h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. By continuing to access or use our Service
            after those revisions become effective, you agree to be bound by the
            revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            11. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at
            <a
              href="mailto:khnhomofficial@gmail.com@gmail.com"
              className="text-blue-600 hover:underline"
            >
              khnhomofficial@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
