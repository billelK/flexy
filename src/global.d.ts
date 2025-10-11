export {};

declare global {
  interface Window {
    electronAPI: {
      getTransactions: () => Promise<Transaction[]>;
      detectOperators: () => Promise<any>;
      saveOperators: (operators: any) => Promise<void>;
      readOperators: () => Promise<any>;
      addTransaction: () => Promise<number>;
      mockRecharge: (transaction: any) => Promise<string>;
    };
  }
}
