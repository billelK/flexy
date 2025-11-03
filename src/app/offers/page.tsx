"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { IoPencil } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "sonner"

import OffreCreationDialog from "@/components/OfferCreationDialog";




const operators = ["ALL", "Ooredoo", "Djezzy", "Mobilis"];

export default function OffersPage() {
   const [offers, setOffers] = useState([]); 
   const [activeFilter, setActiveFilter] = useState("ALL");
   const [open, setOpen] = useState(false);

useEffect(() => {
    window.electronAPI.getOffers().then((data) => {
      setOffers(data);
    });
}, []);

const filteredOffers =
  activeFilter === "ALL"
    ? offers
    : offers.filter((offer) => offer.operator === activeFilter);
 
const onCreateOffer = async (newOffer: any) => {
    const toastId = toast.loading("Adding new offer...");
    if (!newOffer.image) {
      if (newOffer.operator === "djezzy") {
        newOffer.image = "/Djezzy-red.png"
      } else if (newOffer.operator === "ooredoo") {
        newOffer.image = "/Ooredoo-white.png"
      }else {
        newOffer.image = "/Mobilis-white.png"
      }
    }
    const addedOffer = await window.electronAPI.addOffer(newOffer)

    if (addedOffer) {
      toast.dismiss(toastId);
      toast.success("Offer added successfully!");
      setOffers((prevOffers) => [addedOffer,...prevOffers]);
      setOpen(false);
    } else {
      toast.dismiss(toastId);
      toast.error("Failed to add offer.");
    }
    console.log(addedOffer);
}
      

  return (
    <Card className="flex flex-col h-full relative mx-auto p-5 mt-5 max-w-7xl w-screen border-[#C0D2D3] overflow-hidden ">
      <CardHeader className='flex justify-between'>
              <div>
                <CardTitle className='text-[#0D5256] text-xl'>Offers</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                      Browse, create, and manage your offers.
                  </p>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-wrap rounded-lg bg-[#C0D2D3]/40 gap-1">
                  {operators.map((op) => (
                    <button
                      key={op}
                      onClick={() => setActiveFilter(op)}
                      className={`px-5 py-2  text-sm font-medium transition-all duration-200 ${
                        activeFilter === op
                          ? "bg-[#1A7768] text-white shadow-md rounded-lg"
                          : "text-[#0D5256] hover:bg-[#5EAE94]/40 rounded-lg"
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
                <OffreCreationDialog onCreate={onCreateOffer} openState={open} setOpen={setOpen}/>
              </div>
            </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 cursor-pointer bg-">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-2xl overflow-hidden border border-[#C0D2D3]/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform bg-[#f9fafb]"
            >
              {/* Image banner */}
              <div className="relative w-full h-35 bg-white">
                <Image
                  src={offer.image}
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
