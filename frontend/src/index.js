import React from 'react';
import ReactDOM from 'react-dom/client'; // 引入 createRoot 方法
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // 创建 root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
