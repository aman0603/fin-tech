
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  month: string; // YYYY-MM format
}

// Updated categories to match your backend validation
export const EXPENSE_CATEGORIES = [
  'Food & Dining', 
  'Shopping',
  'Bills & Utilities', 
  'Entertainment', 
  'Education', 
  'Transportation', 
  'Healthcare',
  'Travel', 
  'Investment',
  'Personal Care', 
  'Other'
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Business',
  'Investments',
  'Gifts',
  'Other Income'
];
