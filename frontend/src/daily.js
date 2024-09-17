import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ip_address } from "./global_const";
import { useGlobalState } from './GlobalStateContext';

function Daily() {
    const [transactions, setTransactions] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [showToast, setShowToast] = useState(false);
    const {globalState: GState, updateGlobalState} = useGlobalState();
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
        // setTransactions(response.data);
        updateGlobalState((draft) => {draft.transactions = response.data});
        } catch (error) {
        console.error("Error fetching transactions:", error);
        }
    };

    return (
        <div>
        <h1 style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "32px",
            fontWeight: "bold",
        }}>{date}</h1>
        <div className="mb-3">
            <h1 style={{
                float: "right",
            }}>
                123
            </h1>
        </div>
        
        <div className="table-responsive">
            <table className="table table-striped">
            <thead>
                <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
                </tr>
            </thead>
            <tbody>
                {GState.transactions.map((transaction) => (
                <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.type}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
}
export default Daily;