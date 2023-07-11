const express = require('express')
const app = express()
const port = 3000

/**
 * OpenTelemetry Code
 */

// Require dependencies
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { PeriodicExportingMetricReader, ConsoleMetricExporter } = require('@opentelemetry/sdk-metrics');

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter()
  }),
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk
  .start()

/**
 * OpenFeature relevant code
 */

const OpenFeature = require('@openfeature/js-sdk').OpenFeature;
const FlagdProvider = require('@openfeature/flagd-provider').FlagdProvider;

const openFeatureConf = {
  HOST : process.env.FLAGD_HOST || 'localhost',
  PORT : process.env.FLAGD_PORT || '8031'
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
  res.send("All good")
})

/**
 * Minimal application code
 */

app.get('/', async(req, res) => {
  const myFlag = await featureFlags.getBooleanValue('my-flag', false);
  const slowFlag = await featureFlags.getBooleanValue('slowFlag', false);

  if (slowFlag){
    await new Promise(r => setTimeout(r, 20000));
  }

  if (myFlag){
    res.send('+++ Hello World! +++ ')
  } else {
    res.send('Hello World!')
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})