# Add a post-deployment task

> **_NOTE:_** The following configuration has already been deployed to your cluster.

Keptn can run tasks and evaluation as part of the deployment-lifecycle.
To run a load-test on the application and then run an evaluation, add the following annotations:

```yaml
keptn.sh/post-deployment-tasks: load-test
keptn.sh/post-deployment-evaluations: demoapp-healty-check
```

## Keptn Task

For configuring the `load-test` Keptn Task using [K6](https://k6.io/), create the following manifest:

```yaml
apiVersion: lifecycle.keptn.sh/v1alpha3
kind: KeptnTaskDefinition
metadata:
  name: load-test
  namespace: demo
spec:
  container:
    name: testy-test
    image: grafana/k6:0.45.0
    command:
      - 'k6'
      - 'run'
      - 'https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/manifests/demo-application/load.js'
```

## Adding the load test

```Javascript
import { sleep } from"k6";
import http from "k6/http";

export let options = {
  duration: "1m",
  vus: 50,
  thresholds: {
    http_req_duration: ["p(95)<500"] // 95 percent of response times must be below 500ms
  }
};

export default function() {
  http.get("http://demoapp.demo/");
  sleep(1);
};
```

## Keptn Evaluation

To configure the validation of some property of your deployment,
we begin by configuring the observability platform
from which metrics can be fetched.
In this example, we use Prometheus.

```yaml
apiVersion: metrics.keptn.sh/v1alpha3
kind: KeptnMetricsProvider
metadata:
  name: my-provider
  namespace: demo
spec:
  type: prometheus
  targetServer: "http://prometheus-k8s.monitoring.svc.cluster.local:9090"
```

With the provider configured, we can create the metric definition (also refer as SLI).

```yaml
apiVersion: metrics.keptn.sh/v1alpha3
kind: KeptnMetric
metadata:
  name: demoapp-latency
  namespace: demo
spec:
  provider:
    name: my-provider
  query: 'avg(rate(http_server_duration_bucket{exported_job="demoapp"}[2m]))'
  fetchIntervalSeconds: 5
```

Finally, we can configure the target value of the metric (SLO). 

```yaml
apiVersion: lifecycle.keptn.sh/v1alpha3
kind: KeptnEvaluationDefinition
metadata:
  name: demoapp-healty-check
  namespace: demo
spec:
  objectives:
    - keptnMetricRef:
        name: demoapp-latency
        namespace: demo
      evaluationTarget: "<0.3"
```

Next: [Deploy a broken/slow new version of the app](slow_version.md)

