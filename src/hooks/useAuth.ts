import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import userData from '../data/user.json';
import mfaCodeData from '../data/mfaCode.json';
import type { User, AuthCredentials } from '../types';
import { isValidEmail, isValidPassword } from '../utils/validators';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMFAVerified, setIsMFAVerified] = useState(false);
  const navigate = useNavigate();

  // Fonction pour charger l'état depuis le localStorage
  const loadAuthState = useCallback(() => {
    const storedAuth = localStorage.getItem('novabank_auth');
    const storedMFA = localStorage.getItem('novabank_mfa');
    
    if (storedAuth) {
      try {
        const parsedUser = JSON.parse(storedAuth);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        // Si erreur de parsing, nettoyer le localStorage
        localStorage.removeItem('novabank_auth');
      }
    }
    
    if (storedMFA === 'true') {
      setIsMFAVerified(true);
    }
  }, []);

  useEffect(() => {
    loadAuthState();
  }, [loadAuthState]);

  const login = (credentials: AuthCredentials): { success: boolean; error?: string } => {
    if (!isValidEmail(credentials.email)) {
      return { success: false, error: 'Email invalide' };
    }

    if (!isValidPassword(credentials.password)) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
    }

    // Mock login - accepte n'importe quel email/password valide
    const userDataTyped = userData as Omit<User, 'avatar'> & { avatar: null };
    setUser({ ...userDataTyped, avatar: undefined });
    setIsAuthenticated(true);
    localStorage.setItem('novabank_auth', JSON.stringify(userData));
    navigate('/mfa');
    
    return { success: true };
  };

  const verifyMFA = (code: string): { success: boolean; error?: string } => {
    if (code === mfaCodeData.code) {
      setIsMFAVerified(true);
      localStorage.setItem('novabank_mfa', 'true');
      navigate('/dashboard');
      return { success: true };
    }
    
    return { success: false, error: 'Code MFA incorrect' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsMFAVerified(false);
    localStorage.removeItem('novabank_auth');
    localStorage.removeItem('novabank_mfa');
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    isMFAVerified,
    login,
    verifyMFA,
    logout,
  };
};

