/**
 * express code
 */

const express = require('express')
const app = express()
const port = 3000

/**
 * health endpoint
 */

app.get ("/healthz", async(req, res) => {
  res.send("All good")
})

/**
 * Minimal application code
 */

app.get('/', async(req, res) => {

  var body = "<html><title>Demo App</title><body><h1>";
  body += 'Hello World!';
  body += "</h1></body></html>";
  res.send (body)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})