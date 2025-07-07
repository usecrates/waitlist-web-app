import React from 'react'
import LoginButton from '../LoginButton'
import Link from 'next/link'
import { MobileMenu } from "@/components/mobile-menu";
import { motion, AnimatePresence } from "framer-motion";
const MemoizedMobileMenu = React.memo(MobileMenu);
const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10 bg-[#0e0e0e]  backdrop-blur-sm">
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
  )
}

export default Navbar