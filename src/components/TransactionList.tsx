

import React from 'react';
import './TransactionList.css'; 

interface Transaction {
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  purpose: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const totalCredit = transactions
    .filter(t => t.type === 'credit')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDebit = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalCredit - totalDebit;

  // Calculate running total
  let runningTotal = 0;

  return (
    <div className="transaction-list-container">
      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Purpose</th>
            <th>Total Amount</th> {/* New column for Total Amount */}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, index) => {
            // Update running total
            runningTotal += t.type === 'credit' ? t.amount : -t.amount;
            return (
              <tr key={index}>
                <td>{t.date}</td>
                <td>{t.type}</td>
                <td>${t.amount.toFixed(2)}</td>
                <td>{t.purpose}</td>
                <td>${runningTotal.toFixed(2)}</td> {/* Display the running total */}
              </tr>
            );
          })}
        </tbody>
      </table>
      <h3>Total Credit: ${totalCredit.toFixed(2)}</h3>
      <h3>Total Debit: ${totalDebit.toFixed(2)}</h3>
      <h3>Balance: ${balance.toFixed(2)}</h3>
    </div>
  );
};

export default TransactionList;

