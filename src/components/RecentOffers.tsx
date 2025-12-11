import React,{useEffect} from 'react'
import { useApp } from '@/context/AppContext';
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

function RecentOffers() {
const {offers, setOffers} = useApp();

useEffect(() => {
    window.electronAPI.getOffers().then((offers) => {
        setOffers(offers);
    })      
}, [setOffers]);

    const filteredOffers = offers.slice(0, 4); // Get the 4 most recent offers
    
    
    


  return (
    <Card className="mb-4 mx-4 border-[#C0D2D3]">
          <CardHeader className='flex justify-between'>
            <div>
                <CardTitle className="text-[#0D5256]">Recent Offers</CardTitle>
                <p className="md:text-sm text-gray-500">
              Check out our latest offers and promotions on mobile recharges!
            </p>
            </div>
            
             <div>
                <Button className='w-full bg-[#0D5256]'>
                   <Link href={"/offers"}>
                   View All 
                   </Link>
                </Button>
              </div>
            </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-2xl overflow-hidden border border-[#C0D2D3]/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform bg-[#f9fafb] "
            >
              {/* Image banner */}
              <div className="relative w-full h-35 bg-white">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-[#1A7768] to-[#5EAE94]" />
              </div>
              

              {/* Offer details */}
              <CardContent className="flex text-start py-4 justify-between">
                <div>
                    <h2 className="font-semibold">
                        {offer.title}
                    </h2>
                    <p className="text-xs text-gray-500 mb-2">{offer.description}</p>
                    
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-[#1A7768] font-medium text-lg">{offer.price} DA</p>
                </div>
              </CardContent>
            </div>
          ))}
    </div>
          </CardContent>
    </Card>
    
  )
}

export default RecentOffers