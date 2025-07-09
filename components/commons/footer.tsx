import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-800  px-4 py-6 text-sm text-gray-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-ropa">&copy; 2025 Crates. All rights reserved.</p>

        <div className="flex space-x-6 font-ropa text-sm">
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Discord
          </a>
          <a
            href="https://telegram.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Telegram
          </a>
          <a
            href="https://x.com/use_crates"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
