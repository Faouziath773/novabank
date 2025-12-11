import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageWrapper } from '../components/ui/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { useAuth } from '../hooks/useAuth';

type ThemeMode = 'light' | 'dark' | 'auto';

const persistTheme = (mode: ThemeMode) => {
  localStorage.setItem('novabank_theme', mode);
  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', mode);
  }
};

export const SettingsPage = () => {
  const { user } = useAuth();

  // État du profil
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');

  // État de sécurité
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // État des notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // État des préférences
  const [language, setLanguage] = useState('fr');
  const [currency, setCurrency] = useState('EUR');
  const [theme, setTheme] = useState<ThemeMode>('light');

  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const storedTheme = (localStorage.getItem('novabank_theme') as ThemeMode | null) ?? 'light';
    setTheme(storedTheme);
    persistTheme(storedTheme);
  }, []);

  const handleSaveProfile = () => {
    setSaveMessage('Profil mis à jour avec succès');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setSaveError('Les mots de passe ne correspondent pas');
      return;
    }
    if (newPassword.length < 6) {
      setSaveError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setSaveError('');
    setSaveMessage('Mot de passe modifié avec succès');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSavePreferences = () => {
    persistTheme(theme);
    setSaveMessage('Préférences sauvegardées');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold text-black mb-2">Paramètres</h1>
            <p className="text-gray-600 font-body">Gérez vos préférences et vos informations personnelles</p>
          </motion.div>

          {/* Messages de succès/erreur */}
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-body"
            >
              {saveMessage}
            </motion.div>
          )}
          {saveError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-body"
            >
              {saveError}
            </motion.div>
          )}

          {/* Profil & Sécurité */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-body text-gray-600">Profil & Sécurité</p>
                    <h2 className="text-xl font-display font-semibold text-black">Profil</h2>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-body">À jour</span>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Votre prénom" />
                    <Input label="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Votre nom" />
                  </div>
                  <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre.email@example.com" />
                  <div className="pt-4">
                    <Button onClick={handleSaveProfile} variant="primary">Enregistrer les modifications</Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-body text-gray-600">Profil & Sécurité</p>
                    <h2 className="text-xl font-display font-semibold text-black">Sécurité</h2>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 font-body">MFA actif</span>
                </div>
                <div className="space-y-4">
                  <Input label="Mot de passe actuel" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                  <Input label="Nouveau mot de passe" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                  <Input label="Confirmer le nouveau mot de passe" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                  <div className="pt-2">
                    <Button onClick={handleChangePassword} variant="primary">Modifier le mot de passe</Button>
                  </div>
                  <div className="pt-4 border-t border-beige-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-body font-medium text-black">Authentification à deux facteurs (MFA)</p>
                        <p className="text-sm font-body text-gray-600 mt-1">Renforcez la sécurité avec un code secondaire.</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-body font-medium">
                        Activé
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Notifications & Préférences d'affichage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-body text-gray-600">Notifications</p>
                    <h2 className="text-xl font-display font-semibold text-black">Alertes & messages</h2>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-body">Personnalisé</span>
                </div>
                <div className="space-y-6">
                  <Switch checked={emailNotifications} onChange={setEmailNotifications} label="Notifications par email" description="Recevez les alertes importantes par email" />
                  <Switch checked={pushNotifications} onChange={setPushNotifications} label="Notifications push" description="Alertes en temps réel sur vos appareils" />
                  <Switch checked={transactionAlerts} onChange={setTransactionAlerts} label="Alertes de transaction" description="Suivi des débits, virements, retraits" />
                  <Switch checked={marketingEmails} onChange={setMarketingEmails} label="Emails marketing" description="Recevez nos offres et actualités" />
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-body text-gray-600">Préférences</p>
                    <h2 className="text-xl font-display font-semibold text-black">Affichage & langue</h2>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-beige-100 text-gray-800 font-body">Synchro app</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-body font-medium text-black mb-2">Langue</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 bg-beige-50 border-beige-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-body text-black"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium text-black mb-2">Devise</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 bg-beige-50 border-beige-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-body text-black"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium text-black mb-2">Thème</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as ThemeMode)}
                      className="w-full px-4 py-3 rounded-2xl border-2 bg-beige-50 border-beige-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-body text-black"
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="auto">Automatique</option>
                    </select>
                    <p className="text-xs font-body text-gray-600 mt-2">
                      Le mode auto suivra vos préférences système.
                    </p>
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleSavePreferences} variant="primary">Enregistrer les préférences</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Confidentialité */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-body text-gray-600">Confidentialité</p>
                  <h2 className="text-xl font-display font-semibold text-black">Données & partages</h2>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-body">Contrôle</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border border-beige-200">
                  <p className="font-display font-semibold text-black mb-1">Export des données</p>
                  <p className="font-body text-sm text-gray-600 mb-3">Obtenez une copie de vos données en CSV/JSON.</p>
                  <Button variant="outline" size="sm">Exporter</Button>
                </Card>
                <Card className="border border-beige-200">
                  <p className="font-display font-semibold text-black mb-1">Partage avec partenaires</p>
                  <p className="font-body text-sm text-gray-600 mb-3">Gérez les consentements pour les services tiers.</p>
                  <Button variant="outline" size="sm">Gérer les consentements</Button>
                </Card>
                <Card className="border border-beige-200">
                  <p className="font-display font-semibold text-black mb-1">Suppression</p>
                  <p className="font-body text-sm text-gray-600 mb-3">Demandez la suppression de vos données.</p>
                  <Button variant="outline" size="sm">Demander</Button>
                </Card>
              </div>
            </Card>
          </motion.div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
};

