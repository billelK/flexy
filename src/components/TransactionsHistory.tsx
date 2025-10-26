import React,{useEffect} from 'react'
import Link from 'next/link';
import {useApp} from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";



function TransactionsHistory() {
    const {transactions,setTransactions} = useApp();

    const pageSize = 8;
    const paginated = transactions.slice(0, pageSize)
    
    useEffect(() => {
      const loadData = async () => {
        const tx = await window.electronAPI.getTransactions()
        setTransactions(tx);
      }
          loadData()
    }, []);

  return (
    <Card className="flex-[2] flex flex-col relative border-[#C0D2D3]">
            <CardHeader className='flex justify-between'>
              <div>
                <CardTitle className='text-[#0D5256]'>Transactions History</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                      View recent recharge transactions.
                  </p>
              </div>
              <div>
                <Button className='w-full bg-[#0D5256]'>
                   <Link href={"/history"}>
                   View All 
                   </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Date / Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        No Transactions Found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{tx.id}</TableCell>
                        <TableCell>{tx.operator}</TableCell>
                        <TableCell>{tx.phone}</TableCell>
                        <TableCell>{`DA ${tx.amount}.00`}</TableCell>
                        <TableCell>
                          <Badge variant="destructive" className={`${tx.status}` === "Completed"? "bg-[#1A7768]": `${tx.status}` === "Failed"? "bg-[#EF4444]": "bg-[#C0D2D3]"}>
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{tx.mode}</TableCell>
                        <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <div className="absolute bottom-4 left-0 w-full ">
            </div>
    </Card>
  )
}

export default TransactionsHistory