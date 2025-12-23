"use client"

import React from 'react'

import { usePathname } from "next/navigation";
import Link from 'next/link';
import { cn } from "@/lib/utils"

function Header() {

  const pathname = usePathname();

  // Use a stable client-side path so the initial render reflects the real URL
  const [currentPath, setCurrentPath] = React.useState(() =>
    typeof window !== "undefined" ? window.location.pathname || "/" : pathname || "/"
  );

  React.useEffect(() => {
    if (pathname) setCurrentPath(pathname);
  }, [pathname]);

  const normalize = (p: string) => {
    if (!p) return "/";
    // strip any leading /index.html (happens with app:// index loads) and trailing slashes
    let s = p.replace(/^\/index\.html/, "");
    s = s.replace(/\/+$|\/$/, "") || "/";
    return s;
  };

  const tabs = [
      { name: "Home", href: "/" },
      { name: "Offers", href: "/offers" },
      { name: "History", href: "/history" },
    ];

  return (
    <header className="bg-white h-15 border-b border-[#C0D2D3] flex items-center p-2 shadow-s overflow-visible flex-1 sticky top-0 z-10">
        <div className="flex flex-1 items-center p-2">
          <img src="/title-logo.png" alt="Logo" className="inline-block mr-2 w-auto w-7 h-7"/>
          <h1 className="font-medium text-xl ">FLEXY PAY</h1>
        </div>

          {/* navigation menu */}
           <div className="flex gap-2 w-[250px] border border-[#C0D2D3] rounded-lg p-1 bg-gray-50">
              {tabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex-1 text-center py-2 rounded-sm text-sm transition data-[state=active]:bg-[#0D5256]",
                    (() => {
                      const current = normalize(pathname);
                      const tabPath = normalize(tab.href);
                      const isActive = tabPath === "/"
                        ? current === "/"
                        : current === tabPath || current.startsWith(tabPath + "/");
                      return isActive ? "text-white shadow bg-[#0D5256]" : "text-muted-foreground hover:bg-[#C0D2D3]";
                    })()
                  )}
                >
                  {tab.name}
                </Link>
              ))}
          </div>
        
        <div className="flex-1"></div>
      </header>
  )
}

export default Header