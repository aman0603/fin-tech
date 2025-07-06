
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, Target } from 'lucide-react';
import { Transaction, Budget } from '@/types/Transaction';

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const SpendingInsights = ({ transactions, budgets }: SpendingInsightsProps) => {
  const insights = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Current month expenses
    const currentMonthExpenses = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        t.type === 'expense' &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    // Last month expenses
    const lastMonthExpenses = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        t.type === 'expense' &&
        transactionDate.getMonth() === lastMonth &&
        transactionDate.getFullYear() === lastMonthYear
      );
    });

    const currentTotal = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
    const lastTotal = lastMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
    const monthlyChange = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0;

    // Category analysis
    const categoryTotals: Record<string, number> = {};
    currentMonthExpenses.forEach(t => {
      const category = t.category || 'Other';
      categoryTotals[category] = (categoryTotals[category] || 0) + t.amount;
    });

    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0];

    // Budget analysis
    const currentMonthStr = currentDate.toISOString().slice(0, 7);
    const budgetIssues = budgets
      .filter(b => b.month === currentMonthStr)
      .map(budget => {
        const spent = currentMonthExpenses
          .filter(t => t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);
        
        const percentage = budget.monthlyLimit > 0 ? (spent / budget.monthlyLimit) * 100 : 0;
        return { ...budget, spent, percentage };
      })
      .filter(b => b.percentage >= 80);

    // Spending patterns
    const averageDailySpending = currentMonthExpenses.length > 0 
      ? currentTotal / currentDate.getDate() 
      : 0;

    const projectedMonthlySpending = averageDailySpending * new Date(currentYear, currentMonth + 1, 0).getDate();

    return {
      monthlyChange,
      topCategory,
      budgetIssues,
      averageDailySpending,
      projectedMonthlySpending,
      currentTotal
    };
  }, [transactions, budgets]);

  const insightCards = [
    {
      title: 'Monthly Spending Trend',
      value: `${insights.monthlyChange >= 0 ? '+' : ''}${insights.monthlyChange.toFixed(1)}%`,
      description: 'vs last month',
      icon: insights.monthlyChange >= 0 ? TrendingUp : TrendingDown,
      color: insights.monthlyChange >= 0 ? 'text-red-600' : 'text-green-600',
      bgColor: insights.monthlyChange >= 0 ? 'bg-red-50' : 'bg-green-50'
    },
    {
      title: 'Top Spending Category',
      value: insights.topCategory ? insights.topCategory[0] : 'N/A',
      description: insights.topCategory ? `$${insights.topCategory[1].toFixed(2)}` : 'No data',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Projected Monthly Total',
      value: `$${insights.projectedMonthlySpending.toFixed(2)}`,
      description: `$${insights.averageDailySpending.toFixed(2)}/day average`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Spending Insights</h2>
        <p className="text-slate-600">AI-powered analysis of your spending patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insightCards.map((card, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-slate-500">{card.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {insights.budgetIssues.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              <span>Budget Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.budgetIssues.map((budget) => (
                <div key={budget.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">{budget.category}</p>
                    <p className="text-sm text-slate-600">
                      ${budget.spent.toFixed(2)} of ${budget.monthlyLimit.toFixed(2)} spent
                    </p>
                  </div>
                  <Badge variant={budget.percentage >= 100 ? 'destructive' : 'secondary'}>
                    {budget.percentage.toFixed(0)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpendingInsights;
