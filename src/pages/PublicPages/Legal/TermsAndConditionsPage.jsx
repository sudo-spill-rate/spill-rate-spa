import React from "react";
import LegalDocumentViewer from "../components/legal/LegalDocumentViewer";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const TERMS_SECTIONS = [
  {
    id: "acceptance-of-terms",
    heading: "Acceptance of Terms",
    paragraphs: [
      "Welcome to SpillRate, an open and independent local business directory created to help community members discover dependable neighborhood establishments through transparent customer ratings and feedback. By visiting our website, browsing local business listings, submitting customer reviews, or accessing the Business Portal, you agree to comply with and be bound by these Terms and Conditions. These terms apply to all individuals who interact with SpillRate, including casual visitors searching for services, everyday customers submitting firsthand feedback, and business owners managing their storefront profiles. You must be at least eighteen years of age or possess legal capacity under your local laws to submit reviews, register business entities, or enter into this binding agreement. Everyday customers can freely explore the directory and submit reviews without creating an account, while business owners must authenticate using Google OAuth to manage and claim commercial storefronts.",
      "You agree to use SpillRate exclusively for lawful, honest, and peaceful purposes, and you strictly promise never to compromise our system security, scrape directory data for commercial sale, or harass other users. We reserve the right to amend, update, or refine these Terms and Conditions at any time to reflect platform enhancements, introduce new community features, or maintain safety standards against spam and manipulation. Whenever meaningful revisions are made to these terms, we will immediately update the effective date displayed at the top of this document so our community remains informed of current policies. Your continued use of our directory following the posting of updated terms signifies your voluntary acceptance of and agreement to follow all revised conditions. If at any point you disagree with any portion of these Terms and Conditions, your sole and exclusive remedy is to immediately discontinue your use of SpillRate.",
    ],
  },
  {
    id: "review-guidelines",
    heading: "Review Guidelines & Community Rules",
    paragraphs: [
      "SpillRate relies entirely on authentic firsthand consumer experiences to maintain a trustworthy directory, meaning every review, rating score, and attached image must reflect a real customer transaction. You must never submit feedback for any business that you have not personally visited, purchased goods from, or hired for services, as secondhand rumors or fabricated stories compromise community trust. Customer reviews are completely open and do not require account registration, but each submission must include your name, a rating from one to five stars, and a constructive comment of up to five hundred characters. Reviewers may also attach up to two real photographs to showcase their experience, provided the images are genuine, relevant, and free of inappropriate, offensive, or promotional content. To prevent duplicate ratings and organized review-bombing, our platform enforces an automated twenty-four-hour device cooldown that restricts immediate repeated submissions for the same business from the same browser device.",
      "You are strictly prohibited from accepting monetary payments, free merchandise, special discounts, or commercial incentives in exchange for publishing positive ratings or negative complaints on our platform. Business owners, managers, and current employees may never submit customer ratings for their own establishments, nor may they recruit friends, relatives, or marketing agencies to post artificial compliments. It is equally forbidden for any merchant or affiliated representative to leave dishonest negative reviews on competitor profiles in an effort to artificially deflate competitor scores or divert local patrons. Registered businesses may submit official B2B endorsements for commercial partners, provided the endorsement represents a genuine professional collaboration and is submitted through an authenticated merchant account. Reviews containing explicit hate speech, personal doxxing, private telephone numbers, vulgar profanity, or extortion demands violate our core community guidelines and will be removed promptly by moderation.",
    ],
  },
  {
    id: "zero-pay-to-remove",
    heading: "Zero Pay-to-Remove Guarantee",
    paragraphs: [
      "SpillRate operates on a strict and permanent zero pay-to-remove guarantee, meaning our platform will never sell review removal services, paid comment concealment, or sponsored score boosts to any business. Unlike conventional advertising directories that allow paying merchants to bury unfavorable feedback behind subscription paywalls, SpillRate treats every neighborhood establishment equally regardless of advertising budget or financial size. Every star score displayed on a business profile is calculated through a transparent arithmetic average of all approved community evaluations, ensuring that raw customer sentiment is mathematically preserved. When a business receives critical or negative feedback from an unsatisfied patron, that review remains publicly visible as long as it adheres to our community guidelines, even if the merchant strongly disagrees with the opinion. Business owners cannot purchase premium memberships, reputation cleansing packages, or special advertising tiers to delete legitimate customer complaints regarding poor service, delayed delivery, or unexpected pricing.",
      "Our moderation team only removes or edits customer feedback if an objective investigation confirms that the review directly violates published community rules, such as containing hate speech, threats, or extortion. If a business owner contacts our support team demanding the removal of an authentic negative review, our policy strictly upholds the customer's honest experience and encourages professional public engagement. While verified owners have the privilege to pin up to three favorite customer reviews to the top of their profile feed, pinned reviews do not override or replace genuine mathematical averages. Verified merchants may also manage visibility settings for moderation purposes, but all valid ratings remain part of the cumulative score to protect overall directory accuracy. Our zero pay-to-remove guarantee ensures that neighborhood families can explore local establishments with confidence, knowing every high rating reflects genuine community satisfaction rather than paid commercial influence.",
    ],
  },
  {
    id: "business-owner-rules",
    heading: "Rules for Business Owners",
    paragraphs: [
      "Legitimate business owners, managers, and authorized corporate representatives can register or claim up to five storefront listings completely free of charge by signing in with their official Google account. During registration, business owners must provide accurate operational information, including official trade name, short description of up to three hundred characters, commercial category, physical address, phone number, and storefront image. To protect businesses against fraudulent claims by competitors or unauthorized third parties, our verification team reviews business credentials within forty-eight business hours before awarding the Verified Merchant badge. Verified business owners gain access to a dedicated merchant dashboard where they can update store hours, manage contact details, and actively oversee their public digital presence. Owners can select up to three outstanding community reviews to pin at the very top of their business profile, allowing them to showcase exceptional service moments to browsing customers.",
      "Business owners with authenticated accounts can also publish official B2B endorsements to publicly vouch for trusted suppliers, contractors, and neighboring commercial partners within the community. All owner interactions, profile updates, and communications must remain strictly professional, respectful, and free of aggressive harassment, customer intimidation, or retaliatory threats against negative reviewers. Business owners are never permitted to offer refunds, discounts, free meals, or financial incentives conditioned upon a customer agreeing to delete, modify, or inflate an existing review. Merchants have an ongoing responsibility to maintain truthful operating hours, accurate physical store locations, and valid contact information so neighborhood consumers are never inconvenienced or misled. By engaging transparently with community feedback and utilizing our free management tools constructively, verified business owners build lasting neighborhood goodwill and strengthen local economic trust.",
    ],
  },
  {
    id: "content-moderation",
    heading: "Content Moderation & Enforcement",
    paragraphs: [
      "SpillRate safeguards community integrity using automated submission filters paired with human moderation to ensure all directory content complies with our established platform standards. Our automated systems enforce platform boundaries by validating character limits of five hundred characters, verifying photo attachment allowances of two images, and applying twenty-four-hour device cooldown intervals. While our team does not manually screen every review prior to publication, our moderation staff promptly investigates every reported submission flagged by community members or business owners. If an investigation confirms that a review contains commercial spam, competitor sabotage, extortion attempts, or hateful attacks, the offending content is permanently removed from the business listing. Users who attempt to manipulate ratings through automated scripts, proxy networks, or repetitive submission patterns will have their submissions blocked and device access restricted.",
      "Business profiles found repeatedly purchasing fake feedback, engaging in review extortion, or launching coordinated attacks against competitors risk receiving public warning flags on their storefront page. We maintain zero tolerance for customer extortion, meaning any reviewer who threatens negative feedback in exchange for free merchandise, cash refunds, or special favors will be permanently banned. All moderation decisions are made impartially based strictly on factual evidence and community guidelines, without regard to personal preferences, merchant size, or financial influence. If a business owner or customer believes content was moderated in error, they may submit a formal appeal through our Contact page providing relevant context and documentation. Our moderation framework balances open consumer free expression with essential merchant protections, maintaining a safe, transparent, and dependable directory where authentic local businesses can thrive.",
    ],
  },
  {
    id: "disclaimers-liability",
    heading: "General Disclaimers",
    paragraphs: [
      "Every customer review, star rating, comment, and photograph published on SpillRate represents solely the subjective personal experience and opinion of the individual reviewer, not SpillRate. SpillRate operates as an independent community directory and discussion platform, and we do not endorse, guarantee, certify, or warrant the quality, safety, or legality of any listed business. While our team strives to maintain an accurate and spam-free directory, we cannot guarantee that all storefront hours, pricing details, addresses, or user statements are perpetually complete or error-free. Consumers are encouraged to independently verify critical business information, such as professional licensing, operating schedules, and pricing estimates, before engaging services or making financial commitments. The SpillRate website, directory tools, and merchant features are provided on an as-is and as-available basis, without warranties of any kind, whether express, statutory, or implied by law.",
      "We do not warrant that platform operations will be completely uninterrupted, secure, or free from temporary technical errors, server maintenance delays, or unexpected network outages. SpillRate, its developers, and operational staff shall not be liable for any indirect, incidental, or financial damages resulting from reliance on directory information or customer transactions with merchants. Any commercial transactions, service disputes, warranty issues, or personal disagreements arising between customers and listed businesses must be resolved directly between those parties under applicable local laws. We reserve the right to modify, adjust, suspend, or discontinue any platform feature, directory category, or user tool at any time without prior liability or individual notice. By using SpillRate, you acknowledge and agree that your browsing of local listings, reading of ratings, and visits to featured establishments are undertaken entirely at your own personal judgment and risk.",
    ],
  },
  {
    id: "contact-support",
    heading: "Questions & Reporting",
    paragraphs: [
      "We welcome open communication with our community and encourage questions, feature suggestions, bug reports, and moderation inquiries regarding how we can serve your neighborhood better. If you discover a review that violates our community standards, contains hateful language, or appears to be fraudulent competitor sabotage, please submit a report immediately. When reporting a violation, please provide specific factual details, including the business profile link, the reviewer name, and a clear explanation of why the review breaks platform rules. Business owners experiencing technical difficulties claiming a storefront, updating operational details, or utilizing pinning tools are invited to contact our operational support team for assistance. You can reach our team directly through our Contact page, where you can launch a pre-filled message to our official support email using Gmail or your preferred email application.",
      "Our operational team reviews incoming communications during standard business hours, Monday to Friday from 9:00 AM to 6:00 PM Philippine Time, excluding official public holidays. We make every reasonable effort to review submitted inquiries, verify merchant identity documents, and respond to community reports within two business days of receipt. All communications, verification records, and fraud reports are handled confidentially and processed in accordance with the security standards detailed in our Privacy Policy. Please understand that submitting a moderation report does not guarantee content removal, as our team must objectively verify that a specific platform violation occurred before taking administrative action. Together, by respecting these community terms and sharing truthful experiences, we can maintain an honest, dependable directory where authentic local businesses thrive and neighborhood consumers discover quality services.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  useDocumentTitle(
    "Terms of Service & Community Guidelines - SpillRate",
    "Review our community terms, merchant guidelines, honest review standards, content moderation rules, and platform usage policies.",
    "/terms"
  );
  return (
    <LegalDocumentViewer
      title="Terms and Conditions"
      lastUpdated="October 2026"
      description="Simple, transparent terms governing how community members and business owners use SpillRate."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Legal" },
        { label: "Terms and Conditions" },
      ]}
      sections={TERMS_SECTIONS}
    />
  );
}