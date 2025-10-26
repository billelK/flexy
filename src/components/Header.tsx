"use client"

import React from 'react'

import { usePathname } from "next/navigation";
import Link from 'next/link';
import Image from "next/image";
import { cn } from "@/lib/utils"

function Header() {

  const pathname = usePathname();
  const tabs = [
      { name: "Home", href: "/" },
      { name: "Offers", href: "/offers" },
      { name: "History", href: "/history" },
    ];

  return (
    <header className="bg-white h-15 border-b border-[#C0D2D3] flex items-center p-2 shadow-s overflow-hidden flex-1">
        <div className="flex flex-1 items-center p-2">
          <Image src="/title-logo.png" alt="Logo" width={16} height={16} className="inline-block mr-2 w-auto"/>
          <h1 className="font-medium text-xl ">Flexy Pay</h1>
        </div>

          {/* navigation menu */}
           <div className="flex gap-2 w-[250px] border border-[#C0D2D3] rounded-lg p-1 bg-gray-50">
              {tabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex-1 text-center py-2 rounded-sm text-sm transition data-[state=active]:bg-[#0D5256]",
                    pathname === tab.href
                      ? "text-white shadow bg-[#0D5256]"
                      : "text-muted-foreground hover:bg-[#C0D2D3]"
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