
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { Transaction, Budget, EXPENSE_CATEGORIES } from '@/types/Transaction';
import { useToast } from '@/hooks/use-toast';

interface BudgetManagerProps {
  transactions: Transaction[];
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
  onUpdateBudget: (id: string, budget: Omit<Budget, 'id'>) => void;
  onDeleteBudget: (id: string) => void;
}

const BudgetManager = ({ transactions, budgets, onAddBudget, onUpdateBudget, onDeleteBudget }: BudgetManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const budgetAnalysis = useMemo(() => {
    return budgets.map(budget => {
      // Calculate actual spending for this category this month
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

      const percentage = budget.monthlyLimit > 0 ? (actualSpending / budget.monthlyLimit) * 100 : 0;
      const remaining = budget.monthlyLimit - actualSpending;
      const status = percentage >= 100 ? 'over' : percentage >= 80 ? 'warning' : 'good';

      return {
        ...budget,
        actualSpending,
        percentage: Math.min(percentage, 100),
        remaining,
        status
      };
    });
  }, [budgets, transactions, currentMonth]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!category) {
      newErrors.category = 'Category is required';
    }

    if (!monthlyLimit || isNaN(Number(monthlyLimit)) || Number(monthlyLimit) <= 0) {
      newErrors.monthlyLimit = 'Please enter a valid budget amount';
    }

    // Check if budget already exists for this category and month
    const existingBudget = budgets.find(b => b.category === category && b.month === currentMonth);
    if (existingBudget) {
      newErrors.category = 'Budget already exists for this category this month';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    onAddBudget({
      category,
      monthlyLimit: Number(monthlyLimit),
      month: currentMonth,
    });

    toast({
      title: "Success!",
      description: "Budget created successfully",
    });

    // Reset form
    setCategory('');
    setMonthlyLimit('');
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <TrendingUp className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Budget Management</h2>
          <p className="text-slate-600">Set and track your monthly spending limits</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyLimit">Monthly Budget ($)</Label>
                <Input
                  id="monthlyLimit"
                  type="number"
                  step="0.01"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                  placeholder="0.00"
                  className={errors.monthlyLimit ? 'border-red-500' : ''}
                />
                {errors.monthlyLimit && <p className="text-sm text-red-500">{errors.monthlyLimit}</p>}
              </div>

              <Button type="submit" className="w-full">
                Create Budget
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {budgetAnalysis.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No budgets set</h3>
            <p className="text-slate-400 text-center">Create your first budget to start tracking your spending limits</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {budgetAnalysis.map((budget) => (
            <Card key={budget.id} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getStatusColor(budget.status)}`}>
                      {getStatusIcon(budget.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{budget.category}</h3>
                      <p className="text-sm text-slate-500">Monthly Budget</p>
                    </div>
                  </div>
                  <Badge variant={budget.status === 'over' ? 'destructive' : 'secondary'}>
                    {budget.status === 'over' ? 'Over Budget' : 
                     budget.status === 'warning' ? 'Near Limit' : 'On Track'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Spent: ${budget.actualSpending.toFixed(2)}</span>
                    <span>Budget: ${budget.monthlyLimit.toFixed(2)}</span>
                  </div>
                  
                  <Progress 
                    value={budget.percentage} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between text-sm">
                    <span className={budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {budget.remaining >= 0 ? 'Remaining' : 'Over by'}: ${Math.abs(budget.remaining).toFixed(2)}
                    </span>
                    <span className="text-slate-500">
                      {budget.percentage.toFixed(1)}% used
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetManager;
