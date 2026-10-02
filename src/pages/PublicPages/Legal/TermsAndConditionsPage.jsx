import React from "react";
import LegalDocumentViewer from "../components/legal/LegalDocumentViewer";

const TERMS_SECTIONS = [
  {
    id: "acceptance-of-terms",
    heading: "Acceptance of Terms",
    paragraphs: [
      "By accessing or utilizing the TrustRate platform, whether as a consumer browsing directory listings or as a business representative claiming a merchant profile, you agree to comply with and be bound by these Terms and Conditions.",
      "If you do not agree to these terms, you must discontinue your use of the platform.",
    ],
  },
  {
    id: "review-submission-standards",
    heading: "Review Guidelines and Prohibited Behavior",
    paragraphs: [
      "TrustRate depends on truthful, firsthand consumer experiences. Every contributor must abide by the following content guidelines:",
    ],
    list: [
      "Firsthand Experience: You must have personally conducted business with or visited the establishment you are rating.",
      "No Paid Endorsements: You may not accept financial compensation, free goods, or discounts in exchange for writing positive or negative feedback.",
      "Anti-Spam Compliance: Attempting to circumvent device cooldown intervals using automated proxies, bots, or device spoofing is strictly prohibited.",
      "Respectful Communication: Reviews containing hate speech, personal doxxing, profane harassment, or extortionate threats will be removed immediately upon review.",
    ],
  },
  {
    id: "zero-pay-to-remove",
    heading: "Strict Zero Pay-to-Remove Policy",
    paragraphs: [
      "TrustRate does not sell reputation-cleansing services, sponsored review weighting, or paid comment deletion to any business.",
      "Ratings are computed through transparent mathematical averages. A negative review will not be removed simply because a business owner disagrees with the customer's sentiment. Moderation is conducted solely on objective guideline violations.",
    ],
  },
  {
    id: "merchant-obligations",
    heading: "Business Owner Responsibilities",
    paragraphs: [
      "Business owners claiming a directory listing must submit valid proof of operational identity.",
      "Verified merchants are granted access to reply to community feedback. Merchant responses must maintain professional decorum and refrain from harassing or threatening reviewers.",
    ],
  },
  {
    id: "moderation-and-enforcement",
    heading: "Content Moderation and Enforcement",
    paragraphs: [
      "TrustRate reserves the right, but does not assume the obligation, to investigate and moderate reported content.",
      "Accounts or listings found repeatedly engaging in review manipulation, bot deployment, or abusive conduct may face permanent suspension.",
    ],
  },
  {
    id: "limitation-of-liability",
    heading: "Disclaimers and Limitation of Liability",
    paragraphs: [
      "Reviews and comments posted on TrustRate represent the opinions of individual authors, not of TrustRate. We do not endorse any specific business, product, or claim posted in the directory.",
      "TrustRate is provided on an 'as is' basis without warranty of any kind, whether express or implied.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <LegalDocumentViewer
      title="Terms and Conditions"
      lastUpdated="October 2026"
      description="These terms govern your access to TrustRate, outlining our community standards, review guidelines, and merchant responsibilities."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Legal" },
        { label: "Terms and Conditions" },
      ]}
      sections={TERMS_SECTIONS}
    />
  );
}