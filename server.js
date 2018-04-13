'use strict'
require('dotenv').load({
  silent: process.env.NODE_ENV === 'production' // don't log missing .env
})

const express = require('express')
const app = express()
const middleware = require('app/middleware')

app.set('root', __dirname)

middleware.before(app)

const routes = require('config/routes')

app.use(routes.router)

middleware.after(app)

// catch 404 and forward to error handler
app.use(middleware['404'])

// error handlers
app.use(middleware['error-handler'])

const debug = require('debug')('Fin:server')
const http = require('http')

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
  const port = parseInt(val, 10)
  debug('Normalied port is', port)
  return port >= 0 ? port : isNaN(port) ? val : false
}

/**
 * Get port from environment and store in Express.
 */

const devPort = +('GA'.split('').reduce((p, c) =>
 p + c.charCodeAt().toString(16), '')
)

const port = normalizePort(process.env.PORT || devPort)
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Adding Dialogflow code.
 */

 // ran npm install dialogflow
 // added credentials to .env and json file
 // lines 63 and 64 are some variables we need for dialogflow request
const projectId = 'fin-plendk'
const languageCode = 'en-US'

// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow')
const sessionClient = new dialogflow.SessionsClient()

/**
 * Adding web socket code.
 */

// ran npm install socket.io
// appending web socket server to our server
const io = require('socket.io')(server)

// event handlers for socket events for each connected client
io.on('connection', function (socket) {
  // let all clients know a client connected
  io.emit('connection notice', 'Client connected')
  // useful server console logs
  console.log(`A client with socket.id ${socket.id} connected!`)
  socket.on('disconnect', function () {
    console.log(`${socket.id} disconnected!`)
  })
  // handler for message socket events from connected client
  socket.on('message', function (message) {
    // build request object to send to dialogflow
    const sessionPath = sessionClient.sessionPath(projectId, message.uniqueId)
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message.message,
          languageCode: languageCode
        }
      }
    }
    // send client message to dialogflow in unique session
    sessionClient
     .detectIntent(request)
     .then(responses => {
       const result = responses[0].queryResult
       // helpful server console logs regarding response
       console.log(`Query: ${result.queryText}`)
       console.log(`Response: ${result.fulfillmentText}`)
       if (result.intent) {
         console.log(`Intent: ${result.intent.displayName}`)
       } else {
         console.log(`No intent matched.`)
       }
       // broadcast response to just the requesting socket
       socket.emit('message', result.fulfillmentText)
     })
     .catch(err => {
       console.error('ERROR:', err)
     })
  })
})

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  console.log('Server listening on ' + bind)
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.on('error', onError)
server.on('listening', onListening)
server.listen(port)

module.exports = {
  server
}
