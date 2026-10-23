import React from "react";
import PublicPageHeader from "../components/layout/PublicPageHeader";
import ContactForm from "../components/contact/ContactForm";
import ContactDetailsCard from "../components/contact/ContactDetailsCard";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

export default function ContactPage() {
  useDocumentTitle(
    "Contact Us - SpillRate Community Support & Verification Desk",
    "Get in touch with the SpillRate team for support, merchant storefront verification, feedback, or community moderation inquiries.",
    "/contact"
  );
  return (
    <div>
      <PublicPageHeader
        title="Contact Our Team"
        description="Have a question about a business listing, need assistance with your merchant account, or want to report review abuse? We are here to help."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
        compact={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5">
            <ContactDetailsCard />
          </div>
        </div>
      </div>
    </div>
  );
}