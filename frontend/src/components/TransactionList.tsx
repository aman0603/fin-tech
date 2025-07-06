
import { useState } from 'react';
import { Transaction } from '@/types/Transaction';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Trash2, TrendingUp, TrendingDown, Tag } from 'lucide-react';
import AddTransactionForm from './AddTransactionForm';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (id: string, transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionList = ({ transactions, onDelete, onEdit }: TransactionListProps) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (transaction: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      onEdit(editingTransaction.id, transaction);
      setEditingTransaction(null);
    }
  };

  const handleDelete = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string, type: 'income' | 'expense') => {
    if (type === 'income') {
      return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
    }
    
    // Different colors for different expense categories
    const colors = {
      'Food & Dining': 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      'Shopping': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      'Bills & Utilities': 'bg-red-100 text-red-700 hover:bg-red-200',
      'Entertainment': 'bg-pink-100 text-pink-700 hover:bg-pink-200',
      'Education': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
      'Transportation': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      'Healthcare': 'bg-green-100 text-green-700 hover:bg-green-200',
      'Travel': 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
      'Investment': 'bg-teal-100 text-teal-700 hover:bg-teal-200',
      'Personal Care': 'bg-rose-100 text-rose-700 hover:bg-rose-200',
      'Other': 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    };
    
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
          <TrendingUp className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-600 mb-2">No transactions yet</h3>
        <p className="text-slate-400">Add your first transaction to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-slate-800 truncate">
                        {transaction.description}
                      </h4>
                      <Badge 
                        variant="secondary"
                        className={`text-xs ${
                          transaction.type === 'income'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {transaction.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getCategoryColor(transaction.category, transaction.type)}`}
                        >
                          {transaction.category}
                        </Badge>
                      </div>
                      <span className="text-sm text-slate-500">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-lg font-semibold ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                  
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTransaction(transaction)}
                      className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(transaction.id)}
                      className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <AddTransactionForm
              onSubmit={handleEdit}
              initialData={editingTransaction}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionList;
