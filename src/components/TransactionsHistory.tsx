import React,{useEffect} from 'react'
import {useApp} from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionFilters from "@/components/Filters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationControls } from "@/components/pagination";

function TransactionsHistory() {
    const {transactions,handleFilters,handleClear, filters, setFilters, page, setPage} = useApp();

    const pageSize = 10;
    const totalPages = Math.ceil(transactions.length / pageSize);
    const paginated = transactions.slice((page - 1) * pageSize, page * pageSize);

    

    useEffect(() => {
        handleFilters(filters);
    }, [filters]);

    
  return (
    <Card className="flex-[2] flex flex-col relative">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionFilters handleClear={handleClear} onFilter={setFilters}/>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
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
                        <TableCell className={`${tx.status === "Completed" ? "text-green-600" : tx.status === "Failed"? "text-red-600": "text-black"  }`}>{tx.status}</TableCell>
                        <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <div className="absolute bottom-4 left-0 w-full ">
              <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
    </Card>
  )
}

export default TransactionsHistory