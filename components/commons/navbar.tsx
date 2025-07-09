import React from 'react'
import LoginButton from '../LoginButton'
import Link from 'next/link'
import { MobileMenu } from "@/components/mobile-menu";
import { motion, AnimatePresence } from "framer-motion";
const MemoizedMobileMenu = React.memo(MobileMenu);
const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between py-4 z-10 bg-black backdrop-blur-sm">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-8">
        <div className="flex-1 flex items-center justify-start">
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="/assets/logo_crates.svg" 
                alt="Use Crates Logo" 
                className="h-10 w-auto"
              />
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
      </div>
    </header>
  )
}

export default Navbar