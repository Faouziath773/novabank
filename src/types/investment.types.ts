export interface Investment {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  currentValue: number;
  return: number;
  returnPercentage: number;
  category: string;
}

export interface InvestmentHistory {
  date: string;
  value: number;
}

