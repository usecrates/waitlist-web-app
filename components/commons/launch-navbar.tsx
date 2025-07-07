import Link from "next/link";
import { motion } from "framer-motion";
import LoginButton from "@/components/LoginButton";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e0e0e] border-b border-gray-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="text-sm uppercase tracking-wide font-ropa text-white">
            CRATE LOGO
          </Link>
          <nav className="flex items-center gap-8 text-sm font-ropa">
            <Link href="/crates" className={pathname === "/crates" ? "text-white" : "text-gray-400 hover:text-white transition-colors"}>
              Crates
            </Link>
            <Link href="/portfolio" className={pathname === "/portfolio" ? "text-white" : "text-gray-400 hover:text-white transition-colors"}>
              Portfolio
            </Link>
            <Link href="/watchlist" className={pathname === "/watchlist" ? "text-white" : "text-gray-400 hover:text-white transition-colors"}>
              Watchlist
            </Link>
          </nav>
        </div>
        {/* Right: Wallet/Account Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <LoginButton />
        </motion.div>
      </div>
    </header>
  );
}
