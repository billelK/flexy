"use client";
import { createContext, useContext, useState, ReactNode } from "react";

import { transactionSchema, TransactionInput } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner"

// Define the types for better autocomplete
interface AppContextType {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
    operators: string | null;
    setOperators: (op: [] | null) => void;
    filters: any[];
    setFilters: React.Dispatch<React.SetStateAction<any[]>>;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    onSubmit: (data: TransactionInput) => Promise<void>;
    form: ReturnType<typeof useForm<TransactionInput>>;
    detectOperators: () => Promise<void>;
    handleFilters: (filters: any) => void;
    handleClear: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type Transaction = TransactionInput & {
  id: number;
  created_at: string;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [operators, setOperators] = useState([])
  const [filters, setFilters] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  

  // Recharge form Dependencies

    const form = useForm<TransactionInput>({
            resolver: zodResolver(transactionSchema),
            defaultValues: {
            operator: "",
            phone: "",
            amount: "",
            mode:"",
            status: "Pending",
            },
    });

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
        toast.success(transaction.message);
        } else if (transaction.status === "Failed") {
        toast.dismiss(toastId);
        toast.error(transaction.message);
        }
        
        
        
        form.reset();
    };

    // Modem Detection Dependencies
    const detectOperators = async () => {

            const ts = toast.loading("Detecting sim modems...");
            const result = await window.electronAPI.detectOperators();
            toast.dismiss(ts)
            setOperators(result)
            toast.success("Operator detection scan completed.");
            await window.electronAPI.saveOperators(result);
    }

    // Transactions History Dependencies
    const handleFilters = (filters: any) => {
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
                return txDate.toDateString() === new Date(filters.date).toDateString();
                });
            }
            setPage(1);
            setTransactions(filtered);
            })
    };

    const handleClear = () => {
        setPage(1);
        window.electronAPI.getTransactions().then((data: Transaction[]) => {
        setTransactions(data); 
        });
    };

  return (
    <AppContext.Provider
      value={{
        transactions,
        setTransactions,
        operators,
        setOperators,
        filters,
        setFilters,
        page,
        setPage,
        onSubmit,
        form,
        detectOperators,
        handleFilters,
        handleClear
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook for easy use in components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
