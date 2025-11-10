"use client";

import RechargeForm from "@/components/RechargeForm";
import ModemDetection from "@/components/ModemDetection";
import TransactionsHistory from "@/components/TransactionsHistory";
import RecentOffers from "@/components/RecentOffers";

export default function Page() {

  return (
    <div className="flex flex-col flex-1 h-screen">
      
      <div className=" flex flex-1 gap-4 p-4 overflow-hidden">
      
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

      <div className="flex-1 ">
              <RecentOffers/>
      </div>
    </div>
  );
}
