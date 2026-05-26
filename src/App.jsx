import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SocialBar from "./components/SocialBar";
import CartDrawer from "./components/CartDrawer";
import ProductModal from "./components/ProductModal";
import AuthModal from "./components/AuthModal";

// Views
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import GiftCard from "./pages/GiftCard";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";

// Services
import { fetchProducts, fetchCategories } from "./services/product.service";
import { loginUser, registerUser, fetchUserProfile } from "./services/auth.service";

export default function App() {
  const [activeView, setActiveView] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Products and categories loaded from backend
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All Products"]);

  // Authentication state
  const [loginOpen, setLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'
  const [user, setUser] = useState(null);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const loadProducts = async () => {
    try {
      const prodData = await fetchProducts(100);
      setProducts(prodData);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  // Restore session and fetch initial products/categories
  useEffect(() => {
    const savedToken = localStorage.getItem("ceramic_token");
    if (savedToken) {
      const restoreSession = async () => {
        try {
          const data = await fetchUserProfile(savedToken);
          setUser({
            id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            profileImage: data.profileImage,
            token: savedToken,
          });
        } catch (err) {
          console.error("Failed to restore session:", err);
          localStorage.removeItem("ceramic_token");
        }
      };
      restoreSession();
    }

    const loadCategories = async () => {
      try {
        const catData = await fetchCategories();
        setCategories(["All Products", ...catData]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    loadProducts();
    loadCategories();
  }, []);

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

  // Authenticate with the backend
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert("Please fill in both email and password.");
      return;
    }

    try {
      const data = await loginUser(loginEmail, loginPassword);
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        profileImage: data.profileImage,
        token: data.token,
      });
      localStorage.setItem("ceramic_token", data.token);

      setLoginOpen(false);
      setLoginEmail("");
      setLoginPassword("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Invalid email or password.");
    }
  };

  // Register with the backend
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const data = await registerUser(signupName, signupEmail, signupPassword);
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        profileImage: data.profileImage,
        token: data.token,
      });
      localStorage.setItem("ceramic_token", data.token);

      setLoginOpen(false);
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      alert(`Welcome, ${data.name}! Account created successfully.`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Registration failed.");
    }
  };

  // Quick guest bypass via the seeded database user
  const handleQuickGuestBypass = async () => {
    try {
      const data = await loginUser("member@ceramic.studio", "password123");
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        profileImage: data.profileImage,
        token: data.token,
      });
      localStorage.setItem("ceramic_token", data.token);
      setLoginOpen(false);
    } catch (err) {
      console.error("Guest bypass login failed, falling back to mock session:", err);
      setUser({
        name: "Studio Member",
        email: "member@ceramic.studio",
        role: "user",
        profileImage: "",
        token: "mock-token",
      });
      setLoginOpen(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("ceramic_token");
    setActiveView("home"); // Redirect to home upon logout
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
          setAuthMode("login");
          setLoginOpen(true);
        }}
        onLogout={handleLogout}
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
        {activeView === "profile" && (
          <Profile
            user={user}
            onUserUpdate={setUser}
          />
        )}
        {activeView === "orders" && (
          <Orders
            user={user}
          />
        )}
        {activeView === "admin" && (
          <Admin
            user={user}
            products={products}
            onRefreshProducts={loadProducts}
          />
        )}
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
        user={user}
        onLoginRequired={() => {
          setAuthMode("login");
          setLoginOpen(true);
        }}
      />

      {/* Product Detail Overlay Modal */}
      <ProductModal
        product={activeProduct}
        isOpen={activeProduct !== null}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Auth Modal (Login / Signup) */}
      <AuthModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        authMode={authMode}
        setAuthMode={setAuthMode}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        handleLoginSubmit={handleLoginSubmit}
        handleQuickGuestBypass={handleQuickGuestBypass}
        signupName={signupName}
        setSignupName={setSignupName}
        signupEmail={signupEmail}
        setSignupEmail={setSignupEmail}
        signupPassword={signupPassword}
        setSignupPassword={setSignupPassword}
        handleSignupSubmit={handleSignupSubmit}
      />
    </div>
  );
}
