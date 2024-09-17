// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home'; // 假设主页面组件是 Home
import MonthlyStatistics from './MonthlyStatistics'; // 导入新创建的统计页面组件
import Daily from './daily';
import { GlobalContextProvider } from './GlobalStateContext';

function App() {
  return (
    <GlobalContextProvider>
      <Router>
        <div className="container mt-5">
          <nav className="mb-4">
            <Link to="/" className="btn btn-primary me-2">Home</Link>
            <Link to="/statistics" className="btn btn-secondary me-2">Monthly Statistics</Link>
            <Link to="/daily" className="btn btn-secondary">Daily</Link>
          </nav>
          {/* 定義不同路由到各個React組件 */}
          
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/statistics" element={<MonthlyStatistics />} />
                <Route path="/daily" element={<Daily />} />
            </Routes>
        
        </div>
      </Router>
    </GlobalContextProvider>
    
  );
}

export default App;
