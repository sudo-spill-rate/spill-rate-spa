import React from "react";
import LegalDocumentViewer from "../components/legal/LegalDocumentViewer";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const PRIVACY_SECTIONS = [
  {
    id: "information-collection",
    heading: "Information We Collect",
    paragraphs: [
      "SpillRate is deeply committed to protecting your personal privacy, which means we collect only the minimal basic information necessary to operate a dependable, transparent, and honest community directory. When you choose to write a customer review for any local shop, cafe, or clinic, we collect only the display name you provide, your chosen star rating from one to five, your feedback comment of up to five hundred characters, and up to two optional photos you attach. Everyday customers do not need to create an account, register a password, or link their social media profiles to explore directory listings or submit firsthand customer reviews. Local business owners who register or claim commercial storefronts sign in securely via Google OAuth, providing their official Google email address, display name, and avatar picture to authenticate administrative ownership. Business owners also submit essential commercial information, including trade name, short description of up to three hundred characters, category, physical address, phone number, website link, and storefront image.",
      "We promise that we never ask for or collect sensitive financial data from consumers or merchants, such as credit card numbers, private bank details, or personal home addresses. We never track your real-time GPS coordinates while you visit local shops, nor do we run background monitoring software to track other websites or apps on your device. To protect local businesses against automated spam scripts and organized review-bombing, our servers record an anonymous browser device identifier alongside temporary network connection data. These technical identifiers are used exclusively to enforce our automated twenty-four-hour submission cooldown interval and are never used to build personal tracking dossiers. By keeping data collection strictly limited to what is essential for honest reviews, we protect your personal freedom while preserving an open, transparent community resource everyone can trust.",
    ],
  },
  {
    id: "anti-spam-cooldowns",
    heading: "How We Stop Spam Without Intrusive Tracking",
    paragraphs: [
      "The central challenge for any open community directory is preventing fake reviews, duplicate ratings, and automated spam floods without compromising the trust of everyday patrons who share honest feedback. For our core review submission features, SpillRate does not require user account registration, password creation, or invasive personal profiling. Instead, our review integrity system utilizes an anonymous twenty-four-hour device cooldown mechanism that simply verifies whether a specific browser device recently reviewed that exact business. When you submit a review, our system records an anonymous cryptographic device identifier alongside temporary network markers solely to calculate whether your twenty-four-hour submission waiting interval has passed. These cooldown records cannot be reversed to reveal your private name, your physical home location, your telephone number, or your personal internet activity outside of SpillRate.",
      "Our cooldown identifiers never follow you when you browse other websites across the internet, and we never combine them with personal profiles or commercial data broker lists under any circumstances. Once the twenty-four-hour submission waiting period has concluded, these temporary cooldown records naturally expire, leaving no lingering historical record of your device or connection on our web servers. This privacy-first engineering ensures that honest neighborhood entrepreneurs are effectively protected against coordinated review-bombing mobs, automated bot scripts, and malicious competitor attacks without requiring everyday customers to surrender personal privacy. You can browse local recommendations and submit authentic customer feedback with complete confidence, knowing your digital privacy is respected and your hardware details are never shared, rented, or monetized. We prove that it is entirely possible to operate an open, spam-free local rating directory while upholding the highest standards of digital privacy, transparency, and civic respect.",
    ],
  },
  {
    id: "cookies-and-advertising",
    heading: "Third-Party Advertising, Cookies & Google AdSense",
    paragraphs: [
      "To support our free community platform and ensure local directory access remains open to everyone, SpillRate works with third-party advertising partners, including Google AdSense, to display relevant digital advertisements across our public pages. Third-party vendors, including Google, use cookies, web beacons, and similar technologies to serve ads based on a user's prior visits to SpillRate or other websites across the internet.",
      "Google's use of advertising cookies enables it and its partners to serve personalized or contextual advertisements to our users based on their visit to SpillRate and/or other sites on the Internet. These cookies allow advertising networks to measure advertisement performance, prevent fraudulent impressions or clicks, and present advertisements aligned with general consumer interests without accessing your private personal identification details such as your name, email address, or private communications.",
      "Users have complete freedom to control and personalize their advertising preferences. You may opt out of personalized advertising at any time by visiting Google Ads Settings (https://adssettings.google.com). Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting the Digital Advertising Alliance Consumer Choice page at www.aboutads.info (https://www.aboutads.info) or the Network Advertising Initiative opt-out portal (https://optout.networkadvertising.org). You can also adjust your web browser settings to block or delete cookies entirely at any time.",
    ],
  },
  {
    id: "information-usage",
    heading: "How We Use Your Information",
    paragraphs: [
      "At SpillRate, we believe in complete operational transparency regarding how data is managed, and we promise to use the information you share with us only for clear, honest, and community-centered purposes. We use submitted customer ratings and feedback messages to calculate direct arithmetic score averages for local businesses, ensuring neighborhood consumers make well-informed choices based on truthful community sentiment. We display public customer reviews, star ratings, and uploaded photographs on the corresponding business profile pages so that community members can discover dependable local services and learn from genuine customer experiences. For registered business owners, we utilize Google authentication credentials to confirm merchant identity, grant access to profile editing features, and allow the pinning of up to three highlight reviews. If you submit a moderation report regarding an abusive comment, competitor sabotage, or suspected extortion attempt, our moderation team uses your report details to investigate the claim and uphold our community standards.",
      "We use general, aggregated website performance metrics to identify technical software bugs, optimize server response speeds, and ensure that our directory functions smoothly across all mobile devices and desktop computers. We never sell, rent, trade, or distribute your email address, reviewer name, or private merchant details to third-party telemarketers or external broker databases under any circumstances. We do not send unsolicited promotional marketing emails, and any direct email you receive from us will be strictly related to your administrative inquiries or essential support notices. In rare circumstances where we are legally required by official law enforcement subpoenas or court orders, we may disclose minimal necessary technical information to comply with valid legal processes. Outside of these clear, legitimate operational responsibilities, your information remains safely protected within our secure cloud databases and is never repurposed for commercial exploitation or behavioral tracking.",
    ],
  },
  {
    id: "public-visibility",
    heading: "What Information Is Publicly Visible",
    paragraphs: [
      "Because SpillRate is a public community directory designed to promote local commercial transparency, certain pieces of content you voluntarily submit are intended to be publicly visible to everyone who visits our platform. Whenever you submit a customer review, your chosen display name, your assigned star rating from one to five, your feedback comment, and any uploaded photographs will appear publicly on the business profile page. Reviews are visible to all neighborhood visitors browsing the directory, allowing prospective clients to read authentic customer feedback before making dining, shopping, or service decisions. If a customer review is submitted as an official B2B endorsement by an authenticated business owner, the review will publicly display their registered business name, logo, and a direct link to their official storefront profile. However, your private IP address, unique device identifier, and backend session tokens are never publicly exposed or shared with the businesses you review.",
      "When a verified business owner utilizes their dashboard to pin up to three top customer reviews, those selected reviews will appear prominently at the upper section of their public listing feed for all visitors to see. Public customer reviews and storefront details may be indexed by public search engines like Google, meaning that your feedback may appear in general web searches for that specific local establishment. We strongly advise all reviewers to refrain from including sensitive private information in their public comments, such as home addresses, personal telephone numbers, or private details about individual store workers. If a reviewer or business owner ever identifies an error in their published content, they may reach out to our moderation team through the Contact page to request an update or review removal. By maintaining open public visibility for honest customer feedback while keeping technical connection identifiers strictly private, we balance community transparency with strong individual privacy safeguards.",
    ],
  },
  {
    id: "retention-and-deletion",
    heading: "Data Retention and Your Privacy Rights",
    paragraphs: [
      "We believe that users and business owners should maintain reasonable control over their digital presence, which is why we provide clear procedures to manage, review, or request the deletion of published information. We retain customer reviews and uploaded photographs only for as long as they remain relevant and helpful to our neighborhood community, or until an authorized moderation request is processed. Business owners who sign in through Google OAuth maintain ongoing access to their merchant profiles and can update storefront descriptions, contact details, operating hours, and pinned reviews at any time. If a business owner permanently closes their physical store or ceases commercial operations, they may contact our support desk to request that their public listing be archived or removed from the directory. Everyday customers who submit reviews have the right to request the removal of their published feedback by submitting an inquiry through our official Contact page with details verifying their submission.",
      "Once an approved removal request is processed by our moderation team, the corresponding review, text comments, and attached photos are removed from our active database and will no longer appear on our public website. Temporary device cooldown markers automatically expire and are purged from our caching systems within twenty-four hours of review submission without requiring manual intervention from the user. In limited situations, minimal transactional records may be temporarily retained in secure backups solely to resolve active legal disputes, address fraud investigations, or prevent previously blocked bad actors from returning. To exercise your privacy rights, request data clarification, or report an erroneous listing, simply submit an inquiry through our Contact page or message our operational support team directly. We review all privacy and data deletion requests promptly and confirm the completion of your request within two to three business days without imposing fees or unnecessary administrative hurdles.",
    ],
  },
  {
    id: "contact-privacy",
    heading: "Contacting Our Privacy Team",
    paragraphs: [
      "We are committed to maintaining an open, honest, and accessible relationship with our community regarding our privacy standards, technical security measures, and data handling practices. If you have any questions, concerns, or constructive suggestions regarding how your information is collected, processed, or protected on SpillRate, our privacy team is available to assist you. You can get in touch with our team at any time by visiting our official Contact page and launching a direct message to our support desk using Gmail or your preferred email application. When sending an inquiry regarding a published review or claimed business storefront, please provide relevant details such as the listing URL and your contact email so our team can investigate your request efficiently. Business owners seeking guidance regarding merchant credentials, document verification, or profile data policies are warmly invited to contact our privacy desk directly for prompt operational assistance.",
      "Our operational team reviews incoming privacy communications during regular business hours, Monday to Friday from 9:00 AM to 6:00 PM Philippine Time, excluding official public holidays. We make every reasonable effort to provide thoughtful, personalized responses to privacy questions and data requests within two business days of receiving your message. If you ever discover a security vulnerability or suspect that someone has attempted to scrape directory data or abuse our platform, please alert our privacy team immediately so we can deploy protective measures. We regularly review and update our internal data handling procedures to ensure our platform complies with applicable data privacy regulations and modern cybersecurity standards. Thank you for participating in SpillRate as an authentic community voice, and we remain dedicated to protecting your privacy every step of the way as our local directory grows.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  useDocumentTitle(
    "Privacy Policy & Google AdSense Cookie Disclosures - SpillRate",
    "Understand how SpillRate protects user privacy, enforces anti-spam device cooldowns without tracking, and complies with Google AdSense advertising cookie standards.",
    "/privacy-policy"
  );
  return (
    <LegalDocumentViewer
      title="Privacy Policy"
      lastUpdated="October 2026"
      description="This policy outlines how SpillRate collects, stores, and protects information submitted by community patrons and business owners, including our advertising and cookie policies."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Legal" },
        { label: "Privacy Policy" },
      ]}
      sections={PRIVACY_SECTIONS}
    />
  );
}
