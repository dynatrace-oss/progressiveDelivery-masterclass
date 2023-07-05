const express = require('express')
const app = express()
const port = 3000

const OpenFeature = require('@openfeature/js-sdk').OpenFeature;
const FlagdProvider = require('@openfeature/flagd-provider').FlagdProvider;

const openFeatureConf = {
  HOST : process.env.OF_HOST || 'localhost',
  PORT : process.env.OF_PORT || '8013'
}

console.log ("Connecting to flagD at %s:%s", openFeatureConf.HOST, openFeatureConf.PORT)


/**
 * OpenFeature init code
 */

OpenFeature.setProvider(new FlagdProvider({
    host: openFeatureConf.HOST,
    port: openFeatureConf.PORT
}))

const featureFlags = OpenFeature.getClient();

/**
 * health endpoint
 */

app.get ("/healthz", async(req, res) => {
  res.sent ("All good")
})

/**
 * Minimal application code
 */

app.get('/', async(req, res) => {
  const myFlag = await featureFlags.getBooleanValue('my-flag', false);
  if (myFlag){
    res.send('+++ Hello World! +++ ')
  } else {
    res.send('Hello World!')
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})