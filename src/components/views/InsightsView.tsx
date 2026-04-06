import { Lightbulb, TrendingUp, AlertCircle, CheckCircle, Target } from 'lucide-react';

interface InsightsViewProps {
  data: {
    balance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    transactions: any[];
    goals: any[];
  };
}

export function InsightsView({ data }: InsightsViewProps) {
  const savingsRate =
    data.monthlyIncome > 0 ? (data.balance / data.monthlyIncome) * 100 : 0;

  const transactionCount = data.transactions.length;
  const activeGoalsCount = data.goals.filter((g) => g.status === 'active').length;

  const categorySpending = data.transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find((item) => item.category === t.categories?.name);
      if (existing) {
        existing.amount += Number(t.amount);
        existing.count += 1;
      } else {
        acc.push({
          category: t.categories?.name || 'Other',
          amount: Number(t.amount),
          count: 1,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categorySpending[0];

  let wellnessScore = 50;

  if (savingsRate > 0) wellnessScore += 15;
  if (savingsRate >= 20) wellnessScore += 15;
  if (transactionCount > 5) wellnessScore += 10;
  if (activeGoalsCount > 0) wellnessScore += 10;

  wellnessScore = Math.min(wellnessScore, 100);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#3B82F6';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const insights = [];

  if (savingsRate < 10) {
    insights.push({
      type: 'warning',
      title: 'Low Savings Rate',
      description: `You're only saving ${savingsRate.toFixed(
        1
      )}% of your income. Try to aim for at least 20% to build a healthy financial cushion.`,
      action: 'Review your expenses and see where you can cut back',
    });
  } else if (savingsRate >= 20) {
    insights.push({
      type: 'success',
      title: 'Great Savings Habit!',
      description: `You're saving ${savingsRate.toFixed(
        1
      )}% of your income. Keep up the excellent work!`,
      action: 'Consider setting a new savings goal to stay motivated',
    });
  }

  if (topCategory && topCategory.amount > data.monthlyExpenses * 0.4) {
    insights.push({
      type: 'warning',
      title: 'High Spending in One Category',
      description: `${
        topCategory.category
      } accounts for ${((topCategory.amount / data.monthlyExpenses) * 100).toFixed(
        0
      )}% of your expenses. This might be an area to review.`,
      action: 'Look for ways to reduce spending in this category',
    });
  }

  if (activeGoalsCount === 0) {
    insights.push({
      type: 'info',
      title: 'Set Your First Goal',
      description:
        'Having clear savings goals helps you stay motivated and focused on your financial journey.',
      action: 'Create a goal for something meaningful to you',
    });
  }

  if (transactionCount < 5) {
    insights.push({
      type: 'info',
      title: 'Track More Transactions',
      description:
        'The more transactions you track, the better insights we can provide about your spending patterns.',
      action: 'Add your recent purchases to get personalized tips',
    });
  }

  const thisWeekTransactions = data.transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return transactionDate >= weekAgo;
  });

  const weekExpenses = thisWeekTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const avgWeeklyExpenses = (data.monthlyExpenses / 4.33).toFixed(2);

  if (weekExpenses > parseFloat(avgWeeklyExpenses) * 1.5) {
    insights.push({
      type: 'warning',
      title: 'Higher Than Usual Spending',
      description: `You've spent $${weekExpenses.toFixed(
        2
      )} this week, which is above your weekly average of $${avgWeeklyExpenses}.`,
      action: 'Try to be mindful of unnecessary purchases',
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Financial Wellness
        </h1>
        <p className="text-gray-600">
          Personalized insights to improve your financial health
        </p>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Financial Wellness Score
          </h2>
          <p className="text-gray-600">
            Based on your spending habits, savings rate, and financial goals
          </p>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="#E5E7EB"
                strokeWidth="16"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke={getScoreColor(wellnessScore)}
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${(wellnessScore / 100) * 502.4} 502.4`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-5xl font-bold"
                style={{ color: getScoreColor(wellnessScore) }}
              >
                {wellnessScore}
              </span>
              <span className="text-gray-600 font-medium mt-1">
                {getScoreLabel(wellnessScore)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Savings Rate</div>
            <div className="text-2xl font-bold text-gray-900">
              {savingsRate.toFixed(1)}%
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Active Goals</div>
            <div className="text-2xl font-bold text-gray-900">
              {activeGoalsCount}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Transactions</div>
            <div className="text-2xl font-bold text-gray-900">
              {transactionCount}
            </div>
          </div>
        </div>
      </div>

      {insights.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Personalized Insights
          </h2>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${
                  insight.type === 'success'
                    ? 'border-emerald-500'
                    : insight.type === 'warning'
                    ? 'border-amber-500'
                    : 'border-blue-500'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      insight.type === 'success'
                        ? 'bg-emerald-100'
                        : insight.type === 'warning'
                        ? 'bg-amber-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    {insight.type === 'success' ? (
                      <CheckCircle
                        className={`w-5 h-5 ${
                          insight.type === 'success'
                            ? 'text-emerald-600'
                            : insight.type === 'warning'
                            ? 'text-amber-600'
                            : 'text-blue-600'
                        }`}
                      />
                    ) : insight.type === 'warning' ? (
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{insight.description}</p>
                    <p className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-lg inline-block">
                      💡 {insight.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Money Habits Tips
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-emerald-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                Track every transaction
              </h4>
              <p className="text-sm text-gray-600">
                The more you track, the better you understand your spending patterns
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-emerald-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                Follow the 50/30/20 rule
              </h4>
              <p className="text-sm text-gray-600">
                50% needs, 30% wants, 20% savings - a simple budgeting framework
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-emerald-600 font-bold text-sm">3</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                Build an emergency fund
              </h4>
              <p className="text-sm text-gray-600">
                Aim for 3-6 months of expenses for financial security
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-emerald-600 font-bold text-sm">4</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Review weekly</h4>
              <p className="text-sm text-gray-600">
                Spend 10 minutes each week reviewing your expenses and adjusting
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
