import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../layouts/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isMFAVerified } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier aussi le localStorage pour éviter les problèmes de synchronisation
    const storedAuth = localStorage.getItem('novabank_auth');
    const storedMFA = localStorage.getItem('novabank_mfa');
    const isAuthFromStorage = !!storedAuth;
    const isMFAFromStorage = storedMFA === 'true';
    
    // Utiliser l'état ou le localStorage
    const authenticated = isAuthenticated || isAuthFromStorage;
    const mfaVerified = isMFAVerified || isMFAFromStorage;
    
    // Si l'utilisateur est déjà authentifié et a validé MFA, rediriger vers dashboard
    if (authenticated && mfaVerified) {
      navigate('/dashboard', { replace: true });
      return;
    }
    // Si l'utilisateur est authentifié mais n'a pas validé MFA, rediriger vers MFA
    if (authenticated && !mfaVerified) {
      navigate('/mfa', { replace: true });
      return;
    }
  }, [isAuthenticated, isMFAVerified, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login({ email, password });

    if (!result.success) {
      setError(result.error || 'Erreur de connexion');
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Connexion" subtitle="Accédez à votre espace bancaire">
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre.email@example.com"
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Input
            type="password"
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-body"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-gray-600 font-body"
        >
          Utilisez n'importe quel email et mot de passe (min. 6 caractères) pour tester
        </motion.p>
      </form>
    </AuthLayout>
  );
};

