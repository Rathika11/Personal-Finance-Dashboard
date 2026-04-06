import { useState } from 'react';
import { Filter, Search, Calendar, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TransactionsViewProps {
  data: {
    transactions: any[];
  };
  onDataChange: () => void;
}

export function TransactionsView({ data, onDataChange }: TransactionsViewProps) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = data.transactions.filter((t) => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch =
      searchTerm === '' ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categories?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    await supabase.from('transactions').delete().eq('id', id);
    onDataChange();
  };

  const groupedTransactions = filteredTransactions.reduce((acc: any, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p className="text-gray-600">View and manage all your transactions</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                filter === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                filter === 'income'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                filter === 'expense'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Expenses
            </button>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No transactions found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm
                ? 'Try a different search term'
                : 'Add your first transaction to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, transactions]: [string, any]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">{date}</h3>
                <div className="space-y-2">
                  {transactions.map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                          style={{
                            backgroundColor: transaction.categories?.color + '20',
                          }}
                        >
                          {transaction.categories?.icon || '💰'}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {transaction.description || transaction.categories?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.categories?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`font-bold text-lg ${
                            transaction.type === 'income'
                              ? 'text-emerald-600'
                              : 'text-gray-900'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}$
                          {Number(transaction.amount).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
