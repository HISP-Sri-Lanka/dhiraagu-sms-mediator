const dotenv = require('dotenv')
dotenv.config();

var fs = require('node:fs')
const path = require('node:path')

const logging = (logLevel, message) => {

    const timeZone = process.env.TIME_ZONE

    // Create a seperate folder for logging
    const folderName = './logs'

    if (!fs.existsSync(folderName)) {
        fs.mkdir(folderName, {recursive:true}, (err) => {
            if(err) {
                console.error(`Error appending to file: ${err}`);
            } else {
                console.log('Content appended successfully.');
                appendToFile();
            }
        });
    } else {
        appendToFile();
    }

    function appendToFile() {

        //Log filename based on the date
        let today = new Date();
        let year = today.getFullYear()
        let month = String(today.getMonth() + 1).padStart(2, '0')
        let date = String(today.getDate()).padStart(2, '0')

        logFileName = `logs_${year}${month}${date}.txt`

        // Date time
        // logTime = new Date().toLocaleString();

        // Date time with custom timezone
        let formatter = new Intl.DateTimeFormat('en-US', {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
        let parts = formatter.formatToParts(new Date());
        console.log("PARTS", parts)
        let logTime = `${parts[4].value}-${parts[0].value}-${parts[2].value} ${parts[6].value}:${parts[8].value}:${parts[10].value}`;
    

        // log level [Error, Info, warn]
        let logLevelFormatted = `[${logLevel}]`;

        // Message
        message = message; 

        logMessage = `${logTime}\t${logLevelFormatted}\t${message}\n`;

        console.log(logMessage);

        // fs.appendFile(`${folderName}/${logFileName}`, logMessage, function (err) {})
        fs.appendFile(`${folderName}/${logFileName}`, logMessage, function (err) {
            if (err) {
                console.error(`Error writing log file: ${err.message}`);
            }
        });

    }
}

module.exports = logging