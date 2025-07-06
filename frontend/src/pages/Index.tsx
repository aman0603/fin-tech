
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart, Target, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TransactionList from '@/components/TransactionList';
import AddTransactionForm from '@/components/AddTransactionForm';
import MonthlyChart from '@/components/MonthlyChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import BudgetManager from '@/components/BudgetManager';
import BudgetVsActualChart from '@/components/BudgetVsActualChart';
import SpendingInsights from '@/components/SpendingInsights';
import { Transaction, Budget } from '@/types/Transaction';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { transactionApi, budgetApi } from '@/lib/api';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load data from API on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [transactionsData, budgetsData] = await Promise.all([
        transactionApi.getAll(),
        budgetApi.getAll()
      ]);
      
      // Transform API data to match frontend format
      const transformedTransactions = transactionsData.map((t: any) => ({
        id: t._id,
        amount: Math.abs(t.amount), // API stores negative for expenses, frontend expects positive
        description: t.description,
        date: t.date.split('T')[0], // Convert ISO date to YYYY-MM-DD
        type: t.type,
        category: t.category
      }));

      const transformedBudgets = budgetsData.map((b: any) => ({
        id: b._id,
        category: b.category,
        monthlyLimit: b.monthlyLimit,
        month: b.month
      }));

      setTransactions(transformedTransactions);
      setBudgets(transformedBudgets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      toast({
        title: "Error",
        description: "Failed to load data from server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      // Transform data for API
      const apiTransaction = {
        ...transaction,
        amount: transaction.type === 'expense' ? -transaction.amount : transaction.amount,
      };

      const newTransaction = await transactionApi.create(apiTransaction);
      
      // Transform response back to frontend format
      const transformedTransaction = {
        id: newTransaction._id,
        amount: Math.abs(newTransaction.amount),
        description: newTransaction.description,
        date: newTransaction.date.split('T')[0],
        type: newTransaction.type,
        category: newTransaction.category
      };

      setTransactions(prev => [transformedTransaction, ...prev]);
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionApi.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const editTransaction = async (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    try {
      // Transform data for API
      const apiTransaction = {
        ...updatedTransaction,
        amount: updatedTransaction.type === 'expense' ? -updatedTransaction.amount : updatedTransaction.amount,
      };

      const updated = await transactionApi.update(id, apiTransaction);
      
      // Transform response back to frontend format
      const transformedTransaction = {
        id: updated._id,
        amount: Math.abs(updated.amount),
        description: updated.description,
        date: updated.date.split('T')[0],
        type: updated.type,
        category: updated.category
      };

      setTransactions(prev => 
        prev.map(t => t.id === id ? transformedTransaction : t)
      );
      
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      const newBudget = await budgetApi.create(budget);
      
      const transformedBudget = {
        id: newBudget._id,
        category: newBudget.category,
        monthlyLimit: newBudget.monthlyLimit,
        month: newBudget.month
      };

      setBudgets(prev => [...prev, transformedBudget]);
      
      toast({
        title: "Success",
        description: "Budget created successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create budget",
        variant: "destructive",
      });
    }
  };

  const updateBudget = async (id: string, updatedBudget: Omit<Budget, 'id'>) => {
    try {
      const updated = await budgetApi.update(id, updatedBudget);
      
      const transformedBudget = {
        id: updated._id,
        category: updated.category,
        monthlyLimit: updated.monthlyLimit,
        month: updated.month
      };

      setBudgets(prev => 
        prev.map(b => b.id === id ? transformedBudget : b)
      );
      
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update budget",
        variant: "destructive",
      });
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await budgetApi.delete(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
      
      toast({
        title: "Success",
        description: "Budget deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete budget",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Failed to load data</div>
          <Button onClick={loadData}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Calculate summary statistics
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netBalance = totalIncome - totalExpenses;

  // Get current month category breakdown
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const monthlyExpensesByCategory = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return (
        t.type === 'expense' &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    })
    .reduce((acc, t) => {
      const category = t.category || 'Other';
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(monthlyExpensesByCategory)
    .sort(([,a], [,b]) => b - a)[0];

  const currentMonthName = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Personal Finance Visualizer
          </h1>
          <p className="text-slate-600 text-lg">Complete financial management with budgeting and insights</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">
                Total Income
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
              <p className="text-xs text-emerald-100 mt-1">
                All time earnings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-100">
                Total Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-red-100 mt-1">
                All time spending
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${netBalance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                Net Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${netBalance.toFixed(2)}</div>
              <p className="text-xs text-white/90 mt-1">
                {netBalance >= 0 ? 'Surplus' : 'Deficit'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Top Category
              </CardTitle>
              <PieChart className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">
                {topCategory ? topCategory[0] : 'None'}
              </div>
              <p className="text-xs text-purple-100 mt-1">
                {topCategory ? `$${topCategory[1].toFixed(2)} this month` : 'No expenses yet'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-slate-700">Monthly Expenses - {currentMonthName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <MonthlyChart transactions={transactions} />
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-slate-700">Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryPieChart transactions={transactions} />
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-slate-700">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Transaction
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Transaction</DialogTitle>
                    </DialogHeader>
                    <AddTransactionForm onSubmit={addTransaction} />
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="border-slate-300">
                  <Target className="mr-2 h-4 w-4" />
                  {budgets.length} Active Budgets
                </Button>

                <Button variant="outline" className="border-slate-300">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  {transactions.length} Total Transactions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-slate-700">All Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionList 
                  transactions={transactions}
                  onDelete={deleteTransaction}
                  onEdit={editTransaction}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-slate-700">Budget vs Actual Spending</CardTitle>
                </CardHeader>
                <CardContent>
                  <BudgetVsActualChart transactions={transactions} budgets={budgets} />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-slate-700">Monthly Expenses Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MonthlyChart transactions={transactions} />
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-slate-700">Category Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CategoryPieChart transactions={transactions} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budgets">
            <BudgetManager 
              transactions={transactions}
              budgets={budgets}
              onAddBudget={addBudget}
              onUpdateBudget={updateBudget}
              onDeleteBudget={deleteBudget}
            />
          </TabsContent>

          <TabsContent value="insights">
            <SpendingInsights transactions={transactions} budgets={budgets} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
