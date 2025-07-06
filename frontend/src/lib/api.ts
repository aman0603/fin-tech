
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = 'https://fin-tech-imt3.onrender.com/api'; // Update this to your backend URL

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

// Transaction API calls
export const transactionApi = {
  getAll: async (filters?: {
    category?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/transactions?${queryParams}`);
    console.log('Fetching transactions with filters',response);
    const data: ApiResponse<any[]> = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.data || [];
  },

  create: async (transaction: {
    amount: number;
    description: string;
    date: string;
    type: 'income' | 'expense';
    category: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });
    const data: ApiResponse<any> = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.data;
  },

  update: async (id: string, transaction: {
    amount: number;
    description: string;
    date: string;
    type: 'income' | 'expense';
    category: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });
    const data: ApiResponse<any> = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.data;
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
    });
    const data: ApiResponse<any> = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data;
  },
};

// Budget API calls
export const budgetApi = {
  getAll: async (month?: string) => {
    const queryParams = month ? `?month=${month}` : '';
    const response = await fetch(`${API_BASE_URL}/budgets${queryParams}`);
    const data: ApiResponse<any[]> = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.data || [];
  },

  create: async (budget: {
    category: string;
    monthlyLimit: number;
    month: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budget),
    });
    const data: ApiResponse<any> = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.data;
  },

  update: async (id: string, budget: {
    category: string;
    monthlyLimit: number;
    month: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budget),
    });
    const data: ApiResponse<any> = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.data;
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'DELETE',
    });
    const data: ApiResponse<any> = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data;
  },

  getComparison: async (month: string) => {
    const response = await fetch(`${API_BASE_URL}/budgets/comparison/${month}`);
    const data: ApiResponse<any[]> = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.data || [];
  },
};

// Analytics API calls
export const analyticsApi = {
  getSpendingInsights: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/spending-insights`);
    const data: ApiResponse<any[]> = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.data || [];
  },

  getCategoryBreakdown: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/category-breakdown`);
    const data: ApiResponse<any[]> = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.data || [];
  },

  getMonthlyTrends: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/monthly-trends`);
    const data: ApiResponse<any[]> = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.data || [];
  },

  getBudgetPerformance: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/budget-performance`);
    const data: ApiResponse<any[]> = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.data || [];
  },
};
