const express = require('express');
const bodyParser = require('body-parser');

const faker = require('faker');

const app = express();

const port = process.env.PORT || 3001;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// API calls
app.get('/api/transaction', (req, res) => {

    let transactinHistory = [];



    for (let i = 0; i <= 3; i++) {
        let customerData = {
            customerId: faker.random.uuid(),
            customerName: faker.name.firstName() + ' ' + faker.name.lastName(),
            transactionHistory: []
        }

        for (let j = 0; j <= 4; j++) {
            let transactionHistory = {
                transactionPrice: faker.commerce.price(),
                transactionDate: faker.date.between('2020-07-01', '2020-10-01')
            }

            customerData.transactionHistory.push(transactionHistory);
        }

        transactinHistory.push(customerData);

    }


    res.send(transactinHistory);

    // 3 months records
    // 3 customers
    // 10 transactions / month / customer
});

app.listen(port, () => console.log(`Listening on port ${port}`));
