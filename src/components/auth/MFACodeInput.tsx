import { useState, useRef } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';

interface MFACodeInputProps {
  length?: number;
  onComplete: (code: string) => void;
  error?: string;
}

export const MFACodeInput = ({ length = 6, onComplete, error }: MFACodeInputProps) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '')) {
      onComplete(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length && i < length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }
    
    setCode(newCode);
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
    
    if (newCode.every(digit => digit !== '')) {
      onComplete(newCode.join(''));
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-3 justify-center">
        {Array.from({ length }).map((_, index) => (
          <motion.input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[index]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`
              w-14 h-14 text-center text-2xl font-body font-semibold
              rounded-2xl border-2
              bg-beige-50 border-beige-300
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
              transition-all duration-200
              ${error ? 'border-red-500 focus:ring-red-500' : ''}
            `}
            whileFocus={{ scale: 1.05 }}
          />
        ))}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-sm text-red-600 font-body"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

