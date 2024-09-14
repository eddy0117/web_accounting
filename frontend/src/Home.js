import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, Plugin } from 'chart.js';
import { ip_address } from './global_const';

Chart.register(ArcElement, Tooltip, Legend);

// 自定义插件，用于在饼图中心显示总支出金额
// 自定义插件，用于在饼图中心显示总支出金额
const CenterTextPlugin = {
  id: 'centerText',
  afterDraw: (chart) => {
    const { ctx, chartArea } = chart;
    const { width, height, top, left } = chartArea;
    
    // 计算图表中心位置
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // 获取总支出金额
    const totalExpense = chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
    
    ctx.save();
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`$${totalExpense}`, centerX, centerY);
    ctx.restore();
  },
};


Chart.register(CenterTextPlugin);

function Home() {
  const initialBalance = 10000;
  const [balance, setBalance] = useState(initialBalance);
  const [transactions, setTransactions] = useState([]);
  // 為了區分表單中的 amount 其他地方的 amount 變數，這裡將 amount_ 作為表單中的 amount 變數
  const [amount_, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://${ip_address}:5000/transactions`);
      setTransactions(response.data);
      const currentBalance = calculateBalance(response.data);
      setBalance(currentBalance);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const calculateBalance = (data) => {
    return data.reduce((acc, transaction) => {
      return transaction.type === 'income'
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, initialBalance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountValue = parseFloat(amount_);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const newTransaction = {
      type,
      amount: amountValue,
      category: type === 'expense' ? category : 'N/A',
      date,
    };

    try {
      await axios.post(`http://${ip_address}:5000/transactions`, newTransaction, {
        headers: { 'Content-Type': 'application/json' },
      });
      setTransactions([...transactions, newTransaction]);
      setBalance((prevBalance) =>
        type === 'income' ? prevBalance + amountValue : prevBalance - amountValue     );
      setAmount('');
      setCategory('');
    } catch (error) {
      console.error('Error adding transaction:', error);
    }


  };

  // 准备支出项目的饼图数据
  const prepareChartData = () => {
    const expenseCategories = transactions
      .filter((transaction) => transaction.type === 'expense') // 只包含支出项目
      .reduce((acc, transaction) => {
        const { category, amount } = transaction;

        acc[category] = (acc[category] || 0) + amount;
        return acc;
      }, {});

    const labels = Object.keys(expenseCategories);
    const data = Object.values(expenseCategories);
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#1e1927',
            '#FF9F40',
            '#FF9F40',
          ],
          hoverOffset: 4,
        },
      ],
    };
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Simple Accounting Tool</h1>

      <div className="text-center mb-3">
        <h2>Current Balance: ${balance.toFixed(2)}</h2>
      </div>

      {/* 圆饼图 */}
      <div className="mb-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Doughnut
          data={prepareChartData()}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce(
                      (acc, val) => acc + val,
                      0
                    );
                    const percentage = ((value / total) * 100).toFixed(2);
                    return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                  },
                },
              },
            },
            maintainAspectRatio: false, // 确保图表不会被拉伸
            responsive: true,
          }}
          width={400}
          height={400}
        />
      </div>

      {/* 表单组件 */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Transaction Type</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-control"
              value={amount_}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          {type === 'expense' && (
            <div className="col-12">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                <option value="Food">Food</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Household Goods">Household Goods</option>
                <option value="Transport">Transport</option>
                <option value="Others">Others</option>
              </select>
            </div>
          )}

          <div className="col-12">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary w-100">
              Add Transaction
            </button>
          </div>
        </div>
      </form>

      <h3 className="text-center mb-4">Transaction History</h3>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>日期</th>
              <th>類型</th>
              <th>花費類別</th>
              <th>現金</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.date}</td>
                <td>{transaction.type === 'income' ? 'Income' : 'Expense'}</td>
                <td>{transaction.category}</td>
                <td
                  className={
                    transaction.type === 'income' ? 'text-success' : 'text-danger'
                  }
                >
                  {transaction.type === 'income' ? '+' : '-'}$
                  {transaction.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );


  
}

export default Home;
