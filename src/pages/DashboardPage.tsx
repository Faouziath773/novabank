import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageWrapper } from '../components/ui/PageWrapper';
import { AccountCard } from '../components/dashboard/AccountCard';
import { TransactionTable } from '../components/dashboard/TransactionTable';
import { QuickActions } from '../components/dashboard/QuickActions';
import { Card } from '../components/ui/Card';
import investmentHistoryData from '../data/investmentHistory.json';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { transactions, loading, getTotalBalance, getRecentTransactions } = useTransactions();

  const [transactionFilter, setTransactionFilter] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('Toutes');

  const balance = getTotalBalance();
  const recentTransactions = getRecentTransactions(10);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(transactions.map((t) => t.category))).filter(Boolean);
    return ['Toutes', ...unique];
  }, [transactions]);

  const filteredTransactions = recentTransactions.filter((t) => {
    const typeOk = transactionFilter === 'all' || t.type === transactionFilter;
    const categoryOk = categoryFilter === 'Toutes' || t.category === categoryFilter;
    return typeOk && categoryOk;
  });

  const spendingData = useMemo(() => {
    const expenses = transactions.filter((t) => t.amount < 0);
    const byCat: Record<string, number> = {};
    expenses.forEach((t) => {
      byCat[t.category] = (byCat[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(byCat).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const chartData = investmentHistoryData.map((item) => ({
    date: new Date(item.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    value: item.value,
  }));

  const quickActions = [
    { label: 'Virement', icon: '💸', onClick: () => console.log('Virement') },
    { label: 'Paiement', icon: '💳', onClick: () => console.log('Paiement') },
    { label: 'Simuler', icon: '🧮', onClick: () => navigate('/simulations') },
  ];

  const COLORS = ['#2563EB', '#10B981', '#7C3AED', '#9d8d7a', '#f59e0b'];

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-body text-gray-600">Vue d&apos;ensemble</p>
            <h1 className="text-3xl font-display font-bold text-black">Tableau de bord</h1>
          </div>

          {/* Account Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AccountCard
              accountName="Courant général"
              balance={balance}
              cardNumber="4532 1234 5678 9010"
              accountType="Compte principal"
            />
            <AccountCard
              accountName="Épargne projet"
              balance={15000}
              cardNumber="4532 9876 5432 1098"
              accountType="Fonds d'urgence"
            />
          </div>

          {/* Quick Actions & Santé financière */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <h3 className="text-xl font-display font-semibold text-black mb-4">
                Actions rapides
              </h3>
              <QuickActions actions={quickActions} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="h-full">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-display font-semibold text-black">Santé financière</h3>
                  <span className="text-sm px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-body">78 / 100</span>
                </div>
                <p className="text-sm font-body text-gray-600 mb-4">Situation stable avec marge d’optimisation.</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm font-body text-gray-700 mb-1">
                      <span>Épargne</span><span>60%</span>
                    </div>
                    <div className="h-2 bg-beige-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600" style={{ width: '60%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-body text-gray-700 mb-1">
                      <span>Budget maîtrisé</span><span>72%</span>
                    </div>
                    <div className="h-2 bg-beige-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '72%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-body text-gray-700 mb-1">
                      <span>Diversification</span><span>55%</span>
                    </div>
                    <div className="h-2 bg-beige-200 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500" style={{ width: '55%' }} />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Patrimoine & Répartition dépenses */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-semibold text-black">
                  Évolution du patrimoine
                </h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded-lg text-sm font-body bg-primary-50 text-primary-700">6M</button>
                  <button className="px-3 py-1 rounded-lg text-sm font-body text-gray-600 hover:bg-beige-100">1A</button>
                  <button className="px-3 py-1 rounded-lg text-sm font-body text-gray-600 hover:bg-beige-100">Max</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value: number) => `${value.toLocaleString('fr-FR')} €`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2563EB' }}
                    activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-semibold text-black">Dépenses par catégorie</h3>
                <span className="text-sm font-body text-gray-600">30 derniers jours</span>
              </div>
              {spendingData.length === 0 ? (
                <p className="text-sm font-body text-gray-600">Aucune dépense enregistrée.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {spendingData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `${value.toLocaleString('fr-FR')} €`}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </div>

          {/* Objectifs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-semibold text-black">Objectifs</h3>
              <span className="text-sm font-body text-gray-600">Suivi en temps réel</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-primary-50">
                <p className="font-body text-sm text-gray-700 mb-2">Vacances</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-display text-xl text-black">60%</span>
                  <span className="text-sm font-body text-primary-700">4 800 € / 8 000 €</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-primary-600" style={{ width: '60%' }} />
                </div>
              </Card>
              <Card className="bg-green-50">
                <p className="font-body text-sm text-gray-700 mb-2">Fonds d&apos;urgence</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-display text-xl text-black">60%</span>
                  <span className="text-sm font-body text-green-700">6 000 € / 10 000 €</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '60%' }} />
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-display font-semibold text-black">
                  Dernières transactions
                </h3>
                <p className="text-sm font-body text-gray-600">Filtrez par type et catégorie</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'income', 'expense', 'transfer'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTransactionFilter(filter as typeof transactionFilter)}
                    className={`px-3 py-2 rounded-xl text-sm font-body transition-colors ${
                      transactionFilter === filter
                        ? 'bg-primary-50 text-primary-700'
                        : 'bg-beige-100 text-gray-700 hover:bg-beige-200'
                    }`}
                  >
                    {filter === 'all' ? 'Tous' : filter === 'income' ? 'Revenus' : filter === 'expense' ? 'Dépenses' : 'Transferts'}
                  </button>
                ))}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border-2 border-beige-200 bg-white text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <p className="font-body text-gray-600">Chargement des transactions...</p>
            ) : (
              <TransactionTable transactions={filteredTransactions} />
            )}
          </motion.div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
};

