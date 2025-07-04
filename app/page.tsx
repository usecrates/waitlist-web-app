"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePrivyAuth } from "@/context/PrivyAuthContext";
import { AnimatedBackground } from "@/components/animated-background";
import { MobileMenu } from "@/components/mobile-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import LoginButton from "@/components/LoginButton";
import { toast } from "sonner";
import { useWaitlist } from "@/hooks/useWaitlist";
import { useCheckWaitlist } from "@/hooks/useCheckWaitlist";
// Memoized components
const MemoizedAnimatedBackground = React.memo(AnimatedBackground);
const MemoizedMobileMenu = React.memo(MobileMenu);

// Animation variants
const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

const modalVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  transition: { duration: 0.2 },
};

export default function Home() {
  const [email, setEmail] = useState("");
  const { address, authenticated } = usePrivyAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { joinWaitlist } = useWaitlist();
  const { checkWaitlist } = useCheckWaitlist();
  const [inviteCode, setInviteCode] = useState(["", "", "", ""]);
  const [isInviteCodeModalOpen, setIsInviteCodeModalOpen] = useState(false);
  const handleCodeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...inviteCode];
    newCode[index] = value;
    setInviteCode(newCode);

    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };
  const handleCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && inviteCode[index] === "" && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleInviteCodeCheck = async () => {
    if (!address || !authenticated) {
      toast.error("Please connect your wallet to join the waitlist.");
      return;
    }
    const code = inviteCode.join("");
    if (code.length < 4) {
      toast.error("Please enter a valid 4-digit invite code.");
      return;
    }
    await checkWaitlist(address, code);
    
    
  };

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    []
  );
  const handleInviteCodeModalOpen = useCallback(() => {
    setIsInviteCodeModalOpen(true);
  }, []);
  const handleInviteCodeModalClose = useCallback(() => {
    setIsInviteCodeModalOpen(false);
  }, []);
  const handleWaitlistSubmit = async () => {
    if (!address || !authenticated) {
      toast.error("Please connect your wallet to join the waitlist.");
      return;
    }
    if (!email) {
      toast.error("Please Enter Email Address.");
      return;
    }
    await joinWaitlist(address, email);
  };

  const invitecodeModal = useMemo(
    () => (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-5xl font-bold text-white font-ropa mb-2">
            Enter Invite Code
          </h3>
          <p className="text-md text-gray-400 font-chakra">
            Enter your 4-digit invite code
          </p>
        </div>
        <div className="flex justify-center gap-4 mt-4 font-chakra">
          {inviteCode.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              id={`code-${idx}`}
              value={digit}
              onChange={(e) => handleCodeInput(e, idx)}
              onKeyDown={(e) => handleCodeKeyDown(e, idx)}
              className="w-12 h-14 text-center text-white bg-[#1c1c1c] border border-gray-600 rounded text-xl font-mono focus:outline-none focus:ring-2 focus:ring-white"
            />
          ))}
        </div>

        <Button
          onClick={handleInviteCodeCheck}
          disabled={isLoading || inviteCode.join("").length < 4}
          className={cn(
            "w-full bg-white text-black font-chakra hover:bg-white py-4 rounded-lg mt-6 font-semibold transition-colors",
            isLoading && "opacity-70 cursor-not-allowed"
          )}
        >
          {isLoading ? "Verifying..." : "Join Waitlist"}
        </Button>
      </div>
    ),
    [inviteCode, error, isLoading]
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-black ">
      <MemoizedAnimatedBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10 bg-black  backdrop-blur-sm">
        <div className="flex-1 flex items-center justify-start">
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-ropa font-semibold uppercase bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-200"
            >
              Use Crates
            </motion.div>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-end space-x-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden md:flex items-center space-x-1 px-4 py-2 backdrop-blur-sm"
          >
            <LoginButton />
          </motion.div>
          <div className="md:hidden">
            <MemoizedMobileMenu />
          </div>
        </div>
      </header>
      <section className="w-full flex-1 flex items-center justify-center px-6 pt-32 pb-16 border-t border-gray-800">
  <div className="grid md:grid-cols-2 gap-10 max-w-6xl w-full items-center  rounded-lg p-8">
    
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="border-r border-gray-700 pr-6"
    >
      <h1 className="text-7xl md:text-7xl font-chakra font-semibold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
        Invest Like the <br /> Insiders
      </h1>
      <p className="text-gray-400 text-xl mt-4 mb-6 font-ropa">
        Buy curated crates of US stocks based on real politician holdings.
      </p>

      <div className="flex flex-col sm:flex-row items-center w-1/1 gap-3 sm:gap-0  rounded overflow-hidden">
        <input
          type="email"
          placeholder="you@example.com"
          name="email"
          value={email}
          onChange={handleEmailChange}
          required
          className="bg-[#1e1e1e] w-2/3 text-white placeholder-gray-500 px-4 py-3 font-chakra outline-none"
        />
        <button
          onClick={handleWaitlistSubmit}
          className="bg-white text-black px-6 py-3 font-medium font-ropa"
        >
          Join Waitlist
        </button>
      </div>

      <p className="text-md text-gray-400 mt-3 font-ropa">
        Already have invite code?
        <span
          onClick={handleInviteCodeModalOpen}
          className="text-blue-500 mx-2 cursor-pointer"
        >
          Click here
        </span>
      </p>
    </motion.div>

    {/* RIGHT: Image */}
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex justify-center"
    >
      <img
        src="/assets/logo.jpg"
        alt="crate visual"
        className="w-full max-w-md  rounded-lg"
      />
    </motion.div>
  </div>
</section>


      <AnimatePresence mode="wait">
        {isInviteCodeModalOpen && (
          <motion.div
            {...fadeInVariants}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleInviteCodeModalOpen}
          >
            <motion.div
              {...modalVariants}
              className="bg-black dark:transparent backdrop-blur-lg  p-8 max-w-md w-full shadow-2xl "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-6">
                <button
                  onClick={handleInviteCodeModalClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {invitecodeModal}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
