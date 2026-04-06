import { useState } from 'react';
import { Target, Plus, Trash2, CreditCard as Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface GoalsViewProps {
  data: {
    goals: any[];
  };
  onDataChange: () => void;
}

export function GoalsView({ data, onDataChange }: GoalsViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const { user } = useAuth();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    await supabase.from('goals').delete().eq('id', id);
    onDataChange();
  };

  const handleAddProgress = async (goal: any) => {
    const amount = prompt('How much would you like to add?');
    if (!amount || isNaN(parseFloat(amount))) return;

    const newAmount = goal.current_amount + parseFloat(amount);
    await supabase
      .from('goals')
      .update({
        current_amount: Math.min(newAmount, goal.target_amount),
        status: newAmount >= goal.target_amount ? 'completed' : 'active',
      })
      .eq('id', goal.id);

    onDataChange();
  };

  const activeGoals = data.goals.filter((g) => g.status === 'active');
  const completedGoals = data.goals.filter((g) => g.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Savings Goals</h1>
          <p className="text-gray-600">Track your progress toward financial goals</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New Goal
        </button>
      </div>

      {activeGoals.length === 0 && completedGoals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No goals yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start saving for something meaningful
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Active Goals
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {activeGoals.map((goal) => {
                  const progress = (goal.current_amount / goal.target_amount) * 100;
                  const daysLeft = goal.deadline
                    ? Math.ceil(
                        (new Date(goal.deadline).getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    : null;

                  return (
                    <div
                      key={goal.id}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: goal.color + '20' }}
                          >
                            {goal.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{goal.title}</h3>
                            {daysLeft !== null && (
                              <p className="text-sm text-gray-500">
                                {daysLeft > 0
                                  ? `${daysLeft} days left`
                                  : daysLeft === 0
                                  ? 'Due today'
                                  : `${Math.abs(daysLeft)} days overdue`}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-end justify-between mb-2">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">
                              ${goal.current_amount.toFixed(2)}
                            </span>
                            <span className="text-gray-500 ml-2">
                              of ${goal.target_amount.toFixed(2)}
                            </span>
                          </div>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: goal.color }}
                          >
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div
                            className="h-3 rounded-full transition-all"
                            style={{
                              width: `${Math.min(progress, 100)}%`,
                              backgroundColor: goal.color,
                            }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddProgress(goal)}
                        className="w-full py-3 rounded-xl font-medium transition-all border-2 hover:bg-gray-50"
                        style={{ borderColor: goal.color, color: goal.color }}
                      >
                        Add Progress
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Completed Goals
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {completedGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border-2 border-emerald-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{goal.icon}</span>
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    </div>
                    <p className="text-emerald-700 font-semibold">
                      ${goal.target_amount.toFixed(2)} achieved!
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showAddModal && (
        <AddGoalModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            onDataChange();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function AddGoalModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [color, setColor] = useState('#10B981');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const icons = ['🎯', '🏠', '✈️', '🚗', '💍', '🎓', '💻', '🎸', '📱', '⌚'];
  const colors = [
    '#10B981',
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
    '#F59E0B',
    '#EF4444',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await supabase.from('goals').insert({
        user_id: user.id,
        title,
        target_amount: parseFloat(targetAmount),
        deadline: deadline || null,
        icon,
        color,
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Goal</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goal Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="e.g., Emergency Fund"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="1000"
                required
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline (Optional)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Icon
            </label>
            <div className="flex gap-2 flex-wrap">
              {icons.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-12 h-12 rounded-xl text-2xl transition-all ${
                    icon === i
                      ? 'bg-emerald-100 ring-2 ring-emerald-500'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Color
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
