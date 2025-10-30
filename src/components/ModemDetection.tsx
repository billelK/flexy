import React,{useEffect} from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { PiPlugsConnected } from "react-icons/pi";
import { TbPlugConnected } from "react-icons/tb";


function ModemDetection() {
const {operators,setOperators, detectOperators} = useApp();

 const loadSavedOperators = async () => { // not using this anymore
    const saved = await window.electronAPI.readOperators()
    setOperators(saved)
  }

   useEffect(() => {
    loadSavedOperators() // not using this anymore
    // detectOperators()
  }, [])
  return (
        <Card className="h-full border-[#C0D2D3]">
            <CardHeader className='flex justify-between'>
                <div>
                    <CardTitle className='text-[#0D5256] '>Detected Operators</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        Status of available operators.
                    </p>
                </div>
                <div>
                    <Button
                        className="w-full bg-[#0D5256]"
                        onClick={detectOperators}
                        >
                        Refresh
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-3">
                {["Mobilis", "Ooredoo", "Djezzy"].map((operator) => {
                    const found = operators.find((op) => op.operator === operator);
                    const isOnline =
                    found && found.operator !== "Unknown" && found.operator !== "Error";

                    return (
                    <div
                        key={operator}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border"
                    >
                        <div className="flex items-center space-x-2">
                        {isOnline ? (<PiPlugsConnected color='#1A7768'/>) :(<TbPlugConnected color='#EF4444'/>)}
                        <span className="text-sm font-medium">{operator}</span>
                        </div>
                        <span
                        className={`text-sm ${
                            isOnline ? "text-[#1A7768]" : "text-[#EF4444]"
                        }`}
                        >
                        {isOnline ? "Online" : "Offline"}
                        </span>
                    </div>
                    );
                })}
                </div>
            </CardContent>
        </Card>

  )
}

export default ModemDetection