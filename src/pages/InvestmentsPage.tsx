import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageWrapper } from '../components/ui/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import investmentsData from '../data/investments.json';
import investmentHistoryData from '../data/investmentHistory.json';
import type { Investment } from '../types';

const INDEX_SERIES = [
  { name: 'CAC40', color: '#2563EB', offset: 0.96 },
  { name: 'S&P500', color: '#7C3AED', offset: 1.04 },
];

const CRYPTO_POSITIONS = [
  { name: 'Bitcoin', symbol: 'BTC', value: 800, return: 12.5 },
  { name: 'Ethereum', symbol: 'ETH', value: 700, return: 8.1 },
  { name: 'Solana', symbol: 'SOL', value: 600, return: 5.4 },
];

export const InvestmentsPage = () => {
  const [activeSlice, setActiveSlice] = useState<string | null>(null);
  const investments = investmentsData as Investment[];

  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturn = investments.reduce((sum, inv) => sum + inv.return, 0);
  const totalReturnPercentage = (totalReturn / (totalValue - totalReturn)) * 100;

  const pieData = investments.map((inv) => ({
    name: inv.name,
    value: inv.currentValue,
  }));

  const barData = investments.map((inv) => ({
    name: inv.symbol,
    rendement: inv.returnPercentage,
  }));

  const historicalData = useMemo(() => {
    return investmentHistoryData.map((item) => {
      const base = item.value;
      const indexValues = INDEX_SERIES.reduce<Record<string, number>>((acc, idx) => {
        acc[idx.name] = base * idx.offset;
        return acc;
      }, {});
      return {
        date: new Date(item.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        valeur: base,
        ...indexValues,
      };
    });
  }, []);

  const COLORS = ['#2563EB', '#10B981', '#7C3AED', '#f59e0b', '#14b8a6'];

  const recommendations = [
    { title: 'Rééquilibrer Actions Tech', detail: 'Réduire à 45% et renforcer Fonds Éthique', type: 'diversification' },
    { title: 'Augmenter Épargne projet', detail: '+200 €/mois pour atteindre l’objectif plus vite', type: 'épargne' },
    { title: 'Crypto : sécuriser les gains', detail: 'Prendre 10% de profits et réallouer en fonds défensifs', type: 'risque' },
  ];

  const activeLabel = activeSlice ?? 'Répartition du portefeuille';

  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-body text-gray-600">Vue d&apos;ensemble</p>
            <h1 className="text-3xl font-display font-bold text-black">Investissements</h1>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-primary-50">
              <p className="text-sm font-body text-gray-700 mb-2">Valeur totale</p>
              <p className="text-3xl font-display font-bold text-black">{formatCurrency(totalValue)}</p>
            </Card>
            <Card className="bg-green-50">
              <p className="text-sm font-body text-gray-700 mb-2">Rendement total</p>
              <p className="text-3xl font-display font-bold text-green-700">{formatCurrency(totalReturn)}</p>
            </Card>
            <Card className="bg-violet-50">
              <p className="text-sm font-body text-gray-700 mb-2">Performance</p>
              <p className="text-3xl font-display font-bold text-violet-700">{formatPercentage(totalReturnPercentage)}</p>
            </Card>
            <Card className="bg-white border border-beige-200">
              <p className="text-sm font-body text-gray-700 mb-2">Portefeuille crypto</p>
              <p className="text-3xl font-display font-bold text-black">
                {formatCurrency(CRYPTO_POSITIONS.reduce((s, c) => s + c.value, 0))}
              </p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="xl:col-span-2 bg-white rounded-2xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-semibold text-black">Performance (6 mois)</h3>
                <div className="flex items-center gap-3 text-sm font-body text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary-600" /> Portefeuille
                  </span>
                  {INDEX_SERIES.map((idx) => (
                    <span key={idx.name} className="inline-flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: idx.color }} />
                      {idx.name}
                    </span>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value: number) => `${formatCurrency(value as number)}`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="valeur"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2563EB' }}
                    activeDot={{ r: 6 }}
                  />
                  {INDEX_SERIES.map((idx) => (
                    <Line
                      key={idx.name}
                      type="monotone"
                      dataKey={idx.name}
                      stroke={idx.color}
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-semibold text-black">{activeLabel}</h3>
                <span className="text-sm font-body text-gray-600">Cliquer pour détails</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    onMouseEnter={(data) => setActiveSlice(data.name)}
                    onMouseLeave={() => setActiveSlice(null)}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${formatCurrency(value)}`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {investments.map((inv) => (
                  <Card key={inv.id} className="border border-beige-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display font-semibold text-black">{inv.name}</p>
                        <p className="font-body text-sm text-gray-600">{inv.symbol}</p>
                      </div>
                      <p className="font-body font-semibold text-primary-700">
                        {formatCurrency(inv.currentValue)}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Rendements + crypto */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6"
            >
              <h3 className="text-xl font-display font-semibold text-black mb-4">
                Rendements par investissement
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)}%`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="rendement" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-display font-semibold text-black">Portefeuille crypto</h3>
                <span className="text-sm font-body text-gray-600">Clôture 24h</span>
              </div>
              <div className="space-y-3">
                {CRYPTO_POSITIONS.map((c) => (
                  <Card key={c.symbol} className="border border-beige-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display font-semibold text-black">{c.name}</p>
                        <p className="font-body text-sm text-gray-600">{c.symbol}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-body font-semibold text-black">{formatCurrency(c.value)}</p>
                        <p className={`text-sm font-body ${c.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(c.return)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recommandations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-semibold text-black">Recommandations</h3>
              <Button variant="outline" size="sm">Actualiser</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec, idx) => (
                <Card key={idx} className="border border-beige-200">
                  <p className="text-sm uppercase font-body text-gray-500 mb-1">{rec.type}</p>
                  <h4 className="font-display font-semibold text-black mb-2">{rec.title}</h4>
                  <p className="font-body text-sm text-gray-700">{rec.detail}</p>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Investment Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-xl font-display font-semibold text-black mb-4">
              Mes investissements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {investments.map((investment, index) => (
                <motion.div
                  key={investment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card hover>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-display font-semibold text-black">
                            {investment.name}
                          </h4>
                          <p className="text-sm font-body text-gray-600">{investment.symbol}</p>
                        </div>
                        <span className="text-2xl">📈</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-body text-gray-600">Valeur actuelle</span>
                          <span className="font-body font-semibold text-black">
                            {formatCurrency(investment.currentValue)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-body text-gray-600">Rendement</span>
                          <span
                            className={`font-body font-semibold ${
                              investment.return >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {formatCurrency(investment.return)} ({formatPercentage(investment.returnPercentage)})
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
};

