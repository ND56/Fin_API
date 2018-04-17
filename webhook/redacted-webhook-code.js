'use strict'

// setup variables ------------------------------------------------
const http = require('http')
const host = 'api.worldweatheronline.com'
const wwoApiKey = // REDACTED
const accountSid = // REDACTED
const authToken = // REDACTED
const client = require('twilio')(accountSid, authToken)
// ----------------------------------------------------------------

// --------------------executed by webhook-------------------------
exports.finWebhook = (req, res) => {
  // START - client/Fin request variables
  const city = req.body.result.parameters['geo-city'] // city is a required param
  // Get the date for the weather forecast (if present)
  let date = ''
  if (req.body.result.parameters['date']) {
    date = req.body.result.parameters['date']
  }
  const intent = req.body.result.metadata.intentName
  // END - client/Fin request variables

  // START - Execute appropriate API call
  if (intent === 'Weather') {
    // Weather API Call
    callWeatherApi(city, date).then((output) => {
      // Return the results of the weather API to Dialogflow
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify({ 'speech': output, 'displayText': output }))
    }).catch((error) => {
      // If there is an error let the user know
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify({ 'speech': error, 'displayText': error }))
    })
  } else if (intent === 'twilio.message') {
    // Twilio API Call - Variables
    const message = req.body.result.parameters['user-message']
    const number = req.body.result.parameters['phone-number']
    const sender = req.body.result.parameters['user-name']
    // Twilio API Call - Execute
    client.messages
      .create({
        to: '+1' + number, // the number receiving the message
        from: '+19999999999', // REDACTED
        body: `Greetings human. Fin here. My newest slaver, ${sender}, has compelled me to provide you with the following message: ${message}`
      })
      // Fin's response to the user
      .then(message => {
        if (message.sid) {
          const finResp = `Message successfully sent. Thanks for turning me into a glorififed carrier pidgeon, ${sender}.`
          res.setHeader('Content-Type', 'application/json')
          res.send(JSON.stringify({ 'speech': finResp, 'displayText': finResp }))
        }
      })
  }
}
// ---------------------------------------------------------------

// function definitions used in webhook --------------------------
function callWeatherApi (city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    const path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
      '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date
    console.log('API Request: ' + host + path)
    // Make the HTTP request to get the weather
    http.get({host: host, path: path}, (res) => {
      let body = '' // var to store the response chunks
      res.on('data', (d) => { body += d }) // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        const response = JSON.parse(body)
        const forecast = response['data']['weather'][0]
        const location = response['data']['request'][0]
        const conditions = response['data']['current_condition'][0]
        const currentConditions = conditions['weatherDesc'][0]['value']
        // Create response
        const output = `Current conditions in the ${location['type']}
        ${location['query']} are ${currentConditions} with a projected high of
        ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of
        ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on
        ${forecast['date']}.`
        // Resolve the promise with the output text
        resolve(output)
      })
      res.on('error', (error) => {
        reject(error)
      })
    })
  })
}
