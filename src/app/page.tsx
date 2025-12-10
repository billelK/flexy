// page.tsx
"use client";

import RechargeForm from "@/components/RechargeForm";
import ModemDetection from "@/components/ModemDetection";
import TransactionsHistory from "@/components/TransactionsHistory";
import RecentOffers from "@/components/RecentOffers";

export default function Page() {
  return (
    // Remove flex-1 and h-screen from here. Use min-h-full so content can grow if needed.
    <div className="flex flex-col min-h-full "> 
      
      {/* Remove overflow-hidden from this inner div */}
      <div className="flex flex-1 gap-4 p-4">
      
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
