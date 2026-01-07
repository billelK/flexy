"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen(): React.ReactElement | null {
  const [visible, setVisible] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // Show briefly then animate out
    const OUT_AFTER = 5000; 
    const REMOVE_AFTER = 6000; 

    const t1 = setTimeout(() => setAnimateOut(true), OUT_AFTER);
    const t2 = setTimeout(() => setVisible(false), REMOVE_AFTER);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-label="Splash screen"
      className={`fixed inset-0 z-9999 flex items-center justify-center transition-opacity duration-500 ease-out ${
        animateOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D5256] via-[#1A7768] to-[#5EAE94]" />

      <div
        className={`relative z-50 flex flex-col items-center gap-4 p-6 rounded-lg bg-transparent transition-transform duration-500 ease-out ${
          animateOut ? "scale-[1.08]" : "scale-100"
        }`}
      >
        <div className="w-44 h-44 md:w-56 md:h-56 flex items-center justify-center">
          <Image src="/FlexyPay2.png" alt="FlexyPay" width={224} height={224} className="drop-shadow-2xl" />
        </div>
        <div className="text-white text-sm md:text-base font-semibold select-none p-5">Flexy Pay — Top Up and Manage Offers</div>
      </div>

      <div className="absolute bottom-6 text-center w-full text-white text-xs opacity-80">Loading...</div>
    </div>
  );
}
