export {};

declare global {
  interface Window {
    electronAPI: {
      getTransactions: () => Promise<Transaction[]>;
      detectOperators: () => Promise<any>;
      addTransaction: () => Promise<number>;
      mockRecharge: (transaction: any) => Promise<string>;
    };
  }
}
