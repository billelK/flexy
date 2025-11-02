"use client"
import React,{useEffect} from 'react'
import {useApp} from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import TransactionFilters from "@/components/Filters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationControls } from "@/components/pagination";
import { usePathname } from "next/navigation";


function FullHistory() {
    const {transactions,handleFilters,handleClear,filters, setFilters, page, setPage} = useApp();
    const pathname = usePathname();
    const pageSize = 10;
    const totalPages = Math.ceil(transactions.length / pageSize);
    const paginated = transactions.slice((page - 1) * pageSize, page * pageSize);

    
    useEffect(() => {
        handleFilters(filters);
    }, [filters]);

    useEffect(() => {
            return () => {
              if (pathname === "/history") {
                  // setPage(1)
                  window.electronAPI.getTransactions().then((data) => {
                  setFilters(data) 
                });
              }
            }
    }, [pathname])
  return (
    <Card className="flex flex-col h-full relative min-h-[725px] mx-auto mt-5 max-w-7xl w-screen  border-[#C0D2D3] overflow-hidden ">
            <CardHeader className='flex justify-between'>
              <div>
                <CardTitle className='text-[#0D5256] text-xl'>Transactions History</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                      View recent and old recharge transactions.
                  </p>
              </div>
            </CardHeader>
            <CardContent className='flex-1 overflow-visible'>
              <TransactionFilters handleClear={handleClear} onFilter={setFilters}/>
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
                          <Badge variant="destructive" className={`${tx.status}` === "Completed"? "bg-[#1A7768]": `${tx.status}` === "Failed"? "bg-[#EF4444]": "bg-yellow-500"}>
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
            <div className="mt-auto border-t  ">
              <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
    </Card>
  )
}
export default FullHistory