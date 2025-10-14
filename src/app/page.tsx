"use client";

import { useEffect, useState } from "react";













import { transactionSchema, TransactionInput } from "@/lib/validation";

import RechargeForm from "@/components/RechargeForm";
import ModemDetection from "@/components/modemDetection";
import TransactionsHistory from "@/components/TransactionsHistory";






export default function Page() {

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="">
        <h1>Flexy POS</h1>
      </header>

      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
      
        {/* Left Form */}
        <div className="flex-1 flex flex-col">
          <RechargeForm/>
        </div>

        {/* Center History */}
          <TransactionsHistory/>

        {/* Right modem detection */}
        <div className="flex-1">
          <ModemDetection/>
        </div>
      </div>
      
    </div>
  );
}
