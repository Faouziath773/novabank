import { motion } from 'framer-motion';
import type { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'transfer':
        return 'text-gray-600';
      default:
        return 'text-black';
    }
  };

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return '↑';
      case 'expense':
        return '↓';
      case 'transfer':
        return '↔';
      default:
        return '';
    }
  };

  if (!transactions.length) {
    return (
      <div className="p-4 bg-beige-50 border border-beige-200 rounded-2xl font-body text-gray-700">
        Aucune transaction à afficher.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Vue desktop */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-beige-200">
              <th className="text-left py-4 px-4 font-body font-semibold text-black">Description</th>
              <th className="text-left py-4 px-4 font-body font-semibold text-black">Catégorie</th>
              <th className="text-left py-4 px-4 font-body font-semibold text-black">Date</th>
              <th className="text-right py-4 px-4 font-body font-semibold text-black">Montant</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-beige-100 hover:bg-beige-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTypeIcon(transaction.type)}</span>
                    <span className="font-body text-black">{transaction.description}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="font-body text-gray-600">{transaction.category}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="font-body text-gray-600">{formatDate(transaction.date)}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className={`font-body font-semibold ${getTypeColor(transaction.type)}`}>
                    {formatCurrency(transaction.amount)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="p-4 rounded-2xl border border-beige-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getTypeIcon(transaction.type)}</span>
                <p className="font-body font-semibold text-black">{transaction.description}</p>
              </div>
              <span className={`font-body font-semibold ${getTypeColor(transaction.type)}`}>
                {formatCurrency(transaction.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm font-body text-gray-600">
              <span>{transaction.category}</span>
              <span>{formatDate(transaction.date)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

