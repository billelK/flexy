"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { toast } from "sonner"

import TransactionFilters from "@/components/Filters";
import { PaginationControls } from "@/components/pagination";

import { transactionSchema, TransactionInput } from "@/lib/validation";
import { set } from "zod";


type Transaction = TransactionInput & {
  id: number;
  created_at: string;
};

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // setup form
  const form = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      operator: undefined,
      phone: "",
      amount: 0,
      status: "Pending",
    },
  });

  useEffect(() => {

    window.electronAPI.getTransactions().then((data: Transaction[]) => {
      let filtered = data

      if (filters.phone) {
        filtered = filtered.filter(tx => tx.phone.includes(filters.phone));
      }
      if (filters.operator) {
        filtered = filtered.filter(tx => tx.operator === filters.operator);
      }
      if (filters.date) {
        filtered = filtered.filter((t) => {
          const txDate = new Date(t.created_at);
          // Compare only the date part, not the time
          return txDate.toDateString() === new Date(filters.date).toDateString();
        });
      }
      setPage(1);
      setTransactions(filtered);
    })
    
  }, [filters]);

  const totalPages = Math.ceil(transactions.length / pageSize);
  const paginated = transactions.slice((page - 1) * pageSize, page * pageSize);

  const onSubmit = async (data: TransactionInput) => {
    
    const newTx: Transaction = {
      id: transactions.length > 0 ? transactions[0].id + 1 : 1,
      ...data,
      created_at: new Date().toISOString(),
    }
    
    setTransactions([newTx,...transactions]);
    const toastId = toast.loading("Recharge is pending. You'll be notified once it's completed.");

    const transaction = await window.electronAPI.mockRecharge(newTx);
    await window.electronAPI.addTransaction(transaction);
    setTransactions([transaction,...transactions])

    if (transaction.status === "Completed") {
      toast.dismiss(toastId);
      toast.success("Recharge successful!");
    } else if (transaction.status === "Failed") {
      toast.dismiss(toastId);
      toast.error("Recharge failed. Please try again.");
    }
      
    
    
    form.reset();
  };

  const handleClear = () => {
    setPage(1);
    window.electronAPI.getTransactions().then((data: Transaction[]) => {
      setTransactions(data); 
    });
  };

  return (
    <div className="flex h-screen gap-6 p-6 bg-gray-50">
      {/* Left Form */}
      <Card className="w-1/4">
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
                      <Select onValueChange={(value) => {
                        field.onChange(value);

                        // auto-fill phone prefix depending on operator
                        if (value === "Mobilis") {
                          form.setValue("phone", "06");
                        } else if (value === "Ooredoo") {
                          form.setValue("phone", "05");
                        } else if (value === "Djezzy") {
                          form.setValue("phone", "07");
                        }
                      }} value={field.value}>
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

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="DA" {...field} />
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
                      <Input
                        {...field}
                        maxLength={10}
                        inputMode="numeric"
                        placeholder="e.g., 07XXXXXXXX"
                        onChange={(e) => {
                          // remove all non-digits
                          const onlyNums = e.target.value.replace(/\D/g, "");
                          field.onChange(onlyNums);
                        }}
                      />
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
                    No transactions yet
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
        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  );
}
