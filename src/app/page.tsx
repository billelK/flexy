"use client";



import RechargeForm from "@/components/RechargeForm";
import ModemDetection from "@/components/modemDetection";
import TransactionsHistory from "@/components/TransactionsHistory";

export default function Page() {

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white h-15 border-b flex items-center px-4 shadow-s ">
        <h1 className="font-medium text-xl">Flexy Pay</h1>
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
