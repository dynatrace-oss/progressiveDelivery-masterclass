const express = require('express')
const app = express()
const port = 3000

const OpenFeature = require('@openfeature/js-sdk').OpenFeature;
const FlagdProvider = require('@openfeature/flagd-provider').FlagdProvider;

/**
 * OpenFeature init code
 */

OpenFeature.setProvider(new FlagdProvider({
    host: 'localhost',
    port: 8013,
}))

const featureFlags = OpenFeature.getClient();

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