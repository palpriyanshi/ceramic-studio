import React, { useState } from "react";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";

export default function Header({
  activeView,
  setActiveView,
  cartCount,
  onCartToggle,
  onSearchToggle,
  searchQuery,
  setSearchQuery,
  user,
  onLoginToggle
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { label: "Home", view: "home" },
    { label: "Shop", view: "shop" },
    { label: "About", view: "about" },
    { label: "Gift Card", view: "gift-card" },
    { label: "Contact", view: "contact" }
  ];

  const handleNavClick = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveView("shop");
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-sand-100/90 backdrop-blur-md border-b border-sand-200">
      {/* Search Overlay */}
      {searchOpen && (
        <div className="absolute inset-0 bg-sand-100 flex items-center px-4 md:px-8 z-50 animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center max-w-3xl mx-auto">
            <Search className="h-5 w-5 text-neutral-500 mr-3" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-neutral-900 placeholder-neutral-400 focus:outline-none text-lg py-2 font-sans"
              autoFocus
            />
          </form>
          <button
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
            className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Top utility row */}
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu trigger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Left: Search Trigger (Desktop) */}
          <div className="hidden md:block">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center text-sm font-sans tracking-widest text-neutral-600 hover:text-neutral-900 transition-all uppercase group"
            >
              <Search className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
              <span>Search</span>
            </button>
          </div>

          {/* Center: Brand Logo */}
          <div className="text-center">
            <button
              onClick={() => handleNavClick("home")}
              className="text-xl md:text-2xl font-serif font-semibold tracking-[0.25em] text-neutral-950 focus:outline-none cursor-pointer"
            >
              C E R A M I C - S T U D I O
            </button>
          </div>

          {/* Right: Cart, Account */}
          <div className="flex items-center space-x-2 md:space-x-6">
            {/* Account (Log In) */}
            <button
              onClick={onLoginToggle}
              className="flex items-center space-x-1 text-sm font-sans tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors uppercase cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center bg-sand-200">
                <User className="h-4 w-4 text-neutral-700" />
              </div>
              <span className="hidden sm:inline text-xs ml-1">
                {user ? `Hi, ${user.name}` : "Log In"}
              </span>
            </button>

            {/* Cart Icon */}
            <button
              onClick={onCartToggle}
              className="relative p-2 text-neutral-800 hover:text-neutral-900 transition-all cursor-pointer group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-6 w-6 stroke-[1.5] transition-transform group-hover:scale-105" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-sand-700 text-white text-[10px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center transition-all animate-scale-up">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex justify-center border-t border-sand-200/50 py-3">
          <nav className="flex items-center space-x-12">
            {navItems.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`text-sm font-sans tracking-widest uppercase transition-all relative py-1 cursor-pointer
                    ${isActive ? "text-sand-700 font-medium" : "text-neutral-500 hover:text-neutral-900"}
                  `}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-sand-700 rounded-full animate-scale-x" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-sand-100 border-b border-sand-200 shadow-lg animate-slide-down">
          <div className="px-6 py-8 flex flex-col space-y-6">
            {/* Mobile Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-sand-300 pb-2">
              <Search className="h-5 w-5 text-neutral-500 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-neutral-900 placeholder-neutral-400 focus:outline-none text-sm font-sans"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")}>
                  <X className="h-4 w-4 text-neutral-400" />
                </button>
              )}
            </form>

            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const isActive = activeView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNavClick(item.view)}
                    className={`text-left text-base font-sans tracking-widest uppercase py-2
                      ${isActive ? "text-sand-700 font-semibold pl-2 border-l-2 border-sand-700" : "text-neutral-600"}
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
