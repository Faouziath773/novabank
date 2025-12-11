import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface QuickAction {
  label: string;
  icon: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            fullWidth
            onClick={action.onClick}
            className="flex flex-col items-center gap-2 py-6 h-auto"
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="font-body">{action.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

