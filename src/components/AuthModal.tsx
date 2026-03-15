"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, ModalContent } from "./Modal";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();

  const reset = () => {
    setError("");
    setEmail("");
    setPassword("");
    setSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: err } =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password);
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (mode === "signup") {
      setError("");
      setMode("signin");
      setEmail("");
      setPassword("");
      return;
    }
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} titleId="auth-modal-title">
      <AnimatePresence>
        <ModalContent className="w-full max-w-sm p-6">
          <h2 id="auth-modal-title" className="font-heading text-xl font-bold text-[var(--foreground)]">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {mode === "signin"
              ? "Use your email and password to sign in."
              : "Sign up with your email to get started."}
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="auth-email" className="section-eyebrow block mb-1">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base w-full"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="auth-password" className="section-eyebrow block mb-1">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base w-full"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={submitting}
              >
                {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError("");
                }}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] underline"
              >
                {mode === "signin"
                  ? "Need an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </ModalContent>
      </AnimatePresence>
    </Modal>
  );
}
