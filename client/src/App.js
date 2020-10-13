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
  

  const columns = [
    {
      Header:'Customer',
      accessor: 'name'      
    },    
    {
      Header:'Month',
      accessor: 'month'
    },
    {
      Header: "No of Transactions",
      accessor: 'numTransactions'
    },
    {
      Header:'Reward Points',
      accessor: 'points'
    }
  ];
  const totalsByColumns = [
    {
      Header:'Customer',
      accessor: 'name'      
    },    
    {
      Header:'Points',
      accessor: 'points'
    }
  ]

  function getCustomerTransactions(row) {
    let byCustomerMonth = _.filter(customerData.pointsPerTransaction, (tRow)=>{    
      return row.original.custid === tRow.custid && row.original.monthNumber === tRow.month;
    });
    return byCustomerMonth;
  }

  useEffect(() => { 
    fetch().then((data)=> {             
      const results = calculateCustomerResults(data);      
      setCustomerData(results);
    });
  },[]);

  if (customerData == null) {
    return <div>Loading...</div>;   
  }

  return customerData == null ?
    <div>Loading...</div> 
      :    
    <div>      
      
      <div className="container">
        <div className="row">
          <div className="col-10">
            <h2>Cusomer Monthly Points Rewards System</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <ReactTable
              data={customerData.summaryByCustomer}
              defaultPageSize={5}
              columns={columns}
              SubComponent={row => {
                return (
                  <div>
                    
                      {getCustomerTransactions(row).map(tran=>{
                        return <div className="container">
                          <div className="row">
                            <div className="col-8">
                              <strong>Transaction Date:</strong> {tran.transactionDt} - <strong>Points: </strong>{tran.points}
                            </div>
                          </div>
                        </div>
                      })}                                    

                  </div>
                )
              }}
              />             
            </div>
          </div>
        </div>
        
        <div className="container">    
          <div className="row">
            <div className="col-10">
              <h2>Points Rewards System Totals By Customer</h2>
            </div>
          </div>      
          <div className="row">
            <div className="col-8">
              <ReactTable
                data={customerData}
                columns={totalsByColumns}
                defaultPageSize={3}                
              />
            </div>
          </div>
        </div>      
    </div>
  ;
}

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

export default App;
