"use client"

import React, {useEffect,useState} from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


function DataTable() {
  const [db, setDb] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const rows = await window.electronAPI.getTransactions();
      setDb(rows);
    }
    fetchData();
},[])
  
  return (
    <div>
        <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="w-[100px]">Operator</TableHead>
            <TableHead className="w-[100px]">Phone</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[100px]">Amount</TableHead>
            <TableHead className="w-[100px]">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Djezzy</TableCell>
            <TableCell className='text-left'>0696140239</TableCell>
            <TableCell>Success</TableCell>
            <TableCell>DA 500.00</TableCell>
            <TableCell>2025/10/26</TableCell>
        </TableRow>
            {
              db.map(r => {
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.id}</TableCell>
                    <TableCell>{r.operator}</TableCell>
                    <TableCell className='text-left'>{r.phone}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>DA {r.amount}.00</TableCell>
                    <TableCell>{r.created_at}</TableCell>
                  </TableRow>
                )
              })
            }
        </TableBody>
      </Table>
    </div>
  )
}

export default DataTable