import React, { useState } from "react";
import { Gift, Mail, Calendar, Sparkles } from "lucide-react";

export default function GiftCard({ onAddCustomToCart }) {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [addedMessage, setAddedMessage] = useState(false);

  const amounts = [25, 50, 100, 200];

  const handleAddGiftCard = (e) => {
    e.preventDefault();
    if (!recipientName || !recipientEmail || !senderName) {
      alert("Please fill in recipient details and sender name.");
      return;
    }

    const giftCardItem = {
      id: `giftcard-${Date.now()}`,
      name: `Ceramic Studio Digital Gift Card ($${selectedAmount})`,
      price: selectedAmount,
      category: "Gift Card",
      image: "https://static.wixstatic.com/media/d01231e46af34161be7ad101d281a441.jpg", // default studio art
      giftCardDetails: {
        recipientName,
        recipientEmail,
        senderName,
        message: message || "Enjoy your handmade pottery!",
        deliveryDate: deliveryDate || "Instant"
      }
    };

    onAddCustomToCart(giftCardItem);
    
    // reset form
    setRecipientName("");
    setRecipientEmail("");
    setMessage("");
    setDeliveryDate("");
    
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 md:px-8 bg-sand-100 font-sans animate-fade-in min-h-screen">
      
      {/* Top title */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] font-sans text-sand-700 font-semibold block">
          Give the Gift of Handcrafted Art
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-medium tracking-wide uppercase text-neutral-950">
          Digital Gift Cards
        </h1>
        <div className="w-12 h-[2px] bg-sand-700 mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Column: Dynamic Gift Card Preview */}
        <div className="space-y-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-serif font-semibold text-neutral-950">
            Card Preview
          </h2>

          {/* Dynamic Card Container */}
          <div className="relative aspect-[1.6/1] w-full bg-sand-900 text-sand-100 shadow-2xl p-8 flex flex-col justify-between overflow-hidden border border-sand-800">
            {/* Card Background Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://static.wixstatic.com/media/d01231e46af34161be7ad101d281a441.jpg"
                alt="Studio backdrop"
                className="w-full h-full object-cover opacity-20"
              />
            </div>

            {/* Top Row: Logo, Gift icon */}
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-xs font-serif tracking-[0.2em] font-semibold text-sand-300">
                  C E R A M I C - S T U D I O
                </p>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
                  Digital E-Gift Card
                </p>
              </div>
              <Gift className="h-6 w-6 text-sand-700 stroke-[1.5]" />
            </div>

            {/* Middle Row: Amount */}
            <div className="relative z-10 my-4">
              <span className="text-3xl sm:text-5xl font-serif font-light text-white tracking-wide">
                ${selectedAmount}
              </span>
            </div>

            {/* Bottom Row: Recipient details & message preview */}
            <div className="relative z-10 border-t border-sand-800 pt-4 flex justify-between text-[11px] text-neutral-350">
              <div className="space-y-1">
                <p className="font-sans">
                  <span className="text-neutral-450 uppercase text-[9px] tracking-wider block">Recipient</span>
                  <span className="font-semibold text-white truncate max-w-[150px] inline-block">
                    {recipientName || "Sarah Jenkins"}
                  </span>
                </p>
              </div>
              {senderName && (
                <div className="text-right space-y-1">
                  <p className="font-sans">
                    <span className="text-neutral-450 uppercase text-[9px] tracking-wider block">From</span>
                    <span className="font-semibold text-white truncate max-w-[150px] inline-block">
                      {senderName}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-sand-200 p-4 border border-sand-300/40 text-xs text-neutral-600 space-y-2 leading-relaxed">
            <h4 className="font-bold text-neutral-900 flex items-center">
              <Sparkles className="h-4 w-4 mr-1.5 text-sand-700" />
              Gift Card Information
            </h4>
            <p>
              This is a digital gift card. After purchasing, you will receive an email confirmation, and the recipient will receive the gift card email at the scheduled delivery date containing a unique coupon code they can use during checkout.
            </p>
          </div>
        </div>

        {/* Right Column: Order Form */}
        <div className="bg-sand-200/40 p-8 border border-sand-300/40">
          <form onSubmit={handleAddGiftCard} className="space-y-6">
            
            {/* Amount Selector */}
            <div className="space-y-3">
              <label className="text-xs text-neutral-600 uppercase tracking-widest block font-sans font-bold">
                Select Amount *
              </label>
              <div className="grid grid-cols-4 gap-3">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedAmount(amount)}
                    className={`py-3 text-sm font-sans tracking-wide transition-all border cursor-pointer
                      ${selectedAmount === amount ? "bg-neutral-950 text-white border-neutral-950" : "bg-white text-neutral-800 border-sand-300 hover:border-neutral-950"}
                    `}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient details */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-600 uppercase tracking-widest block font-sans">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Who is this card for?"
                  className="w-full bg-white border border-sand-300 px-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-600 uppercase tracking-widest block font-sans">
                  Recipient Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full bg-white border border-sand-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-600 uppercase tracking-widest block font-sans">
                  Sender Name *
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-white border border-sand-300 px-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-600 uppercase tracking-widest block font-sans">
                  Personal Message (Optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a warm note to your recipient here..."
                  maxLength={200}
                  className="w-full bg-white border border-sand-300 px-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-600 uppercase tracking-widest block font-sans">
                  Delivery Date (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4.5 w-4.5 text-neutral-400" />
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-white border border-sand-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                  />
                </div>
                <p className="text-[10px] text-neutral-500 italic mt-1">
                  Leave blank for immediate delivery upon checkout completion.
                </p>
              </div>
            </div>

            {/* Submission */}
            <div className="pt-4 space-y-2">
              <button
                type="submit"
                className="w-full bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-sans tracking-widest uppercase py-3.5 transition-colors cursor-pointer"
              >
                Add Gift Card to Cart
              </button>
              {addedMessage && (
                <p className="text-xs text-green-700 font-semibold text-center animate-pulse">
                  ✓ Gift Card successfully added to your cart!
                </p>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
