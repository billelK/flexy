"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Offer = {
  id: string | number;
  title?: string;
  operator?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Offer | null;
  onConfirm: (phone: string) => void;
};

const operatorPrefix: Record<string, string> = {
  Ooredoo: "05",
  Mobilis: "06",
  Djezzy: "07",
};

export default function OfferPhoneDialog({ open, onOpenChange, offer, onConfirm }: Props) {
  const [phone, setPhone] = useState("");

  // Reset phone when offer changes / dialog opens and prefill with operator prefix if available
  useEffect(() => {
    if (open) {
      const prefix = offer?.operator ? operatorPrefix[offer.operator] : undefined;
      setPhone(prefix ?? "");
    }
  }, [open, offer]);

  function confirm() {
    if (!phone) return;
    onConfirm(phone);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#0d5256]">Enter phone number</DialogTitle>
          <DialogDescription>
            Please enter the phone number to apply for &quot;{offer?.title}&quot;.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <Input
            value={phone}
            onChange={(e) => {
              // keep only digits and limit length to 10
              const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
              setPhone(onlyNums);
            }}
            placeholder="e.g., 07XXXXXXXX"
            type="tel"
            inputMode="numeric"
            maxLength={10}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="hover:bg-[#f4f4f5]" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={confirm}
            disabled={
              phone.length !== 10 ||
              (offer?.operator ? !phone.startsWith(operatorPrefix[offer.operator]) : false)
            }
            className="bg-[#0d5256] text-white shadow-md rounded-lg hover:bg-[#1a7768]"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
