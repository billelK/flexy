"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { IoPencil } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";

const offers = [
  {
    id: 1,
    operator: "Djezzy",
    logo: "/Djezzy-red.png",
    title: "Djezzy Hayla",
    description: "20GB Internet + Unlimited Calls Towards Djezzy.",
    price: "1500 DZD",
  },
  {
    id: 2,
    operator: "Mobilis",
    logo: "/mobilis-white.png",
    title: "Mobilis PiXx",
    description: "Enjoy unlimited calls and 10GB of data.",
    price: "1000 DZD",
  },
  {
    id: 3,
    operator: "Ooredoo",
    logo: "/Ooredoo-white.png",
    title: "Ooredoo Maxy",
    description: "Enjoy unlimited calls and 1GB data for 3 days.",
    price: "2500 DZD",
  },
  {
    id: 4,
    operator: "Djezzy",
    logo: "/Djezzy-red.png",
    title: "Djezzy",
    description: "Enjoy unlimited calls and 1GB data for 3 days.",
    price: "500 DZD",
  },
  {
    id: 5,
    operator: "Mobilis",
    logo: "/mobilis-white.png",
    title: "Mobilis",
    description: "Enjoy unlimited calls and 1GB data for 3 days.",
    price: "300 DZD",
  },
  {
    id: 6,
    operator: "Ooredoo",
    logo: "/Ooredoo-white.png",
    title: "Ooredoo",
    description: "Enjoy unlimited calls and 1GB data for 3 days.",
    price: "250 DZD",
  },
];

export default function OffersPage() {
  return (
    <Card className="flex flex-col h-full relative mx-auto p-5 mt-5 max-w-5xl w-screen border-[#C0D2D3] overflow-hidden ">
      <CardHeader className='flex justify-between'>
              <div>
                <CardTitle className='text-[#0D5256] text-xl'>Offers</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                      Browse, create, and manage your offers.
                  </p>
              </div>
            </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 cursor-pointer bg-">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-2xl overflow-hidden border border-[#C0D2D3]/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform bg-[#f9fafb]"
            >
              {/* Image banner */}
              <div className="relative w-full h-35">
                <Image
                  src={offer.logo}
                  alt={offer.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#1A7768] to-[#5EAE94]" />
              </div>
              

              {/* Offer details */}
              <CardContent className="flex flex-col text-start py-6 w-full">
                <div>
                    <h2 className="font-semibold">
                    {offer.title}
                    </h2>
                    <p className="text-xs text-gray-500 mb-2">{offer.description}</p>
                    
                </div>
                <div className="flex justify-between items-center">
                        <p className="text-[#1A7768] font-medium text-lg">{offer.price}</p>
                        <div className="flex gap-1">
                            <IoPencil className="p-1 rounded-full cursor-pointer transition-all duration-200
                    hover:scale-110 active:scale-95 w-7 h-7 " color='#1A7768'/>
                            <RiDeleteBinLine className="p-1 rounded-full cursor-pointer transition-all duration-200
                    hover:scale-110 active:scale-95 w-7 h-7" color='#EF4444'/>
                        </div>
                </div>
              </CardContent>
            </div>
          ))}
        </div>
    </Card>
  );
}
