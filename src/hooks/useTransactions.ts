import { useState, useEffect } from 'react';
import transactionsData from '../data/transactions.json';
import type { Transaction } from '../types';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule un chargement asynchrone
    setTimeout(() => {
      setTransactions(transactionsData as Transaction[]);
      setLoading(false);
    }, 500);
  }, []);

  const getTotalBalance = (): number => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getRecentTransactions = (limit: number = 5): Transaction[] => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  return {
    transactions,
    loading,
    getTotalBalance,
    getRecentTransactions,
  };
};

