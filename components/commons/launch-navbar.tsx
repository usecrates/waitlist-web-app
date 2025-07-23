import Link from "next/link";
import { motion } from "framer-motion";
import LoginButton from "@/components/LoginButton";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 left-0 font-chakra right-0 z-50 bg-black border-b border-[#272727] py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between ">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="text-sm tracking-wide flex items-center gap-2 text-white">
            <img src="/assets/logo_crates.svg" alt="Use Crates Logo" className="h-10 w-auto" />
            <span className="text-white text-xl font-chakra">Crates</span>
          </Link>
          <nav className="flex items-center gap-8 text-sm">
            <Link href="/discover" className={pathname === "/discover" ? "text-white" : "text-gray-400 hover:text-white transition-colors"}>
              Discover
            </Link>
            <Link href="/portfolio" className={pathname === "/portfolio" ? "text-white" : "text-gray-400 hover:text-white transition-colors"}>
              Portfolio
            </Link>
            <Link href="/orders" className={pathname === "/orders" ? "text-white" : "text-gray-400 hover:text-white transition-colors"}>
              Orders
            </Link>
            <Link href="/create" className={pathname === "/create" ? "text-white" : "text-gray-400 hover:text-white transition-colors"}>
              Create
            </Link>
          </nav>
        </div>
        {/* Right: Wallet/Account Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4"
        >
          <Image src="/assets/bell.svg" alt="Use Crates Logo" height={24} width={24} />
          <LoginButton />
        </motion.div>
      </div>
    </header>
  );
}
