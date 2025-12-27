export {};

declare global {
  interface Window {
    electronAPI: {
      getTransactions: () => Promise<Transaction[]>;
      getOffers: () => Promise<offer[]>;

      detectOperators: () => Promise<Operator[]>;
      saveOperators: (operators: Operator[]) => Promise<boolean>;
      /* eslint-disable*/
      readOperators: () => Promise<any>;

      addTransaction: (transaction: Transaction) => Promise<number>;
      mockRecharge: (transaction: Transaction) => Promise<Transaction>;
      sendUSSDOffer: (offer: any, phone: string) => Promise<Transaction>;
      
      addOffer: (offer: any) => Promise<offer>;
      updateOffer: (offer: any) => Promise<offer>;
      deleteOffer: (id: number) => Promise<boolean>;
    };
  }
}

interface Transaction {
  operator: "Djezzy" | "Mobilis" | "Ooredoo";
  mode: "Recharge" | "Facture" | "Activation";
  phone: string;
  amount: number;
  status: "Pending" | "Completed" | "Failed";
  id: number;
  created_at: string;
  message?: string;
}

interface offer {
  id: number;
  operator: string;
  title: string;
  description: string;
  price: number;
  ussd_code: string;
  image: string;
}

interface Operator {
  operator: string;
  port: string;
  manufacturer: string;
}
