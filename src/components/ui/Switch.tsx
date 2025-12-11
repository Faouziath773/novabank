import { motion } from 'framer-motion';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export const Switch = ({ checked, onChange, label, description }: SwitchProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        {label && (
          <p className="font-body font-medium text-black">{label}</p>
        )}
        {description && (
          <p className="text-sm font-body text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${checked ? 'bg-green-600' : 'bg-gray-300'}
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        `}
      >
        <motion.span
          animate={{
            x: checked ? 20 : 4,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          `}
        />
      </button>
    </div>
  );
};

