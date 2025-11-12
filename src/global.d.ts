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
      addTransaction: () => Promise<number>;
      mockRecharge: (transaction: any) => Promise<string>;
    };
  }
}
