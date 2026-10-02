import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "general",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Please enter a subject.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Please write your message.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Your message must be at least 10 characters long.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate reliable dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        inquiryType: "general",
        subject: "",
        message: "",
      });
    }, 800);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs text-center">
        <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Message Received</h3>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you for getting in touch. Our support team reviews all inquiries and will reply to your email within 24 to 48 business hours.
        </p>
        <button
          type="button"
          onClick={() => setIsSubmitted(false)}
          className="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs"
    >
      <h2 className="text-xl font-bold text-slate-900 mb-1">Send a Message</h2>
      <p className="text-xs sm:text-sm text-slate-600 mb-6">
        Fill out the form below and we will respond as soon as possible.
      </p>

      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="contact-name" className="block text-xs font-semibold uppercase text-slate-700 mb-1">
            Your Full Name <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Maria Santos"
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] ${
              errors.name ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="contact-email" className="block text-xs font-semibold uppercase text-slate-700 mb-1">
            Email Address <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="maria@example.com"
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] ${
              errors.email ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Inquiry Type */}
        <div>
          <label htmlFor="contact-inquiry-type" className="block text-xs font-semibold uppercase text-slate-700 mb-1">
            Inquiry Topic
          </label>
          <select
            id="contact-inquiry-type"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px]"
          >
            <option value="general">General Question</option>
            <option value="business-verification">Business Owner Verification</option>
            <option value="moderation">Report a Review or Spam</option>
            <option value="bug">Technical Issue or Bug</option>
            <option value="feedback">Platform Suggestion</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="contact-subject" className="block text-xs font-semibold uppercase text-slate-700 mb-1">
            Subject <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Regarding my business profile..."
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] ${
              errors.subject ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.subject}</span>
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className="block text-xs font-semibold uppercase text-slate-700 mb-1">
            Message <span className="text-red-600">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Please detail your question or concern..."
            className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
              errors.message ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.message}</span>
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-600"
      >
        <Send className="w-4 h-4" />
        <span>{isSubmitting ? "Sending Inquiry..." : "Submit Inquiry"}</span>
      </button>
    </form>
  );
}