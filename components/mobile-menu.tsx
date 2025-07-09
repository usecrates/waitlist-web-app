"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X, ChevronRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
const menuItems = [
  { href: "/", label: "Home" },
]
export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
        <Menu className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-[#0e0e0e]/20 dark:bg-[#0e0e0e]/40 backdrop-blur-sm z-40"
              onClick={closeMenu}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-4 right-4 left-4 bg-[#181C2A] rounded-2xl shadow-xl p-6 z-50 border"
              style={{
                borderWidth: '3px',
                borderStyle: 'solid',
                borderImage: 'linear-gradient(180deg, #2B00FF 0%, #FFFFFF 7.09%, #2B00FF 16.02%, #FF4C4C 29.77%, #FFFFFF 42.52%, #FF4C4C 54.15%, #FFFFFF 64.67%) 1',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <User className="w-4 h-4 text-green-800 dark:text-green-200" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Crate User</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* <ThemeToggle /> */}
                  <Button variant="ghost" size="icon" onClick={closeMenu} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center justify-between w-full p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="text-base font-medium">{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={closeMenu}
                  className="w-full text-white font-bold rounded-xl text-base py-6 px-0 border-none shadow-none transition-all duration-200 hover:scale-[0.98] active:scale-[0.97]"
                  style={{
                    background: 'linear-gradient(180deg, #7B7B7B 0%, #EBEBEB 27.19%, #999999 72.17%)',
                  }}
                >
                  Join Beta Waitlist
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
