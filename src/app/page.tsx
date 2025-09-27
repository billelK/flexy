"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Transaction = {
  id: number;
  operator: string;
  phone: string;
  amount: number;
  status: string;
  created_at: string;
};


export default function Page() {
  const [operator, setOperator] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  
  
  useEffect(() => {
      async function fetchData() {
        const rows = await window.electronAPI.getTransactions();
        setTransactions(rows);
      }
      fetchData();
  },[])


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operator || !phone || !amount) return;

    const newTx: Transaction = {
      id: transactions.length + 1,
      operator,
      phone,
      amount: Number(amount),
      status: "pending",
      created_at: new Date().toISOString(),
    };

    // TODO: call IPC insertTransaction here
    setTransactions([...transactions,newTx])

    // Reset form
    setOperator("");
    setPhone("");
    setAmount("");
  };

  return (
    <div className="flex h-screen gap-6 p-6 bg-gray-50">
      {/* Left Form */}
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Recharge Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Operator */}
            <Select value={operator} onValueChange={setOperator}>
              <SelectTrigger>
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Djezzy">Djezzy</SelectItem>
                <SelectItem value="Mobilis">Mobilis</SelectItem>
                <SelectItem value="Ooredoo">Ooredoo</SelectItem>
              </SelectContent>
            </Select>

            {/* Phone */}
            <Input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* Amount */}
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <Button type="submit">Recharge</Button>
          </form>
        </CardContent>
      </Card>

      {/* Right History */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
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
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No transactions yet
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.id}</TableCell>
                    <TableCell>{tx.operator}</TableCell>
                    <TableCell>{tx.phone}</TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>{tx.status}</TableCell>
                    <TableCell>
                      {new Date(tx.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
