import React, { useState } from "react";
import { Mail, Phone, MapPin, Check } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = "Name is required.";
    if (!email.trim()) {
      tempErrors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) tempErrors.email = "Please enter a valid email address.";
    }
    if (!subject.trim()) tempErrors.subject = "Subject is required.";
    if (!message.trim()) tempErrors.message = "Message is required.";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    // Success
    setErrors({});
    setFormSubmitted(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");

    // hide success message after 6 seconds
    setTimeout(() => setFormSubmitted(false), 6000);
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 md:px-8 bg-sand-100 font-sans animate-fade-in min-h-screen">
      
      {/* Top Title Banner */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] font-sans text-sand-700 font-semibold block">
          Visit Us or Get in Touch
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-medium tracking-wide uppercase text-neutral-950">
          Contact & Studio Hours
        </h1>
        <div className="w-12 h-[2px] bg-sand-700 mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Column: Contact details & Opening Hours */}
        <div className="space-y-12">
          {/* Details list */}
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-neutral-950">
              The Ceramic Studio
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-sans font-light">
              Our studio space is located in the heart of San Francisco. Stop by to view our latest stoneware creations on display, purchase ceramics directly from our kiln shelves, or chat about custom dinnerware commissions.
            </p>

            <div className="space-y-4 text-sm text-neutral-600">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-sand-700 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-neutral-900">Our Location</p>
                  <p className="mt-0.5">500 Terry Francine St. San Francisco, CA 94158</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-sand-700 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-neutral-900">Phone</p>
                  <p className="mt-0.5">123-456-7890</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 text-sand-700 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-neutral-900">Email Address</p>
                  <p className="mt-0.5">info@my-domain.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Operating hours */}
          <div className="bg-sand-200 p-8 border border-sand-300/40">
            <h3 className="text-sm font-sans font-bold tracking-widest text-neutral-950 uppercase border-b border-sand-300 pb-3 mb-4">
              Studio Open Hours
            </h3>
            <div className="space-y-3 text-sm text-neutral-600 font-sans font-light">
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-850">Monday - Friday</span>
                <span>7:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-850">Saturday</span>
                <span>8:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-850">Sunday</span>
                <span>8:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>

          {/* Stylized Brand Map Concept */}
          <div className="relative h-60 bg-neutral-900 overflow-hidden shadow border border-sand-300">
            <div className="absolute inset-0 bg-sand-200 flex flex-col justify-center items-center text-center p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-sand-700 text-white flex items-center justify-center animate-bounce shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-serif font-bold text-neutral-950">500 Terry Francine St.</p>
                <p className="text-xs text-neutral-600">San Francisco, CA 94158</p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-sans tracking-widest uppercase border-b border-neutral-950 pb-0.5 text-neutral-950 hover:text-sand-700 hover:border-sand-700 transition-colors"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Inquiry Form */}
        <div className="bg-sand-200/40 p-8 border border-sand-300/40">
          <h2 className="text-xl font-serif font-semibold text-neutral-950 mb-6">
            Send an Inquiry
          </h2>

          <form onSubmit={handleContactSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs text-neutral-600 uppercase tracking-widest block font-sans">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-sand-300 px-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
              />
              {errors.name && <p className="text-[11px] text-red-600">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-600 uppercase tracking-widest block font-sans">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-sand-300 px-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
              />
              {errors.email && <p className="text-[11px] text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-600 uppercase tracking-widest block font-sans">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white border border-sand-300 px-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
              />
              {errors.subject && <p className="text-[11px] text-red-600">{errors.subject}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-600 uppercase tracking-widest block font-sans">
                Message *
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border border-sand-300 px-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors resize-none"
              />
              {errors.message && <p className="text-[11px] text-red-600">{errors.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-sans tracking-widest uppercase py-3.5 transition-colors cursor-pointer"
              >
                Send Message
              </button>
            </div>

            {formSubmitted && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs flex items-start space-x-2 animate-fade-in mt-4">
                <Check className="h-4 w-4 text-green-700 mt-0.5 flex-shrink-0" />
                <p>
                  <span className="font-semibold block">Message Sent Successfully!</span>
                  Sarah will review your inquiry and respond within 24-48 hours. Thank you!
                </p>
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
