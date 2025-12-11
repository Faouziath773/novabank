import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../layouts/AuthLayout';
import { MFACodeInput } from '../components/auth/MFACodeInput';

export const MFAPage = () => {
  const [error, setError] = useState('');
  const { verifyMFA, isAuthenticated, isMFAVerified } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier aussi le localStorage pour éviter les problèmes de synchronisation
    const storedAuth = localStorage.getItem('novabank_auth');
    const storedMFA = localStorage.getItem('novabank_mfa');
    const isAuthFromStorage = !!storedAuth;
    const isMFAFromStorage = storedMFA === 'true';
    
    // Utiliser l'état ou le localStorage
    const authenticated = isAuthenticated || isAuthFromStorage;
    
    // Si l'utilisateur n'est pas authentifié, rediriger vers login
    if (!authenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    // Si l'utilisateur a déjà validé le MFA, rediriger vers dashboard
    if (isMFAVerified || isMFAFromStorage) {
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [isAuthenticated, isMFAVerified, navigate]);

  const handleComplete = (code: string) => {
    setError('');

    const result = verifyMFA(code);

    if (!result.success) {
      setError(result.error || 'Code incorrect');
    }
  };

  // Ne pas afficher la page si l'utilisateur n'est pas authentifié ou a déjà validé MFA
  const storedAuth = localStorage.getItem('novabank_auth');
  const storedMFA = localStorage.getItem('novabank_mfa');
  const authenticated = isAuthenticated || !!storedAuth;
  const mfaVerified = isMFAVerified || storedMFA === 'true';
  
  if (!authenticated || mfaVerified) {
    return null;
  }

  return (
    <AuthLayout
      title="Vérification"
      subtitle="Entrez le code à 6 chiffres envoyé à votre email"
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MFACodeInput onComplete={handleComplete} error={error} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-gray-600 font-body"
        >
          Code de test : <span className="font-mono font-semibold">123456</span>
        </motion.p>
      </div>
    </AuthLayout>
  );
};

