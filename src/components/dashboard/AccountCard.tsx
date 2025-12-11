import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { formatCurrency, maskCardNumber } from '../../utils/formatters';

interface AccountCardProps {
  accountName: string;
  balance: number;
  cardNumber: string;
  accountType: string;
}

export const AccountCard = ({ accountName, balance, cardNumber, accountType }: AccountCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="flex flex-col justify-between h-full min-h-[200px]">
          <div>
            <p className="text-beige-200 text-sm font-body mb-2">{accountType}</p>
            <h3 className="text-2xl font-display font-bold mb-4">{accountName}</h3>
          </div>
          <div>
            <p className="text-beige-200 text-sm font-body mb-1">Solde disponible</p>
            <p className="text-3xl font-display font-bold mb-4">{formatCurrency(balance)}</p>
            <p className="text-beige-200 text-sm font-body font-mono">
              {maskCardNumber(cardNumber)}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

