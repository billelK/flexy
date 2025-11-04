"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { transactionSchema, TransactionInput, offerSchema } from "@/lib/validation";
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
    offers: any[];
    setOffers: React.Dispatch<React.SetStateAction<any[]>>;
    activeFilter: string;
    setActiveFilter: React.Dispatch<React.SetStateAction<string>>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    offerForm: any;
    setOfferForm: React.Dispatch<React.SetStateAction<any>>;
    errors: any;
    setErrors: React.Dispatch<React.SetStateAction<any>>;
    onSubmit: (data: TransactionInput) => Promise<void>;
    form: ReturnType<typeof useForm<TransactionInput>>;
    detectOperators: () => Promise<void>;
    handleFilters: (filters: any) => void;
    handleClear: () => void;
    onCreateOffer: (newOffer: any) => Promise<void>;
    resetForm: () => void;
    handleSubmit: () => void;
    handleChange: (field: string, value: string) => void;
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
  const [offers, setOffers] = useState([]); 
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [offerForm, setOfferForm] = useState({
    operator: "",
    title: "",
    description: "",
    price: "",
    ussd: "",
    image: "" 
  })
  const [errors, setErrors] = useState({})
  

  // top-up form Dependencies

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

    // Offers Management Dependencies
    const onCreateOffer = async (newOffer: any) => {
    const toastId = toast.loading("Adding new offer...");
    if (!newOffer.image) {
      if (newOffer.operator === "Djezzy") {
        newOffer.image = "/Djezzy-red.png"
      } else if (newOffer.operator === "Ooredoo") {
        newOffer.image = "/Ooredoo-white.png"
      }else {
        newOffer.image = "/Mobilis-white.png"
      }
    }
    const addedOffer = await window.electronAPI.addOffer(newOffer)

    if (addedOffer) {
      toast.dismiss(toastId);
      toast.success("Offer added successfully!");
      setOffers((prevOffers) => [addedOffer,...prevOffers]);
      setOpen(false);
    } else {
      toast.dismiss(toastId);
      toast.error("Failed to add offer.");
    }
    }

    function resetForm() {
      setOfferForm({
        operator: "",
        title: "",
        description: "",
        price: "",
        ussd: "",
        image: ""
      })
      setErrors({})
    }

    function handleSubmit() {
      const result = offerSchema.safeParse(offerForm)

      if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
      setErrors(fieldErrors)
      return
    }
      onCreateOffer(offerForm)
      resetForm() 
    }

    function handleChange(field: string, value: string) {
    setOfferForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

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
        offers,
        setOffers,
        activeFilter,
        setActiveFilter,
        open,
        setOpen,
        offerForm,
        setOfferForm,
        errors,
        setErrors,
        onSubmit,
        form,
        detectOperators,
        handleFilters,
        handleClear,
        onCreateOffer,
        resetForm,
        handleSubmit,
        handleChange
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
