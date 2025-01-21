const express = require('express')
const app = express()
const axios = require('axios')
// const soap = require('soap')
const cron = require('node-cron')
const xml2js = require('xml2js');
// const sendsms = require('./sendsms')
// const logging = require('./logging')
var fs = require('node:fs')
const dotenv = require('dotenv')
// const getFhirResource = require('./getFhirResource')
// const smsTemplate = require('./smsTemplate')
dotenv.config();
const parser = new xml2js.Parser();
const logging = require('./logging')

app.use(express.json());

app.post('/sms', (req, res) => {   

    // console.log(req.query);

    if (req.query && req.query.username && req.query.password && req.query.message && req.query.to) {

        const username = req.query.username
        const password = req.query.password
        const message = req.query.message
        const to = req.query.to

        const decodedMessage = decodeURIComponent(message);

        // console.log("Decoded", decodedMessage)

        const sendSms = async () => {
            try {
                // Read and load the XML payload file
                let xmlPayload = fs.readFileSync('./sms_payload.xml', 'utf-8');

                // Replace placeholders with environment variables
                xmlPayload = xmlPayload
                    .replace('{{USERNAME}}', username)
                    .replace('{{PASSWORD}}', password)
                    .replace('{{MESSAGE}}', decodedMessage)
                    .replace('{{PHONE_NUMBER}}', to);
                    // .replace('{{PHONE_NUMBER}}', `9607607181`);
                    // .replace('{{PHONE_NUMBER}}', `9609169415`);

                // Make a POST request to the SMS gateway
                const response = await axios.post(process.env.SMS_GTWY_PROVIDER_URL, xmlPayload, {
                    headers: {
                        'method': 'POST',
                        'Content-Type': 'application/xml', // Set the content type
                    },
                });

                // console.log("XML PAYLOAD", xmlPayload)

                // Check if the response is successful
                console.log(response.data);

                // console.log(response)

                parser.parseString(response.data, (err, result) => {
                    if (err) {
                        return res.status(400).send("Invalid Message Format")
                    }

                    const responseStatus = result.TELEMESSAGE.TELEMESSAGE_CONTENT[0].RESPONSE[0].RESPONSE_STATUS[0]

                    // console.log("RESPONSE STATUS", responseStatus)
                    console.log("RESULT", result.TELEMESSAGE.TELEMESSAGE_CONTENT[0].RESPONSE[0].RESPONSE_STATUS[0])

                    if (responseStatus === '100') {
                        return res.status(200).send(response.data)
                    } else {
                        return res.status(400).send("Invalid Response")
                    }
                })

            } catch (error) {

                console.log(error)
                return res.status(400).send("Something went wrong. Please check the logs")
                
            }
        };

        // Run the function to send the SMS
        sendSms();
    } else {
        res.status(400).json({ error: 'Missing query parameters' });
    }
      
    
})

app.post('/debug', (req, res) => {   

    // console.log(req.query);

    if (req.query && req.query.username && req.query.password && req.query.message && req.query.to) {

        const username = req.query.username
        const password = req.query.password
        const message = req.query.message
        const to = req.query.to

        const decodedMessage = decodeURIComponent(message);

        console.log("Decoded", decodedMessage)

        // process.env.SMS_GTWY_PROVIDER_URL

        // Run the function to send the SMS

        logging('Info', `SMS To: ${to}`)
        logging('Info', `SMS Body: ${message}`)

        return res.status(200).json({ info: `response logged` });
    } else {
        logging('Error', `Missing query parameters`)
        return res.status(400).json({ error: `Missing query parameters` });
    }
      
    
})



app.listen(process.env.PORT, () => {
    (process.env.NODE_ENV !== 'prod') ? console.log(`Listening on port ${process.env.PORT}`): ''
})