import { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext';

interface Offer {
  id: number;
  operator: string;
  title: string;
  description: string;
  price: number;
  image?: string;
}
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import OfferPhoneDialog from '@/components/OfferPhoneDialog';
import { toast } from 'sonner';
import { TransactionInput } from '@/lib/validation';

type LocalTransaction = TransactionInput & { id: number; created_at: string; message?: string };

function RecentOffers() {
const {offers, setOffers, transactions, setTransactions} = useApp();
const [dialogOpen, setDialogOpen] = useState(false);
const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
const [isSending, setIsSending] = useState(false);

useEffect(() => {
    window.electronAPI.getOffers().then((offers) => {
        setOffers(offers);
    })      
}, [setOffers]);

    const filteredOffers: Offer[] = offers.slice(0, 4); // Get the 4 most recent offers

    function openPhoneDialog(offer: Offer) {
        setSelectedOffer(offer);
        setDialogOpen(true);
    }

    async function confirmPhone(phoneValue: string) {
        if (!phoneValue) return;

        setIsSending(true);
        const toastId = toast.loading("Sending USSD...");

        try {
            if (!selectedOffer) {
                toast.dismiss(toastId);
                toast.error("No offer selected.");
                setIsSending(false);
                setDialogOpen(false);
                return;
            }
            const offer = selectedOffer;
            const result = await window.electronAPI.sendUSSDOffer(offer, phoneValue);

            const nextId = transactions && transactions.length > 0 ? transactions[0].id + 1 : 1;
            const newTx: LocalTransaction = {
                id: nextId,
                operator: offer.operator as TransactionInput['operator'],
                mode: "Offer",
                phone: phoneValue,
                amount: offer.price ?? 0,
                status: (result?.status ?? "Failed") as TransactionInput['status'],
                message: result?.message,
                created_at: result?.created_at ?? new Date().toISOString(),
            };

            await window.electronAPI.addTransaction(newTx);
            // update UI reactively
            setTransactions((prev) => [newTx, ...prev]);

            toast.dismiss(toastId);
            if (result?.status === "Completed") {
                toast.success(result?.message || "USSD sent successfully.");
            } else {
                toast.error(result?.message || "USSD failed.");
            }
        } catch (err) {
            toast.dismiss(toastId);
            toast.error("Failed to send USSD.");
            console.error("USSD send failed:", err);
        } finally {
            setIsSending(false);
            setDialogOpen(false);
        }
    }
    
    
    


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
              onClick={() => openPhoneDialog(offer)}
              className="rounded-2xl overflow-hidden border border-[#C0D2D3]/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform bg-[#f9fafb] cursor-pointer"
            >
              {/* Image banner */}
              <div className="relative w-full h-35 bg-white">
                <Image
                  src={offer.image ?? "/default-offer.png"}
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

    {/* Offer phone dialog */}
    <OfferPhoneDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      offer={selectedOffer}
      onConfirm={confirmPhone}
      isSending={isSending}
    />

    </Card>
    
  )
}

export default RecentOffers