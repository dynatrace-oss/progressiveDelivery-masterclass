#  Add OpenTelmetry to the app

Add the following code to the ``app.js`` file:

``` Javascript
/**
 * OpenTelemetry Code
 */
const { OpenTelemetryHook } = require('@openfeature/open-telemetry-hook');

/*instrumentation.js*/
const opentelemetry = require("@opentelemetry/sdk-node");
const {getNodeAutoInstrumentations,} = require("@opentelemetry/auto-instrumentations-node");
const {OTLPTraceExporter} = require("@opentelemetry/exporter-trace-otlp-grpc");
const {OTLPMetricExporter} = require("@opentelemetry/exporter-metrics-otlp-grpc");
const {PeriodicExportingMetricReader} = require('@opentelemetry/sdk-metrics');
const {Resource} = require('@opentelemetry/resources');
const {SemanticResourceAttributes} = require('@opentelemetry/semantic-conventions');

const otelServiceName = process.env.OTEL_SERVICE_NAME || 'defaultService'

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({}),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({}),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: otelServiceName
  })  
});
sdk.start();
```

Modify your ``deployment`` file 

```yaml
        env:
        - name: OTEL_EXPORTER_OTLP_ENDPOINT
          value: "http://otel-collector.keptn-lifecycle-toolkit-system:4317"     
        - name: OTEL_SERVICE_NAME
          value: "demoapp"
```

Next: [Add Keptn for deployment observability](keptn.md)