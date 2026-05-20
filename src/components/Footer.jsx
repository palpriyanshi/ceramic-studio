import React, { useState } from "react";

export default function Footer({ setActiveView }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  const footerLinks = [
    { label: "FAQ", action: () => alert("FAQ clicked: Frequently Asked Questions page mock.") },
    { label: "Shipping & Returns", action: () => alert("Shipping & Returns policy mock.") },
    { label: "Store Policy", action: () => alert("Store Policy page mock.") },
    { label: "Payment Methods", action: () => alert("We accept Credit Cards, PayPal, and Apple Pay.") }
  ];

  return (
    <footer className="bg-sand-200 border-t border-sand-300 text-neutral-800 pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Column 1: Brand & Links */}
        <div className="flex flex-col space-y-6">
          <h2 className="text-lg font-serif font-semibold tracking-wider text-neutral-950">
            CERAMIC-STUDIO
          </h2>
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => setActiveView("home")}
              className="text-left text-sm text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => setActiveView("shop")}
              className="text-left text-sm text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              Shop
            </button>
            <button
              onClick={() => setActiveView("about")}
              className="text-left text-sm text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => setActiveView("gift-card")}
              className="text-left text-sm text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              Gift Card
            </button>
            <button
              onClick={() => setActiveView("contact")}
              className="text-left text-sm text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              Contact
            </button>
          </nav>
        </div>

        {/* Column 2: Contact Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-sans font-bold tracking-widest text-neutral-950 uppercase">
            Contact Us
          </h3>
          <div className="text-sm text-neutral-600 space-y-2 leading-relaxed">
            <p>
              <span className="font-semibold text-neutral-850">A:</span> 500 Terry Francine St.
              <br />San Francisco, CA 94158
            </p>
            <p>
              <span className="font-semibold text-neutral-850">T:</span> 123-456-7890
            </p>
            <p>
              <span className="font-semibold text-neutral-850">E:</span> info@my-domain.com
            </p>
          </div>
        </div>

        {/* Column 3: Hours */}
        <div className="space-y-4">
          <h3 className="text-sm font-sans font-bold tracking-widest text-neutral-950 uppercase">
            Store Hours
          </h3>
          <div className="text-xs text-neutral-650 space-y-2 leading-relaxed">
            <p>
              <span className="font-semibold block text-neutral-800">MON - FRI:</span>
              7:00 AM - 10:00 PM
            </p>
            <p>
              <span className="font-semibold block text-neutral-800">SATURDAY:</span>
              8:00 AM - 10:00 PM
            </p>
            <p>
              <span className="font-semibold block text-neutral-800">SUNDAY:</span>
              8:00 AM - 11:00 PM
            </p>
          </div>
        </div>

        {/* Column 4: Newsletter */}
        <div className="space-y-4">
          <h3 className="text-sm font-sans font-bold tracking-widest text-neutral-950 uppercase">
            Join Our Newsletter
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="flex flex-col space-y-1">
              <input
                type="email"
                placeholder="Enter your email here *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-sand-300 px-4 py-2 text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-sand-700 transition-colors"
              />
              {error && <span className="text-[11px] text-red-600 font-sans">{error}</span>}
              {subscribed && (
                <span className="text-[11px] text-green-700 font-sans">
                  Thank you! You've successfully subscribed.
                </span>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-sans tracking-widest uppercase py-2.5 transition-colors cursor-pointer"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[10px] text-neutral-500 italic">
            * Yes, subscribe me to your newsletter.
          </p>
        </div>
      </div>

      {/* Bottom copyright & payment methods */}
      <div className="max-w-7xl mx-auto border-t border-sand-300/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Policies Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500">
          {footerLinks.map((link, idx) => (
            <React.Fragment key={link.label}>
              <button onClick={link.action} className="hover:text-neutral-950 transition-colors">
                {link.label}
              </button>
              {idx < footerLinks.length - 1 && <span className="text-sand-300">/</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Social Icons for Mobile */}
        <div className="flex lg:hidden items-center space-x-6 text-neutral-600">
          <a href="https://facebook.com/wix" target="_blank" rel="noreferrer" aria-label="Facebook">
            <svg className="w-5 h-5 fill-current hover:text-sand-700 transition-colors" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1H13c-3.3 0-4 1.7-4 4v3z" /></svg>
          </a>
          <a href="https://instagram.com/wix" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg className="w-5 h-5 fill-current hover:text-sand-700 transition-colors" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
          </a>
          <a href="https://pinterest.com/wixcom/" target="_blank" rel="noreferrer" aria-label="Pinterest">
            <svg className="w-5 h-5 fill-current hover:text-sand-700 transition-colors" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.36 11.985-11.97C24.012 5.37 18.625 0 12.017 0z" /></svg>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-neutral-500 text-center md:text-right">
          &copy; 2035 by Ceramic-Studio. Powered and secured by Wix
        </p>
      </div>
    </footer>
  );
}
