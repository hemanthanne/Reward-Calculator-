import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function rewardsResults(incomingData) {
  // Calculate points per transaction

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = new Date(transaction.transactionDt).getMonth();
    return {...transaction, points, month};
  };


function App() {

  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/transaction", {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      setCustomerData(res.data);
    })
  }, []);

  useEffect(() => {
    if (customerData.length > 0) {
      let calculatedRewards = calculateRewards(customerData);

      console.log(new Date(calculatedRewards[0].transactionHistory[0].transactionDate).getMonth())
    }
  }, [customerData]);

  const calculateRewards = customerData => {
    customerData.forEach((customer, i) => {
      let totalRewardPoints = 0;
      customer.transactionHistory.forEach((transaction, j) => {
        let twoPointCount = numberOf2Pointers(transaction.transactionPrice);
        let onePointCount = numberOf1Pointers(transaction.transactionPrice);

        let points = twoPointCount + onePointCount
        totalRewardPoints += points;

        customerData[i].transactionHistory[j]['rewardPoints'] = points;
      })
      customerData[i]['totalRewardPoints'] = totalRewardPoints;

    });

    return customerData;
  }

  const numberOf2Pointers = price => {
    let count = 0;
    let bonusPrice = price - 100;
    if (bonusPrice > 0) {
      count = bonusPrice * 2;
    }
    return count;
  }

  const numberOf1Pointers = price => {
    let count = 0;
    let bonusPrice = price - 50;
    if (bonusPrice > 0) {
      count = bonusPrice;
    }
    return count;
  }

  return (
    <div>
    </div>
  );
  
}

export default App;
