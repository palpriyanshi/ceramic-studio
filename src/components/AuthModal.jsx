import React from "react";
import { LogIn, Mail, Lock, User as UserIcon, X } from "lucide-react";

export default function AuthModal({
  isOpen,
  onClose,
  authMode,
  setAuthMode,
  // Login form values & submit handlers
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLoginSubmit,
  handleQuickGuestBypass,
  // Signup form values & submit handlers
  signupName,
  setSignupName,
  signupEmail,
  setSignupEmail,
  signupPassword,
  setSignupPassword,
  handleSignupSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-sand-100 max-w-sm w-full p-8 border border-sand-300 shadow-2xl animate-scale-up z-10 flex flex-col">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-950 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {authMode === "login" ? (
          <>
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
                <label className="text-xs text-neutral-600 uppercase font-sans font-semibold">Email Address</label>
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
                <label className="text-xs text-neutral-600 uppercase font-sans font-semibold">Password</label>
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
                className="w-full bg-neutral-950 hover:bg-neutral-855 text-white text-xs font-sans tracking-widest uppercase py-3 transition-colors cursor-pointer text-center mt-2 font-semibold"
              >
                Log In
              </button>

              <button
                type="button"
                onClick={handleQuickGuestBypass}
                className="w-full border border-neutral-950 text-neutral-950 hover:bg-neutral-100 text-xs font-sans tracking-widest uppercase py-2 transition-colors cursor-pointer text-center font-semibold"
              >
                Quick Guest Bypass
              </button>

              <p className="text-xs text-center text-neutral-500 mt-4 pt-2 border-t border-sand-300/60 font-sans">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className="text-neutral-950 underline font-semibold hover:text-sand-700 transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            </form>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-12 h-12 bg-sand-200 text-neutral-700 rounded-full flex items-center justify-center border border-sand-300 mb-2">
                <UserIcon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-neutral-950">
                Create Your Account
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Sign up to track orders and save your details.
              </p>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-600 uppercase font-sans font-semibold">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4.5 w-4.5 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full bg-white border border-sand-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-600 uppercase font-sans font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-white border border-sand-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-600 uppercase font-sans font-semibold">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-neutral-400" />
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-sand-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-sans tracking-widest uppercase py-3 transition-colors cursor-pointer text-center mt-4 font-semibold"
              >
                Sign Up
              </button>

              <p className="text-xs text-center text-neutral-500 mt-4 pt-2 border-t border-sand-300/60 font-sans">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="text-neutral-950 underline font-semibold hover:text-sand-700 transition-colors cursor-pointer"
                >
                  Log In
                </button>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
