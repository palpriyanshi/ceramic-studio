import React, { useState } from "react";
import { X, Trash2, ShoppingBag, Plus, Minus, Tag, Check } from "lucide-react";
import { createOrder } from "../services/order.service";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  user,
  onLoginRequired
}) {
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0); // in percent
  const [promoError, setPromoError] = useState("");
  const [checkoutStep, setCheckoutStep] = useState("cart"); // cart, shipping, success

  // Form fields for shipping mock
  const [shippingName, setShippingName] = useState("");
  const [shippingEmail, setShippingEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.salePrice || item.price;
    return acc + price * item.quantity;
  }, 0);

  const discountVal = (subtotal * discountAmount) / 100;
  const freeShippingThreshold = 150;
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15.00;
  const total = subtotal - discountVal + shippingCost;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "ARTISAN10") {
      setDiscountApplied(true);
      setDiscountAmount(10);
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try 'ARTISAN10' for 10% off!");
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!shippingName || !shippingEmail || !shippingAddress) {
      alert("Please fill in all shipping details.");
      return;
    }

    if (!user || !user.token) {
      alert("Please log in to place your order.");
      onLoginRequired();
      return;
    }

    try {
      // Map cart products for the backend API
      const itemsPayload = cartItems.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }));

      await createOrder({
        items: itemsPayload,
        shippingAddress: {
          fullName: shippingName,
          email: shippingEmail,
          address: shippingAddress,
        },
        payment: {
          method: "cod",
          status: "pending",
        },
        paymentMethod: "cod",
        shippingCharge: shippingCost,
        discount: discountVal,
      }, user.token);

      setCheckoutStep("success");
      setTimeout(() => {
        onClearCart();
        setCheckoutStep("cart");
        setDiscountApplied(false);
        setDiscountAmount(0);
        setPromoCode("");
        onClose();
      }, 5000);
    } catch (err) {
      console.error("Order creation failed:", err);
      alert(err.message || "Something went wrong while placing your order.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => {
          if (checkoutStep !== "success") onClose();
        }}
      />

      {/* Cart Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-sand-100 flex flex-col shadow-2xl animate-slide-left border-l border-sand-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-sand-200 flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold tracking-wider text-neutral-950 flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 stroke-[1.5]" />
              Your Cart ({cartItems.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-neutral-500 hover:text-neutral-950 transition-colors"
              disabled={checkoutStep === "success"}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {checkoutStep === "cart" && (
            <>
              {/* Free Shipping Progress */}
              {cartItems.length > 0 && (
                <div className="bg-sand-200 px-6 py-3 border-b border-sand-300 text-xs text-neutral-700">
                  {subtotal >= freeShippingThreshold ? (
                    <p className="font-semibold text-green-700 flex items-center">
                      <Check className="h-4 w-4 mr-1.5" />
                      Congratulations! You've earned free shipping!
                    </p>
                  ) : (
                    <p>
                      Spend <span className="font-semibold text-neutral-950">${(freeShippingThreshold - subtotal).toFixed(2)}</span> more to unlock free shipping.
                    </p>
                  )}
                  <div className="w-full bg-sand-300 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-sand-700 h-full transition-all duration-550"
                      style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <ShoppingBag className="h-16 w-16 text-neutral-300 stroke-[1]" />
                    <p className="text-neutral-500 text-sm">Your cart is currently empty.</p>
                    <button
                      onClick={onClose}
                      className="border border-neutral-950 text-xs font-sans tracking-widest uppercase px-6 py-2.5 hover:bg-neutral-950 hover:text-white transition-colors cursor-pointer"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item) => {
                      const itemPrice = item.salePrice || item.price;
                      return (
                        <div key={item.id} className="flex space-x-4 border-b border-sand-200 pb-6">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover bg-sand-200 border border-sand-200 flex-shrink-0"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between text-sm font-serif font-medium text-neutral-950">
                                <h3>{item.name}</h3>
                                <p className="font-sans text-xs ml-4">
                                  ${(itemPrice * item.quantity).toFixed(2)}
                                </p>
                              </div>
                              <p className="text-[11px] text-neutral-500 mt-1 capitalize">
                                {item.category}
                              </p>
                              {item.giftCardDetails && (
                                <div className="text-[10px] text-sand-800 bg-sand-200/50 p-1.5 mt-2 rounded">
                                  <p>To: {item.giftCardDetails.recipientName}</p>
                                  <p>Message: "{item.giftCardDetails.message}"</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                              {/* Quantity adjustments */}
                              <div className="flex items-center border border-sand-300 bg-white">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 hover:bg-sand-100 text-neutral-600 transition-colors"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="px-3 text-xs font-sans text-neutral-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 hover:bg-sand-100 text-neutral-600 transition-colors"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              {/* Remove icon */}
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="text-neutral-400 hover:text-red-700 p-1 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Subtotal, Promo & Checkout Actions */}
              {cartItems.length > 0 && (
                <div className="border-t border-sand-300 bg-sand-200 px-6 py-6 space-y-4">
                  {/* Promo Input */}
                  <form onSubmit={handleApplyPromo} className="flex space-x-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Promo code (e.g. ARTISAN10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={discountApplied}
                        className="w-full bg-white border border-sand-300 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-sand-700 transition-colors uppercase disabled:bg-neutral-100 disabled:text-neutral-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={discountApplied}
                      className="bg-neutral-950 text-white text-xs font-sans tracking-widest uppercase px-4 py-2 hover:bg-neutral-800 disabled:bg-neutral-400 transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  {promoError && <p className="text-[10px] text-red-650">{promoError}</p>}
                  {discountApplied && (
                    <p className="text-[11px] text-green-700 font-semibold flex items-center">
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Promo Applied! 10% discount on products.
                    </p>
                  )}

                  {/* Calculations */}
                  <div className="space-y-1.5 text-xs text-neutral-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-neutral-950">${subtotal.toFixed(2)}</span>
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between text-green-750">
                        <span>Discount (10%)</span>
                        <span>-${discountVal.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-semibold text-neutral-950">
                        {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-t border-sand-350 my-2 pt-2 flex justify-between text-sm font-semibold text-neutral-950">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCheckoutStep("shipping")}
                    className="w-full bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-sans tracking-widest uppercase py-3 transition-colors cursor-pointer text-center"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </>
          )}

          {checkoutStep === "shipping" && (
            <div className="flex-1 flex flex-col justify-between p-6">
              <div className="space-y-6">
                <h3 className="text-base font-serif font-semibold text-neutral-950 border-b border-sand-200 pb-2">
                  Shipping Information
                </h3>
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600 uppercase font-sans">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600 uppercase font-sans">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={shippingEmail}
                      onChange={(e) => setShippingEmail(e.target.value)}
                      className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600 uppercase font-sans">Delivery Address *</label>
                    <textarea
                      required
                      rows={3}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full bg-white border border-sand-300 px-3 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors resize-none"
                    />
                  </div>

                  <div className="border-t border-sand-200 pt-4 mt-6">
                    <div className="flex justify-between text-sm font-semibold text-neutral-950 mb-4">
                      <span>Total Amount</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep("cart")}
                      className="flex-1 border border-neutral-950 text-neutral-950 hover:bg-neutral-100 text-xs font-sans tracking-widest uppercase py-2.5 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-neutral-950 hover:bg-neutral-855 text-white text-xs font-sans tracking-widest uppercase py-2.5 transition-colors cursor-pointer"
                    >
                      Pay & Place Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {checkoutStep === "success" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 stroke-[2]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-semibold text-neutral-950">
                  Order Placed Successfully!
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed px-4">
                  Thank you, <span className="font-semibold text-neutral-800">{shippingName}</span>! Your pottery order is being processed. A confirmation email has been sent to {shippingEmail}.
                </p>
              </div>
              <p className="text-xs text-neutral-450 animate-pulse">
                Closing window in a few seconds...
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
