# Add a post-deployment task

Keptn allows to run tasks and evaluation as part of the deployment-lifecycle.
For running some load-test on the application and, afterwards, run an evaluation add the following annotations

```yaml
keptn.sh/post-deployment-tasks: load-test
keptn.sh/post-deployment-evaluations: demoapp-healty-check
```

## Keptn Task

For configuring a `load-test` Keptn Task using [K6](https://k6.io/), create the following manifest

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

## Keptn Evaluation

For configuring a validation of some property of your deployment, we start from configuring from where
metrics can be fetched. In this example, we use Prometheus.

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

# Simply create everything using the following script

Open a bash and execute the following commands

```bash

curl --create-dirs -sL -o gitops/manifests/demo-application/keptn.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/manifests/demo-application/keptn.yaml

```