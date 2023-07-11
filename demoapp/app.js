/**
 * OpenTelemetry Code
 */

/*instrumentation.js*/
const opentelemetry = require("@opentelemetry/sdk-node");
const {getNodeAutoInstrumentations,} = require("@opentelemetry/auto-instrumentations-node");
const {OTLPTraceExporter} = require("@opentelemetry/exporter-trace-otlp-grpc");
const {OTLPMetricExporter} = require("@opentelemetry/exporter-metrics-otlp-grpc");
const {PeriodicExportingMetricReader} = require('@opentelemetry/sdk-metrics');

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({}),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({}),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();

/**
 * express code
 */

const express = require('express')
const app = express()
const port = 3000

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