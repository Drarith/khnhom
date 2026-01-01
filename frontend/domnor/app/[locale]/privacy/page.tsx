import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Domnor",
  description: "Privacy Policy for Domnor - How we handle your data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            1. Introduction
          </h2>
          <p>
            Welcome to Domnor ("we," "our," or "us"). We are committed to
            protecting your privacy and ensuring you have a positive experience
            on our website and in using our services. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you visit our website and use our link-in-bio
            services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            2. Information We Collect
          </h2>
          <p className="mb-2">
            We collect information that you provide directly to us when you:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Create an account (via Google Login or other methods).</li>
            <li>
              Create and customize your profile (including images, bio, and
              social links).
            </li>
            <li>Contact us for support.</li>
          </ul>
          <p className="mt-2 mb-2">
            <strong>Types of Data:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Personal Data:</strong> Name, email address, and profile
              picture (from Google or uploaded).
            </li>
            <li>
              <strong>User Content:</strong> The links, text, and images you
              choose to display on your Domnor page.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you access and
              use the service, such as your IP address, browser type, and
              operating system.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            3. How We Use Your Information
          </h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, operate, and maintain our services.</li>
            <li>Improve, personalize, and expand our services.</li>
            <li>Understand and analyze how you use our services.</li>
            <li>Process your donations (via KHQR or other payment methods).</li>
            <li>
              Communicate with you, either directly or through one of our
              partners, including for customer service, to provide you with
              updates and other information relating to the website.
            </li>
            <li>Find and prevent fraud.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            4. Third-Party Services
          </h2>
          <p>
            We may employ third-party companies and services to facilitate our
            Service ("Service Providers"), to provide the Service on our behalf,
            to perform Service-related services, or to assist us in analyzing
            how our Service is used.
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>Google Auth:</strong> Used for authentication. We access
              your basic profile info (name, email, picture).
            </li>
            <li>
              <strong>Cloudinary:</strong> Used for hosting user-uploaded
              images.
            </li>
            <li>
              <strong>KHQR / Banking Services:</strong> If you make or receive
              donations, payment processing is handled by third-party banking
              apps. We do not store your credit card or bank account details on
              our servers.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            5. Data Security
          </h2>
          <p>
            We use administrative, technical, and physical security measures to
            help protect your personal information. While we have taken
            reasonable steps to secure the personal information you provide to
            us, please be aware that despite our efforts, no security measures
            are perfect or impenetrable, and no method of data transmission can
            be guaranteed against any interception or other type of misuse.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            6. Your Data Rights
          </h2>
          <p>
            Depending on your location, you may have the right to access,
            correct, or delete the personal data we hold about you. You can
            usually manage your own data directly within your account settings.
            If you wish to delete your account entirely, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            7. Children's Privacy
          </h2>
          <p>
            Our Services are not intended for use by children under the age of
            13. We do not knowingly collect personal identifiable information
            from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            8. Changes to This Privacy Policy
          </h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
            You are advised to review this Privacy Policy periodically for any
            changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            9. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>
              By email:{" "}
              <a
                href="mailto:sarindararith5540@gmail.com"
                className="text-blue-600 hover:underline"
              >
                sarindararith5540@gmail.com
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
