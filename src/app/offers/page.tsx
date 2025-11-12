"use client";

import { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { IoPencil } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import OffreCreationDialog from "@/components/OfferCreationDialog";

const operators = ["ALL", "Ooredoo", "Djezzy", "Mobilis"];

export default function OffersPage() {
  const { offers, setOffers, activeFilter, setActiveFilter, onEditOffer, onDeleteOffer } = useApp();

  useEffect(() => {
    window.electronAPI.getOffers().then((data) => {
      setOffers(data);
    });
  }, []);

  const filteredOffers =
    activeFilter === "ALL"
      ? offers
      : offers.filter((offer) => offer.operator === activeFilter);

  return (
    <Card className="flex flex-col max-h-[calc(100vh-6rem)] lg:max-w-6xl relative mx-auto p-5 mt-4 xl:max-w-7xl w-full border-[#C0D2D3] overflow-hidden">
      {/* Header + Filters (fixed area) */}
      <CardHeader className="flex justify-between flex-shrink-0">
        <div>
          <CardTitle className="text-[#0D5256] text-xl">Offers</CardTitle>
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
                className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  activeFilter === op
                    ? "bg-[#1A7768] text-white shadow-md rounded-lg"
                    : "text-[#0D5256] hover:bg-[#5EAE94]/40 rounded-lg"
                }`}
              >
                {op}
              </button>
            ))}
          </div>
          <OffreCreationDialog />
        </div>
      </CardHeader>

      {/* Scrollable Offers Section */}
      <div className="flex-1 overflow-y-auto pr-2 scrollable">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer p-3">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-2xl overflow-hidden border border-[#C0D2D3]/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform bg-[#f9fafb] "
            >
              {/* Image banner */}
              <div className="relative w-full h-28 bg-white">
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
                  <h2 className="font-semibold">{offer.title}</h2>
                  <p className="text-xs text-gray-500 mb-2">
                    {offer.description}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#1A7768] font-medium text-lg">
                    {offer.price} DA
                  </p>
                  <div className="flex gap-1">
                    <IoPencil
                      onClick={() => onEditOffer(offer)}
                      className="p-1 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 w-7 h-7"
                      color="#1A7768"
                    />
                    <RiDeleteBinLine
                      onClick={() => onDeleteOffer(offer.id)}
                      className="p-1 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 w-7 h-7"
                      color="#EF4444"
                    />
                  </div>
                </div>
              </CardContent>
            </div>
          ))}
        </div>
      
      </div>
    </Card>
  );
}
