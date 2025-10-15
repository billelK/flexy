import React,{useEffect} from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { PiPlugsConnected } from "react-icons/pi";
import { TbPlugConnected } from "react-icons/tb";
import Image from 'next/image';


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
        <Card className="h-full">
            <CardHeader className='flex justify-between'>
                <div>
                    <CardTitle>Detected Operators</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        Status of available operators.
                    </p>
                </div>
                <div>
                    <Button
                        className="w-full bg-blue-600"
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
                        {isOnline ? (<PiPlugsConnected color='green'/>) :(<TbPlugConnected color='red'/>)}
                        <span className="text-sm font-medium">{operator}</span>
                        </div>
                        <span
                        className={`text-sm ${
                            isOnline ? "text-green-600" : "text-red-500"
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