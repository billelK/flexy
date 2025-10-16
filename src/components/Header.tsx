import React from 'react'
import FullHistory from "@/app/history/page";
import Link from 'next/link';
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function Header() {
  return (
    <header className="bg-white h-15 border-b border-[#C0D2D3] flex items-center p-2 shadow-s overflow-hidden flex-1">
        <div className="flex flex-1 items-center p-2">
          <Image src="/title-logo.png" alt="Logo" width={16} height={16} className="inline-block mr-2 w-auto"/>
          <h1 className="font-medium text-xl ">Flexy Pay</h1>
        </div>
        
          <Tabs defaultValue="home" className="w-[250px] ">
            <TabsList>
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
              <TabsTrigger value="history">
                History
                {/* <Link href="/history">
                  <FullHistory/>
                </Link> */}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        
        <div className="flex-1"></div>
      </header>
  )
}

export default Header