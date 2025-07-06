
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/types/Transaction';

interface MonthlyChartProps {
  transactions: Transaction[];
}

const MonthlyChart = ({ transactions }: MonthlyChartProps) => {
  const chartData = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get all days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dailyExpenses: Record<string, number> = {};

    // Initialize all days with 0
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateKey = date.toISOString().split('T')[0];
      dailyExpenses[dateKey] = 0;
    }

    // Calculate daily expenses for current month
    transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          t.type === 'expense' &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .forEach(transaction => {
        const dateKey = transaction.date;
        if (dateKey in dailyExpenses) {
          dailyExpenses[dateKey] += transaction.amount;
        }
      });

    // Convert to chart format, showing only days with expenses or recent days
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return Object.entries(dailyExpenses)
      .map(([date, amount]) => ({
        date,
        amount,
        day: new Date(date).getDate(),
        fullDate: new Date(date),
      }))
      .filter(item => item.amount > 0 || item.fullDate >= sevenDaysAgo)
      .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime())
      .slice(-14) // Show last 14 days with activity
      .map(item => ({
        day: `${item.day}`,
        amount: item.amount,
        date: item.date,
      }));
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const date = new Date(data.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="text-sm text-slate-600 mb-1">{formattedDate}</p>
          <p className="text-lg font-semibold text-red-600">
            ${payload[0].value.toFixed(2)}
          </p>
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
          <p className="text-slate-500">No expense data for this month</p>
          <p className="text-sm text-slate-400 mt-1">Add some transactions to see your spending pattern</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="day" 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="amount" 
            fill="url(#expenseGradient)"
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;
