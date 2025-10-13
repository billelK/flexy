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
        <Card className='h-full'>  
            <CardHeader>
                <CardTitle> Detected Operators</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="pt-4">
                {/* <h3 className="font-semibold mb-3">Detected Operators</h3> */}

                <div className="space-y-2 sticky bottom-0">
                {operators.length > 0 ? (
                    operators.map((op, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border"
                    >
                        <span className="text-sm font-medium">{op.operator}</span>
                        {/* <span className="text-gray-500">{op.manufacturer}</span> */}
                        <span
                        className={`w-3 h-3 rounded-full ${
                            op.operator !== "Error" && op.operator !== "Unknown"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        />
                    </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No operators detected yet.</p>
                )}
                </div>

                <Button
                    className="mt-10 w-full"
                    onClick={detectOperators}
                    >
                    Scan Operators
                </Button>
            </div>
            </CardContent>
        </Card>
  )
}

export default ModemDetection