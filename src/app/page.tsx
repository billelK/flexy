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






type Transaction = TransactionInput & {
  id: number;
  created_at: string;
};

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [operators, setOperators] = useState([])
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
    setPage(1);
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

  const detectOperators = async () => {
    const ts = toast.loading("Detecting operators...");
    const result = await window.electronAPI.detectOperators();
    toast.dismiss(ts)
    console.log("Detected Operators:", result);
    setOperators(result)
    toast.success("Operator detection attempted. Check console for details.");
    await window.electronAPI.saveOperators(result);
  }

  const loadSavedOperators = async () => { // not using this anymore
    const saved = await window.electronAPI.readOperators()
    setOperators(saved)
  }

  useEffect(() => {
    loadSavedOperators() // not using this anymore
    // detectOperators()
  }, [])

  return (
    <div className="flex h-screen justify-between gap-6 p-6 bg-gray-50">
      {/* Left Form */}
      <Card className="w-1/4 flex flex-col relative ">
        <CardHeader>
          <CardTitle>Recharge Form</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 border-b pb-4 mb-4">
              
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
          
          <div className="mt-auto pt-4">
            <h3 className="font-semibold mb-3">Detected Operators</h3>

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

            <button
              onClick={detectOperators}
              className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              Scan Operators
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Right History */}
      <Card className="flex-1 relative">
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
    </div>
  );
}
