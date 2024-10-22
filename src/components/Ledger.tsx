
import React, { useState } from 'react';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import './Ledger.css';

const Ledger: React.FC = () => {
  const [transactions, setTransactions] = useState<{ date: string; type: 'credit' | 'debit'; amount: number; purpose: string }[]>([]);

  const addTransaction = (date: string, type: 'credit' | 'debit', amount: number, purpose: string) => {
    setTransactions([...transactions, { date, type, amount, purpose }]);
  };

  return (
    <div className="ledger-container">
      <h1 className="ledger-title">Ledger Account</h1>
      <TransactionForm addTransaction={addTransaction} />
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default Ledger;

