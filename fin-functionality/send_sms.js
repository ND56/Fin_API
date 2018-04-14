// ran  npm install twilio

// pulls twilio credentials from .env
require('dotenv').config()

// require the Twilio module and create a REST client
const client = require('twilio')()

client.messages
  .create({
    to: '+19788917448', // the number receiving the message
    from: '+18572147944', // my twilio number ($1/month)
    body: 'This is a test message!'
  })
  .then(message => console.log(message.sid))

// (3) If FIN tells it to send a text, how will FIN
// respond to the user? Looks like each text returns
// a message.sid (special id for each sent message)
// that would presumably get sent to Fin
