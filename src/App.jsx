import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SocialBar from "./components/SocialBar";
import CartDrawer from "./components/CartDrawer";
import ProductModal from "./components/ProductModal";

// Views
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import GiftCard from "./pages/GiftCard";
import Contact from "./pages/Contact";

// Data
import { products, categories } from "./data/productsData";
import { User, LogIn, Mail, Lock, X } from "lucide-react";

export default function App() {
  const [activeView, setActiveView] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Login modal and state
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeView]);

  // Cart operations
  const handleAddToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && !item.giftCardDetails
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
    setCartOpen(true);
  };

  const handleAddCustomToCart = (customItem) => {
    setCart((prevCart) => [...prevCart, { ...customItem, quantity: 1 }]);
    setCartOpen(true);
  };

  const handleUpdateQuantity = (itemId, newQty) => {
    if (newQty < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleProductClick = (product) => {
    setActiveProduct(product);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Mock login handling
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert("Please fill in both email and password.");
      return;
    }
    // Mock user session
    setUser({
      name: loginEmail.split("@")[0],
      email: loginEmail
    });
    setLoginOpen(false);
    setLoginEmail("");
    setLoginPassword("");
  };

  const handleLogout = () => {
    setUser(null);
    alert("You have logged out successfully.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-sand-100 selection:bg-sand-300">
      {/* Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={cartCount}
        onCartToggle={() => setCartOpen(true)}
        onSearchToggle={() => setActiveView("shop")}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
        onLoginToggle={() => {
          if (user) {
            if (window.confirm("Do you want to log out?")) handleLogout();
          } else {
            setLoginOpen(true);
          }
        }}
      />

      {/* Floating social bar */}
      <SocialBar />

      {/* Main Pages Container */}
      <main className="flex-1">
        {activeView === "home" && (
          <Home
            products={products}
            setActiveView={setActiveView}
            onProductClick={handleProductClick}
          />
        )}
        {activeView === "shop" && (
          <Shop
            products={products}
            categories={categories}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        {activeView === "about" && <About />}
        {activeView === "gift-card" && (
          <GiftCard onAddCustomToCart={handleAddCustomToCart} />
        )}
        {activeView === "contact" && <Contact />}
      </main>

      {/* Footer */}
      <Footer setActiveView={setActiveView} />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Product Detail Overlay Modal */}
      <ProductModal
        product={activeProduct}
        isOpen={activeProduct !== null}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Mock Account Login Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <div
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            onClick={() => setLoginOpen(false)}
          />
          <div className="relative bg-sand-100 max-w-sm w-full p-8 border border-sand-300 shadow-2xl animate-scale-up z-10 flex flex-col">
            <button
              onClick={() => setLoginOpen(false)}
              className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-12 h-12 bg-sand-200 text-neutral-700 rounded-full flex items-center justify-center border border-sand-300 mb-2">
                <LogIn className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-neutral-950">
                Log In to Your Account
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Enter details below for quick guest member access.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-600 uppercase font-sans">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-white border border-sand-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-600 uppercase font-sans">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-neutral-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-sand-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-sans tracking-widest uppercase py-3 transition-colors cursor-pointer text-center mt-2"
              >
                Log In
              </button>

              <button
                type="button"
                onClick={() => {
                  setUser({ name: "Studio Member", email: "member@ceramic.studio" });
                  setLoginOpen(false);
                }}
                className="w-full border border-neutral-950 text-neutral-950 hover:bg-neutral-100 text-xs font-sans tracking-widest uppercase py-2 transition-colors cursor-pointer text-center"
              >
                Quick Guest Bypass
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
