import { TrendingUp, TrendingDown, Wallet, Target, Calendar } from 'lucide-react';

interface HomeViewProps {
  data: {
    balance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    transactions: any[];
    goals: any[];
  };
}

export function HomeView({ data }: HomeViewProps) {
  const savingsRate =
    data.monthlyIncome > 0
      ? ((data.balance / data.monthlyIncome) * 100).toFixed(1)
      : '0';

  const recentTransactions = data.transactions.slice(0, 5);
  const activeGoals = data.goals.filter((g) => g.status === 'active').slice(0, 3);

  const topExpenseCategories = data.transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find((item) => item.category === t.categories?.name);
      if (existing) {
        existing.amount += Number(t.amount);
      } else {
        acc.push({
          category: t.categories?.name || 'Other',
          amount: Number(t.amount),
          color: t.categories?.color || '#6B7280',
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back!
        </h1>
        <p className="text-gray-600">Here's your financial overview for this month</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">This Month</span>
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mb-2">
            <span
              className={`text-3xl font-bold ${
                data.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              ${Math.abs(data.balance).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            {data.balance >= 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600 font-medium">
                  {savingsRate}% saved
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-red-600 font-medium">Overspent</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Income</span>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-bold text-gray-900">
              ${data.monthlyIncome.toFixed(2)}
            </span>
          </div>
          <div className="text-sm text-gray-500">This month</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Expenses</span>
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-bold text-gray-900">
              ${data.monthlyExpenses.toFixed(2)}
            </span>
          </div>
          <div className="text-sm text-gray-500">This month</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Add your first transaction to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: transaction.categories?.color + '20',
                      }}
                    >
                      <span
                        className="text-lg"
                        style={{ color: transaction.categories?.color }}
                      >
                        {transaction.categories?.icon || '💰'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description || transaction.categories?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${
                      transaction.type === 'income'
                        ? 'text-emerald-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}$
                    {Number(transaction.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Spending by Category
            </h2>
            <TrendingDown className="w-5 h-5 text-gray-400" />
          </div>

          {topExpenseCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No expenses yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start tracking your spending
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {topExpenseCategories.map((cat, index) => {
                const percentage =
                  data.monthlyExpenses > 0
                    ? (cat.amount / data.monthlyExpenses) * 100
                    : 0;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {cat.category}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        ${cat.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {activeGoals.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Active Goals</h2>
            <Target className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {activeGoals.map((goal) => {
              const progress = (goal.current_amount / goal.target_amount) * 100;
              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ backgroundColor: goal.color + '20' }}
                    >
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <p className="text-sm text-gray-500">
                        ${goal.current_amount} / ${goal.target_amount}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: goal.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {progress.toFixed(0)}% complete
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
