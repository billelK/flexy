export {};

declare global {
  interface Window {
    electronAPI: {
      getTransactions: () => Promise<Transaction[]>;
      addTransaction: () => Promise<number>;
      mockRecharge: (transaction: any) => Promise<string>;
    };
  }
}
