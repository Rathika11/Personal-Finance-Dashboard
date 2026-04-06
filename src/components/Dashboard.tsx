import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  PlusCircle,
  Receipt,
  Target,
  Lightbulb,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';
import { HomeView } from './views/HomeView';
import { TransactionsView } from './views/TransactionsView';
import { GoalsView } from './views/GoalsView';
import { InsightsView } from './views/InsightsView';
import { AddTransactionModal } from './modals/AddTransactionModal';

type View = 'home' | 'transactions' | 'goals' | 'insights';

interface DashboardData {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  transactions: any[];
  goals: any[];
  categories: any[];
}

export function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState<DashboardData>({
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    transactions: [],
    goals: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();

  const loadData = async () => {
    if (!user) return;

    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];

      const [profileResult, transactionsResult, goalsResult, categoriesResult] =
        await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase
            .from('transactions')
            .select('*, categories(*)')
            .eq('user_id', user.id)
            .order('date', { ascending: false })
            .limit(100),
          supabase
            .from('goals')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase.from('categories').select('*'),
        ]);

      const transactions = transactionsResult.data || [];
      const thisMonthTransactions = transactions.filter(
        (t) => t.date >= firstDayOfMonth
      );

      const monthlyIncome = thisMonthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const monthlyExpenses = thisMonthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const balance = monthlyIncome - monthlyExpenses;

      setData({
        balance,
        monthlyIncome,
        monthlyExpenses,
        transactions,
        goals: goalsResult.data || [],
        categories: categoriesResult.data || [],
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const navItems = [
    { id: 'home' as View, label: 'Home', icon: Home },
    { id: 'transactions' as View, label: 'Transactions', icon: Receipt },
    { id: 'goals' as View, label: 'Goals', icon: Target },
    { id: 'insights' as View, label: 'Insights', icon: Lightbulb },
  ];

  const renderView = () => {
    const props = { data, onDataChange: loadData };

    switch (currentView) {
      case 'home':
        return <HomeView {...props} />;
      case 'transactions':
        return <TransactionsView {...props} />;
      case 'goals':
        return <GoalsView {...props} />;
      case 'insights':
        return <InsightsView {...props} />;
      default:
        return <HomeView {...props} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">MoneyMind</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentView === item.id
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={signOut}
                className="text-gray-600 hover:text-gray-900 px-4 py-2"
              >
                Sign Out
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    currentView === item.id
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={signOut}
                className="w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>

      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110 z-50"
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      {showAddModal && (
        <AddTransactionModal
          categories={data.categories}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            loadData();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
