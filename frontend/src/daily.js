import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurger, faTrain, faCartShopping, faBreadSlice, faBowlFood} from "@fortawesome/free-solid-svg-icons";

import { ip_address } from "./global_const";
import { useGlobalState } from './GlobalStateContext';

import "./daily.css";

function Daily() {
    const [transactions, setTransactions] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [showToast, setShowToast] = useState(false);
    const [amount_, setAmount] = useState('');

    // const [category, setCategory] = useState('');
    const {globalState: GState, updateGlobalState} = useGlobalState();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const categories = [
        { id: 'breakfast', name: 'Breakfast', icon: <FontAwesomeIcon icon={faBreadSlice} /> },
        { id: 'lunch', name: 'Lunch', icon: <FontAwesomeIcon icon={faBowlFood} /> },
        { id: 'dinner', name: 'Dinner', icon: <FontAwesomeIcon icon={faBurger} /> },
        { id: 'transport', name: 'Transport', icon: <FontAwesomeIcon icon={faTrain} /> },
        { id: 'shopping', name: 'Shopping', icon: <FontAwesomeIcon icon={faCartShopping} /> },
        { id: 'shopping1', name: 'Shopping', icon: <FontAwesomeIcon icon={faCartShopping} /> },
        // { id: 'shopping2', name: 'Shopping', icon: <FontAwesomeIcon icon={faCartShopping} /> },
        // { id: 'shopping3', name: 'Shopping', icon: <FontAwesomeIcon icon={faCartShopping} /> },
        // { id: 'shopping4', name: 'Shopping', icon: <FontAwesomeIcon icon={faCartShopping} /> },
        // { id: 'shopping5', name: 'Shopping', icon: <FontAwesomeIcon icon={faCartShopping} /> },
        // Add more categories as needed
      ];

    // useEffect(() => {
    //     fetchTransactions();     
    // }, []);                                                                                           
    

    if (GState.transactions.length === 0){
        fetchTransactions();
    } 

    async function fetchTransactions() {
        try {
        const response = await axios.get(
            `http://${ip_address}:5000/transactions`
        );
        // setTransactions(response.data); ,io
        updateGlobalState((draft) => {draft.transactions = response.data});
        } catch (error) {
        console.error("Error fetching transactions:", error);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const amountValue = parseFloat(amount_);
        if (isNaN(amountValue) || amountValue <= 0) {
          // alert('Please enter a valid amount');
          setShowToast(true);
          return;
        }
    
        const newTransaction = {
          type: 'expense',
          amount: amountValue,
          category: selectedCategory,
          date,
        };
    
        try {
          await axios.post(`http://${ip_address}:5000/transactions`, newTransaction, {
            // headers: { 'Content-Type': 'application/json' },
          });
          fetchTransactions(); // 新增一筆交易後重新獲得所有交易資料
     
          // setTransactions([...transactions, newTransaction]);
          // setBalance((prevBalance) =>
          //   type === 'income' ? prevBalance + amountValue : prevBalance - amountValue     );
          setAmount('');
          setSelectedCategory('');
        } catch (error) {
          console.error('Error adding transaction:', error);
        }
    
    
    };

    return (
        <div>

        <h1 style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "32px",
            fontWeight: "bold",
            textAlign: "center",
        }}>{date}</h1>
        {/* <div className="mb-3">
            <div className="category-selector">
                {categories.map((category) => (
                    <button
                    key={category.id}
                    className={`category-button ${selectedCategory == category.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                    >
                        {category.icon}
                        <span>{category.name}</span>  
                    </button>
                ))}
            </div>
        </div> */}
        
        {/* 表单组件 */}
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">

            <div className="col-12">
                <label className="form-label mb-3" >Category</label>
                <div className="category-selector">
                    {categories.map((category) => (
                        <button
                        key={category.id}
                        className={`category-button ${selectedCategory == category.id ? 'selected' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.icon}
                            <span>{category.name}</span>  
                        </button>
                    ))}
                </div>
            </div>

            <div className="col-12">
                <label className="form-label">Amount</label>
                <input
                type="number"
                className="form-control"
                value={amount_}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                />
            </div>

    
        

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
                
        </div>
    );
}
export default Daily;