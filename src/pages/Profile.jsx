import React, { useState } from "react";
import { User, Mail, Lock, CheckCircle, Shield } from "lucide-react";
import { updateUserProfile, changeUserPassword } from "../services/auth.service";

export default function Profile({ user, onUserUpdate }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");

    if (!name || !email) {
      setProfileError("Name and Email are required.");
      return;
    }

    try {
      const data = await updateUserProfile({ name, email }, user.token);
      onUserUpdate({
        ...user,
        name: data.name,
        email: data.email,
      });
      setProfileMsg("Profile updated successfully!");
      setTimeout(() => setProfileMsg(""), 4000);
    } catch (err) {
      console.error(err);
      setProfileError(err.message || "Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");

    if (!oldPassword || !newPassword) {
      setPasswordError("Both current and new passwords are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      await changeUserPassword({ oldPassword, newPassword }, user.token);
      setPasswordMsg("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMsg(""), 4000);
    } catch (err) {
      console.error(err);
      setPasswordError(err.message || "Failed to change password.");
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <p className="text-neutral-500 text-sm">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 md:px-8 bg-sand-100 font-sans min-h-screen animate-fade-in">
      <div className="text-center mb-12 space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-wide uppercase text-neutral-950">
          Your Profile
        </h1>
        <div className="w-12 h-[2px] bg-sand-700 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* User Card */}
        <div className="bg-sand-200/40 p-6 border border-sand-300/40 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full border border-sand-300 flex items-center justify-center bg-sand-200 overflow-hidden mb-4">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-neutral-600" />
            )}
          </div>
          <h2 className="text-lg font-serif font-semibold text-neutral-950">{user.name}</h2>
          <p className="text-xs text-neutral-500 mt-1">{user.email}</p>

          <div className="mt-4 flex items-center space-x-1.5 bg-sand-300 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold text-neutral-700 border border-sand-400/50">
            <Shield className="h-3 w-3" />
            <span>{user.role} Member</span>
          </div>
        </div>

        {/* Edit details form */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile form */}
          <div className="bg-sand-200/20 p-8 border border-sand-300/40">
            <h3 className="text-sm font-sans font-bold tracking-widest uppercase text-neutral-950 border-b border-sand-300 pb-3 mb-6">
              Account Details
            </h3>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-600 uppercase font-sans">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-sand-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-600 uppercase font-sans">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-sand-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {profileMsg && (
                <p className="text-xs text-green-700 font-semibold flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  {profileMsg}
                </p>
              )}
              {profileError && <p className="text-xs text-red-650 font-semibold">{profileError}</p>}

              <button
                type="submit"
                className="bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-sans tracking-widest uppercase px-6 py-2.5 transition-colors cursor-pointer font-semibold"
              >
                Save Details
              </button>
            </form>
          </div>

          {/* Change Password form */}
          <div className="bg-sand-200/20 p-8 border border-sand-300/40">
            <h3 className="text-sm font-sans font-bold tracking-widest uppercase text-neutral-950 border-b border-sand-300 pb-3 mb-6">
              Change Password
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-600 uppercase font-sans">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-sand-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-600 uppercase font-sans">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-sand-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-600 uppercase font-sans">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-sand-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sand-700 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {passwordMsg && (
                <p className="text-xs text-green-700 font-semibold flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  {passwordMsg}
                </p>
              )}
              {passwordError && <p className="text-xs text-red-650 font-semibold">{passwordError}</p>}

              <button
                type="submit"
                className="bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-sans tracking-widest uppercase px-6 py-2.5 transition-colors cursor-pointer font-semibold"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
