
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction, Budget } from '@/types/Transaction';

interface BudgetVsActualChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const BudgetVsActualChart = ({ transactions, budgets }: BudgetVsActualChartProps) => {
  const chartData = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().slice(0, 7);

    // Get current month budgets
    const currentBudgets = budgets.filter(b => b.month === currentMonth);

    return currentBudgets.map(budget => {
      // Calculate actual spending for this category
      const actualSpending = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          const transactionMonth = transactionDate.toISOString().slice(0, 7);
          return (
            t.type === 'expense' &&
            t.category === budget.category &&
            transactionMonth === currentMonth
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category: budget.category,
        budget: budget.monthlyLimit,
        actual: actualSpending,
        difference: budget.monthlyLimit - actualSpending
      };
    });
  }, [transactions, budgets]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-blue-600">Budget: </span>
              ${data.budget.toFixed(2)}
            </p>
            <p className="text-sm">
              <span className="text-red-600">Actual: </span>
              ${data.actual.toFixed(2)}
            </p>
            <p className="text-sm font-medium">
              <span className={data.difference >= 0 ? 'text-green-600' : 'text-red-600'}>
                {data.difference >= 0 ? 'Under by: ' : 'Over by: '}
              </span>
              ${Math.abs(data.difference).toFixed(2)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
            <BarChart className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500">No budget data available</p>
          <p className="text-sm text-slate-400 mt-1">Create budgets to see comparison</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="category" 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="budget" 
            fill="#3b82f6" 
            name="Budget"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="actual" 
            fill="#ef4444" 
            name="Actual Spending"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetVsActualChart;
