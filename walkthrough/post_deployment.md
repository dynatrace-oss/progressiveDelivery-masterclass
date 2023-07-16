# Add a post-deployment task

> **_NOTE:_** The following configuration has already been deployed to your cluster.

Keptn can run tasks and evaluation as part of the deployment-lifecycle.
To run a load-test on the application and then run an evaluation,
add the following annotations to the appropriate Workload manifest
which, for this exercise, is the `Deployment` manifest:

```yaml
keptn.sh/post-deployment-tasks: load-test
keptn.sh/post-deployment-evaluations: demoapp-healty-check
```

## Define the Keptn task

The `load-test` Keptn task is implemented as a
[KeptnTaskDefinition](https://lifecycle.keptn.sh/docs/yaml-crd-ref/taskdefinition/)
CRD, using Deno, which uses a syntax similar to JavaScript or TypeScript.
You could instead use the Python runner to define tasks,
or you could use a standard Kubernetes container
for which you define the `image` and properties to use.

The following manifest creates a Keptn task that runs
[K6](https://k6.io/) for a load test.
The actual script could be coded inline in the manifest but,
in this case, it is an external script that is referenced:

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

## Define a custom Keptn metric

You can supplement the metrics provided
by DORA and OpenTelementry by defining custom Keptn metrics.
You can define a Keptn metric for any value
that can be expressed as a valid query
for your observability platform
(such as Prometheus, Datadog, or Dynatrace).

To implement a custom Keptn metric:

1. Configure a
   [KeptnMetricProvider](https://lifecycle.keptn.sh/docs/yaml-crd-ref/metricsprovider/)
   resource for each instance of an observability platform in your cluster.
   Keptn supports using multiple observability platforms
   and multiple instances of each observability platform
   but each must have its own `KeptnMetricProvider` resource.

1. Configure a
   [KeptnMetric](https://lifecycle.keptn.sh/docs/yaml-crd-ref/metric/)
   resource that defines the observability platform query to use
   and the interval at which to sample this data.


### Define KeptnMetricProvider resource

In this exercise, we are fetching metrics from a single instance
of a Prometheus data source as our observability platform
so only need a single `KeptnMetricProvider` resource.

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

### Define the KepntMetric resource

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

## Define Keptn Evaluation

A Keptn Evaluation defines a target value
for an existing `KeptnMetric` resource,
so the `KeptnMetric` becomes the SLI
and the evaluation serves as the SLO.

Using the `demoapp-latency` Keptn Metric we defined above,
create a
[KeptnEvaluationDefinition](https://main.lifecycle.keptn.sh/docs/yaml-crd-ref/evaluationdefinition/)
that tests whether the target value is less that `0.3`:

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

