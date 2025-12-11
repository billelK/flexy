"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { transactionSchema, TransactionInput, offerSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner"
import { z } from "zod";


// Define the types for better autocomplete
interface AppContextType {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    operators: Operator[]; 
    setOperators: React.Dispatch<React.SetStateAction<Operator[]>>;
    filters: FilterData;
    setFilters: React.Dispatch<React.SetStateAction<FilterData>>;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    offers: offer[];
    setOffers: React.Dispatch<React.SetStateAction<offer[]>>;
    activeFilter: string;
    setActiveFilter: React.Dispatch<React.SetStateAction<string>>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    offerForm: offerForm;
    setOfferForm: React.Dispatch<React.SetStateAction<offerForm>>;
    modemsChecked: boolean;
    setModemsChecked: React.Dispatch<React.SetStateAction<boolean>>;
    /* eslint-disable */
    errors: any;
    setErrors: React.Dispatch<React.SetStateAction<any>>;
    isCreation: boolean;
    setIsCreation: React.Dispatch<React.SetStateAction<boolean>>;
    offerToUpdate: any;
    setOfferToUpdate: React.Dispatch<React.SetStateAction<any>>;

    onSubmit: (data: TransactionInput) => Promise<void>;
    form: ReturnType<typeof useForm<TransactionInput>>;
    detectOperators: () => Promise<void>;
    handleFilters: (filters: FilterData) => void;
    handleClear: () => void;
    onCreateOffer: (newOffer: any) => Promise<void>;
    resetForm: () => void;
    handleSubmit: () => void;
    handleChange: (field: string, value: string) => void;
    onEditOffer: (updatedOffer: any) => void;
    onDeleteOffer: (id: number) => Promise<void>;
    detectModemsOnce: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type Transaction = TransactionInput & {
  id: number;
  created_at: string;
};

interface offer {
  id: number;
  operator: string;
  title: string;
  description: string;
  price: number;
  ussd_code: string;
  image: string;
}

type offerForm = {
  operator: string;
  title: string;
  description: string;
  price: number;
  ussd_code: string;
  image: string;
}

interface FilterData {
    phone: string;
    operator: string;
    date: Date | undefined
}

interface Operator {
    operator: string;
    port: string;
    manufacturer: string;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [filters, setFilters] = useState<FilterData>({ phone: "", operator: "", date: undefined });
  const [page, setPage] = useState(1);
  const [offers, setOffers] = useState<offer[]>([]); 
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [offerForm, setOfferForm] = useState({
    operator: "",
    title: "",
    description: "",
    price: 0,
    ussd_code: "",
    image: "" 
  })
  const [errors, setErrors] = useState({})
  const [isCreation, setIsCreation] = useState(true);
  const [offerToUpdate, setOfferToUpdate] = useState<any>(null);
  const [modemsChecked, setModemsChecked] = useState<boolean>(false);
  
  // top-up form Dependencies

    const form = useForm<z.infer<typeof transactionSchema>>({
            resolver: zodResolver(transactionSchema) as Resolver<z.infer<typeof transactionSchema>>,
            defaultValues: {
            operator: undefined,
            phone: "",
            amount: 0,
            mode: undefined,
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

    async function detectModemsOnce() {
        if (modemsChecked) return; 
        detectOperators()
        setModemsChecked(true);
      }

    // Transactions History Dependencies
    const handleFilters = (filters: FilterData) => {
            
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
                const filterDate = new Date(filters.date as Date); // filters.date is guaranteed to exist here
                return txDate.toDateString() === filterDate.toDateString();
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
        price: 0,
        ussd_code: "",
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

      if (isCreation) {
        onCreateOffer(offerForm)
        resetForm() 
      } else { 
        onUpdateOffer({id: offerToUpdate.id, ...offerForm})
      }
      
    }

    const onUpdateOffer = async (updatedOffer: any) => {
      
      const toastId = toast.loading("Updating offer...");
      const result = await window.electronAPI.updateOffer(updatedOffer)
      
      if (result) {
        toast.dismiss(toastId);
        toast.success("Offer updated successfully!");
        setOffers((prevOffers) => prevOffers.map((offer) => offer.id === result.id ? result : offer));
        setOpen(false);
      } else {
        toast.dismiss(toastId);
        toast.error("Failed to update offer.");
      }
    }

    const onEditOffer = (clickedOffer: any) => {
      
      setIsCreation(false)
      setOfferForm({operator: clickedOffer.operator,
                    title: clickedOffer.title,
                    description: clickedOffer.description,
                    price: clickedOffer.price,
                    ussd_code: clickedOffer.ussd_code,
                    image: clickedOffer.image
                  })
      setOfferToUpdate(clickedOffer)
      
      
      setOpen(true)
    }

    function handleChange(field: string, value: string) {
      setOfferForm(prev => ({ ...prev, [field]: value }))
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    const onDeleteOffer = async(id: number) => {
      const toastId = toast.loading("Deleting offer...");
      const result = await window.electronAPI.deleteOffer(id)
      if (result) {
        toast.dismiss(toastId);
        toast.success("Offer deleted successfully!");
        setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== id));
      } else {
        toast.dismiss(toastId);
        toast.error("Failed to delete offer.");
      }
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
        isCreation,
        setIsCreation,
        modemsChecked,
        setModemsChecked,
        offerToUpdate,
        setOfferToUpdate,

        onSubmit,
        form,
        detectOperators,
        handleFilters,
        handleClear,
        onCreateOffer,
        resetForm,
        handleSubmit,
        handleChange, 
        onEditOffer,
        onDeleteOffer,
        detectModemsOnce

        
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