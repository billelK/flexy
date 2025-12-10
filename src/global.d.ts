export {};


declare global {
  interface Window {
    electronAPI: {
      getTransactions: () => Promise<Transaction[]>;
      getOffers: () => Promise<[]>;

      detectOperators: () => Promise<[]>;
      saveOperators: (operators: Operators[]) => Promise<boolean>;
      /* eslint-disable*/
      readOperators: () => Promise<any>;

      addTransaction: (transaction: Transaction[]) => Promise<number>;
      mockRecharge: (transaction) => Promise<Transaction[]>;
    };
  }
}
