export {};

declare global {
  interface Window {
    electronAPI: {
      getTransactions: () => Promise<Transaction[]>;
    };
  }
}
