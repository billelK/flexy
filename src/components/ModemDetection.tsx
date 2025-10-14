import React,{useEffect} from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";


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
            <CardHeader>
                <CardTitle>Detected Operators</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                    Status of available operators.
                </p>
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
                        <div
                            className={`w-3 h-3 rounded-full ${
                            isOnline ? "bg-green-500" : "bg-red-500"
                            }`}
                        />
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

                <Button
                className="mt-6 w-full"
                onClick={detectOperators}
                >
                Refresh
                </Button>
            </CardContent>
        </Card>

  )
}

export default ModemDetection