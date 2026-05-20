import React, { useState } from "react";
import { X, Plus, Minus, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // description, specifications, shipping

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
    onClose();
  };

  const finalPrice = product.salePrice || product.price;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-sand-100 max-w-4xl w-full rounded-none shadow-2xl flex flex-col md:flex-row overflow-hidden border border-sand-300 animate-scale-up z-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 text-neutral-500 hover:text-neutral-950 bg-sand-100/50 backdrop-blur-sm rounded-full transition-colors border border-sand-200/50 cursor-pointer"
          aria-label="Close details"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left: Product Images Display */}
        <div className="w-full md:w-1/2 relative bg-sand-200 group flex items-center justify-center min-h-[300px] md:min-h-[480px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          {product.salePrice && (
            <span className="absolute top-4 left-4 bg-clay-500 text-white text-[10px] uppercase font-sans tracking-widest px-3 py-1">
              Sale
            </span>
          )}
        </div>

        {/* Right: Product Purchase Area */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-[600px] custom-scrollbar">
          <div className="space-y-6">
            
            {/* Title & Price */}
            <div>
              <span className="text-[11px] text-neutral-500 uppercase tracking-widest">
                {product.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-950 mt-1 leading-tight">
                {product.name}
              </h2>
              <div className="flex items-center space-x-3 mt-3">
                {product.salePrice ? (
                  <>
                    <span className="text-lg font-semibold text-clay-500">${product.salePrice.toFixed(2)}</span>
                    <span className="text-sm text-neutral-450 line-through">${product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-lg font-semibold text-neutral-900">${product.price.toFixed(2)}</span>
                )}
              </div>
            </div>

            {/* Middle Section: Tab Switchers */}
            <div className="space-y-4">
              <div className="flex border-b border-sand-300">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-2 text-xs font-sans tracking-widest uppercase border-b-2 mr-6 transition-all cursor-pointer
                    ${activeTab === "description" ? "border-sand-700 text-neutral-950 font-semibold" : "border-transparent text-neutral-500 hover:text-neutral-950"}
                  `}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("specifications")}
                  className={`pb-2 text-xs font-sans tracking-widest uppercase border-b-2 mr-6 transition-all cursor-pointer
                    ${activeTab === "specifications" ? "border-sand-700 text-neutral-950 font-semibold" : "border-transparent text-neutral-500 hover:text-neutral-950"}
                  `}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`pb-2 text-xs font-sans tracking-widest uppercase border-b-2 transition-all cursor-pointer
                    ${activeTab === "shipping" ? "border-sand-700 text-neutral-950 font-semibold" : "border-transparent text-neutral-500 hover:text-neutral-950"}
                  `}
                >
                  Shipping
                </button>
              </div>

              {/* Tab Contents */}
              <div className="text-sm text-neutral-650 leading-relaxed min-h-[100px]">
                {activeTab === "description" && (
                  <p className="animate-fade-in">{product.description}</p>
                )}

                {activeTab === "specifications" && (
                  <div className="space-y-2 animate-fade-in text-xs">
                    {product.details.material && (
                      <p>
                        <span className="font-semibold text-neutral-800">Material:</span> {product.details.material}
                      </p>
                    )}
                    {product.details.dimensions && (
                      <p>
                        <span className="font-semibold text-neutral-800">Dimensions:</span> {product.details.dimensions}
                      </p>
                    )}
                    {product.details.capacity && (
                      <p>
                        <span className="font-semibold text-neutral-800">Capacity:</span> {product.details.capacity}
                      </p>
                    )}
                    {product.details.care && (
                      <p>
                        <span className="font-semibold text-neutral-800">Care Instructions:</span> {product.details.care}
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className="space-y-3 animate-fade-in text-xs text-neutral-600">
                    <div className="flex items-start">
                      <Truck className="h-4 w-4 text-neutral-500 mr-2 flex-shrink-0" />
                      <p>Eco-conscious plastic-free packing. Dispatched within 2-4 business days.</p>
                    </div>
                    <div className="flex items-start">
                      <ShieldCheck className="h-4 w-4 text-neutral-500 mr-2 flex-shrink-0" />
                      <p>Securely wrapped in biodegradable bubblewrap to prevent breaks during shipping.</p>
                    </div>
                    <div className="flex items-start">
                      <RotateCcw className="h-4 w-4 text-neutral-500 mr-2 flex-shrink-0" />
                      <p>Hassle-free 30 day returns on undamaged wares. Returns processed within 7 days.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-xs text-neutral-500 uppercase tracking-widest">Quantity</span>
              <div className="flex items-center border border-sand-300 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-sand-100 text-neutral-600 transition-colors cursor-pointer"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-5 text-sm font-sans font-medium text-neutral-850">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-sand-100 text-neutral-600 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart button */}
          <div className="pt-8">
            <button
              onClick={handleAddToCart}
              className="w-full bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-sans tracking-widest uppercase py-3.5 transition-colors cursor-pointer"
            >
              Add to Cart - ${(finalPrice * quantity).toFixed(2)}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
