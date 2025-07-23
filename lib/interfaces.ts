export interface Stock {
    stockId: string;
    symbol: string;
    name: string;
    weight: number;
    price: number;
  }
  
  export interface StockHolding {
    stockId: string;
    price: number;
    userHoldingUSD: number;
    sharesOwned: number;
    netGain: number;
  }
  
  export interface Crate {
    crateId: string;
    name: string;
    description: string;
    imageUrl: string;
    subscriptionAmount: number;
    subscriptionPeriod: string;
    rebalanceFrequency: string;
    riskPercent: number;
    totalReturnPercent: number;
    monthlyReturnPercent: number;
    activeSubscribers: number;
    createProgramAddressSync: string;
    stocks: Stock[];
    userInvestment: {
      investedAmount: number;
      currentValue: number;
      totalReturnPercent: number;
      monthlyReturnPercent: number;
      stockHoldings: StockHolding[];
    };
  }
  
  export interface EnrichedUser {
    wallet: string;
    email: string;
    name: string;
    dinari_account_id: string;
    is_kyc_complete: boolean;
    nationality: string;
    phoneNumber: string;
    kyc: any;
    currentValidateAccounts: any[];
    totalInvested: number;
    totalReturnPercent: number;
    totalUniqueStocks: number;
    totalInvestedCrates: number;
    transactions: any[];
    subscribedCrates: Crate[];
  }