import React from "react";
import LegalDocumentViewer from "../components/legal/LegalDocumentViewer";

const PRIVACY_SECTIONS = [
  {
    id: "information-collection",
    heading: "Information We Collect",
    paragraphs: [
      "TrustRate collects only the information necessary to provide a dependable, spam-resistant rating and review platform for local establishments.",
      "When you interact with our platform, we collect the following categories of data:",
    ],
    list: [
      "Account Information: When signing in via Google OAuth, we receive your name, email address, and profile picture to authenticate your identity.",
      "Review Content: Ratings from 1 to 5 stars, written feedback, and uploaded photos submitted for business listings.",
      "Device Cooldown Identifiers: Cryptographic hashes derived from device network characteristics, used solely to enforce rate-limiting intervals and prevent automated duplicate submissions.",
    ],
  },
  {
    id: "anti-spam-cooldowns",
    heading: "How We Handle Cooldown and Device Data",
    paragraphs: [
      "To prevent review-bombing and coordinated harassment campaigns against local businesses, TrustRate records anonymized device cooldown markers.",
      "These markers are mathematically hashed and are not linked to advertising trackers, cross-site profiles, or third-party data brokers. They exist exclusively to verify that subsequent reviews from the same hardware respect fair submission time intervals.",
    ],
  },
  {
    id: "information-usage",
    heading: "How We Use Your Information",
    paragraphs: [
      "We use your data for clear and transparent purposes:",
    ],
    list: [
      "Publishing authentic customer reviews and computing exact business rating scores.",
      "Enabling verified business owners to post public responses to community feedback.",
      "Investigating reports of fraud, extortion, or abusive behavior that breach our Community Guidelines.",
      "Operating our web application reliably and maintaining platform uptime.",
    ],
  },
  {
    id: "public-visibility",
    heading: "Public Visibility of Feedback",
    paragraphs: [
      "Reviews, star scores, and public business responses are accessible to all visitors of the TrustRate platform.",
      "Your Google account display name and photo may be displayed next to your submitted reviews so other community members know the feedback originated from a verified human account.",
    ],
  },
  {
    id: "retention-and-deletion",
    heading: "Data Retention and Your Rights",
    paragraphs: [
      "You have the right to request access to the personal data we hold about you, or to request the deletion of your account and associated reviews.",
      "If you wish to remove your account or retract a review, you may submit a request through our Contact page or email our data protection team directly.",
    ],
  },
  {
    id: "contact-privacy",
    heading: "Contacting the Privacy Team",
    paragraphs: [
      "If you have questions regarding this Privacy Policy or how your personal information is processed, please contact us at privacy@trustrate.local.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentViewer
      title="Privacy Policy"
      lastUpdated="October 2026"
      description="This policy outlines how TrustRate collects, stores, and protects information submitted by community patrons and business owners."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Legal" },
        { label: "Privacy Policy" },
      ]}
      sections={PRIVACY_SECTIONS}
    />
  );
}