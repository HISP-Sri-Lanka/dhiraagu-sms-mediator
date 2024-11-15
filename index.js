const express = require('express')
const app = express()
const axios = require('axios')
// const soap = require('soap')
const cron = require('node-cron')
// const sendsms = require('./sendsms')
// const logging = require('./logging')
var fs = require('node:fs')
const dotenv = require('dotenv')
// const getFhirResource = require('./getFhirResource')
// const smsTemplate = require('./smsTemplate')
dotenv.config();

app.use(express.json());

app.get('/sms', (req, res) => {   

    res.send('loaded sms gateway');    
    console.log("loaded sms gateway")
    console.log(req.query);
      
    
})



app.listen(process.env.PORT, () => {
    (process.env.NODE_ENV !== 'prod') ? console.log(`Listening on port ${process.env.PORT}`): ''
})