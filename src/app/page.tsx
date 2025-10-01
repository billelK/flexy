"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";

import { transactionSchema, TransactionInput } from "@/lib/validation";

type Transaction = TransactionInput & {
  id: number;
  created_at: string;
};

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // setup form
  const form = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      operator: "",
      phone: "",
      amount: 0,
      status: "Pending",
    },
  });

  useEffect(() => {
    async function fetchData() {
      const rows = await window.electronAPI.getTransactions();
      setTransactions(rows);
    }
    fetchData();
  }, []);

  const onSubmit = async (data: TransactionInput) => {
    let newTx: Transaction = {
      id: transactions.length + 1,
      ...data,
      created_at: new Date().toISOString(),
    };

    setTransactions([...transactions, newTx]);

    await window.electronAPI.addTransaction(newTx);

  //   if (result === "1") {
  //     newTx = { ...newTx, status: "Completed" };
  //     console.log("Transaction added successfully");
  //   } else {
  //     newTx = { ...newTx, status: "Failed" };
  //     console.log("Failed to add transaction");
  //   }
  };

  return (
    <div className="flex h-screen gap-6 p-6 bg-gray-50">
      {/* Left Form */}
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Recharge Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

              {/* Operator */}
              <FormField
                control={form.control}
                name="operator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operator</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Djezzy">Djezzy</SelectItem>
                          <SelectItem value="Mobilis">Mobilis</SelectItem>
                          <SelectItem value="Ooredoo">Ooredoo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="0555123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Recharge</Button>
            </form>
          </Form>
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
                <TableHead>Date / Time</TableHead>
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
                    <TableCell>{`DA ${tx.amount}.00`}</TableCell>
                    <TableCell>{tx.status}</TableCell>
                    <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
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
