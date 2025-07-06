import type React from "react";
import type { Metadata } from "next";
import { Toaster, toast } from "sonner";
import { Chakra_Petch, DM_Sans } from "next/font/google";
import { Ropa_Sans } from "next/font/google";
import "./globals.css";
import { PrivyAuthProvider } from "@/context/PrivyAuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import PrivyProviderWrapper from "@/components/PrivyProviderWrapper";
const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-chakra",
});

const ropa = Ropa_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-ropa",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Invest Like the Insiders",
  description:
    "Buy curated baskets of US stocks based on real politician holdings.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${ropa.variable}  ${chakra.variable} ${dmSans.variable}`}
      >
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={<div>Loading...</div>}>
              {" "}
              <PrivyProviderWrapper>
                <PrivyAuthProvider>
                  
                  {children}
                  <Toaster
                    position="top-center"
                    toastOptions={{
                      style: {
                        background: "black",
                        border: " 1px solid white",
                        color: "white",
                        borderRadius:"0px"
                      },
                    }}
                  />
                </PrivyAuthProvider>
              </PrivyProviderWrapper>
            </Suspense>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
