import React from "react";
import PublicPageHeader from "../components/layout/PublicPageHeader";
import ContactForm from "../components/contact/ContactForm";
import ContactDetailsCard from "../components/contact/ContactDetailsCard";

export default function ContactPage() {
  return (
    <div>
      <PublicPageHeader
        title="Contact Our Team"
        description="Have a question about a business listing, need assistance with your merchant account, or want to report review abuse? We are here to help."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
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