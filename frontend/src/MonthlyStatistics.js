// MonthlyStatistics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ip_address } from './global_const';

function MonthlyStatistics() {
  const [monthlyExpenses, setMonthlyExpenses] = useState({});

  useEffect(() => {
    fetchMonthlyExpenses();
  }, []);

  const fetchMonthlyExpenses = async () => {
    try {
      const response = await axios.get(`http://${ip_address}:5000/transactions`);
      const transactions = response.data;

      // 统计每个月的支出
      const expensesByMonth = transactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((acc, transaction) => {
            
            const date = new Date(transaction.date);   
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // 格式化为 YYYY-MM
            acc[month] = (acc[month] || 0) + transaction.amount;
            return acc;
        }, {});

      setMonthlyExpenses(expensesByMonth);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Monthly Expenses Statistics</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Month</th>
            <th>Total Expense</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(monthlyExpenses).map(([month, total], index) => (
            <tr key={index}>
              <td>{month}</td>
              <td>${total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MonthlyStatistics;
