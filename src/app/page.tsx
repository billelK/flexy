"use client";

import RechargeForm from "@/components/RechargeForm";
import ModemDetection from "@/components/ModemDetection";
import TransactionsHistory from "@/components/TransactionsHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



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
        <Card className="h-full mx-4 border-[#C0D2D3]">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-[#0D5256]">Recent Offers</CardTitle>
            <p className="text-sm text-gray-500">
              Check out our latest offers and promotions on mobile recharges!
            </p>
            </CardHeader>
          <CardContent>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
