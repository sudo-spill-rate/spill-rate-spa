import React, { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [inquiryTopic, setInquiryTopic] = useState("General Question");
  const [error, setError] = useState("");

  const supportEmail = "support@trustrate.local";

  const buildSubjectAndBody = () => {
    const trimmedName = name.trim();
    const subject = `[TrustRate Support] ${inquiryTopic} - ${trimmedName}`;
    const body = `Hi TrustRate Support,\n\nMy name is ${trimmedName}.\n\nInquiry Topic: ${inquiryTopic}\n\n[Please write your message here...]`;
    return { subject, body };
  };

  const handleOpenGmail = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setError("");

    const { subject, body } = buildSubjectAndBody();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      supportEmail
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <form
      onSubmit={handleOpenGmail}
      noValidate
      className="bg-white p-5 sm:p-7 lg:p-8 rounded-2xl border border-slate-200/90 shadow-xs"
    >
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-1">
        Send an Email
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
        Choose your topic and enter your name to open a pre-filled email directly in Gmail.
      </p>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Your Full Name <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. Maria Santos"
            className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] ${
              error ? "border-red-500" : "border-slate-300"
            }`}
          />
          {error && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {error}
            </p>
          )}
        </div>

        {/* Inquiry Topic (Becomes the Subject) */}
        <div>
          <label htmlFor="contact-topic" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Inquiry Topic <span className="text-slate-400 text-[11px] font-normal lowercase">(will be the email subject)</span>
          </label>
          <select
            id="contact-topic"
            value={inquiryTopic}
            onChange={(e) => setInquiryTopic(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
          >
            <option value="General Question">General Question</option>
            <option value="Business Owner Verification">Business Owner Verification</option>
            <option value="Report a Review or Spam">Report a Review or Spam</option>
            <option value="Technical Issue or Bug">Technical Issue or Bug</option>
            <option value="Platform Feedback">Platform Suggestion or Feedback</option>
          </select>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-semibold text-sm rounded-xl transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600"
        >
          Open in Gmail
        </button>
      </div>

      <p className="mt-3.5 text-[11px] text-slate-500 text-center leading-normal">
        Opens Gmail with the subject and recipient (<code className="text-slate-700 font-mono">support@trustrate.local</code>) already filled in.
      </p>
    </form>
  );
}