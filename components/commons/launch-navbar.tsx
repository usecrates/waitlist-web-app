import Link from "next/link";
import { motion } from "framer-motion";
import LoginButton from "@/components/LoginButton";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-sm uppercase tracking-wide font-ropa text-white">
          Use Crates
        </Link>

   
        <nav className="hidden md:flex mx-80 items-center gap-8 text-sm font-ropa text-gray-400">
          <Link href="/portfolio" className="hover:text-white transition-colors">
            Portfolio
          </Link>
          <Link href="/settings" className="hover:text-white transition-colors">
            Settings
          </Link>
          <Link href="/another" className="hover:text-white transition-colors">
            Another page
          </Link>
        </nav>

     
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="ml-auto"
        >
          <LoginButton />
        </motion.div>
      </div>
    </header>
  );
}
