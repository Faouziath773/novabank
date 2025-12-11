import { motion } from 'framer-motion';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageWrapper } from '../components/ui/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const SimulationsPage = () => {
  return (
    <DashboardLayout>
      <PageWrapper>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-display font-bold text-black mb-2">
              Simulations
            </h1>
            <p className="text-gray-600 font-body">
              Planifiez vos scénarios financiers : prêt, épargne, investissement.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="space-y-3">
                <h2 className="text-xl font-display font-semibold text-black">
                  Bientôt disponible
                </h2>
                <p className="font-body text-gray-600">
                  La page Simulations arrive avec des modules “Que se passerait-il si...”
                  pour vos prêts, épargnes et investissements.
                </p>
                <Button variant="primary">Prévenir quand c’est prêt</Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
};


