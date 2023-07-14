# Add a post-deployment task and Evaluation

Keptn can run pre and post tasks and validations for your deployment.

> **_NOTE:_**  The following configuration has already been deployed to your cluster.

## Create a Keptn Task Definition

This task definition will run a k6 load test against your deployed application

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

## Assign Task definition

In order to use this Task with your deployment, you have to annotate the deployment manifest with the following annotations

```yaml
keptn.sh/post-deployment-tasks: load-test
```

## Post deployment evaluation

We want to evaluate the response time of our service after the test. Therefor we use the Keptn Metrics Server.

### Configure a KeptnMetricsProvider

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

Create a Keptn Metric

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

Create a Keptn Evaluation Definition which can be used by our deployment

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
      evaluationTarget: "<0.3" #less than 0.3s
```

To enable this evaluation for our deployment, you need to add another annotation to the manifest

```yaml
keptn.sh/post-deployment-evaluations: demoapp-healty-check
```