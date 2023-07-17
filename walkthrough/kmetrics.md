# Define a custom Keptn metric

> **_NOTE:_** The following configuration has already been deployed to your cluster. This page is for your information only.

> **_NOTE:_** The manifests shows in this document can be found [here](../gitops/manifests/demo-application/keptn.yaml)

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


## Define KeptnMetricProvider

In this exercise, we are fetching metrics from a single instance
of a Prometheus data source as our observability platform
so only need a single
[KeptnMetricProvider](https://main.lifecycle.keptn.sh/docs/yaml-crd-ref/metricsprovider/)
resource.
We define this to use the Prometheus instance:

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

## Define KeptnMetric

With the provider configured, we can create the
[KeptnMetric](https://main.lifecycle.keptn.sh/docs/yaml-crd-ref/metric/)
resource.
Note that `provider.name` specifies the provider we defined above.
This manifest defines the Prometheus query that provides the data we want
and specifies that we want to fetch the data every 5 seconds:

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

With these resources defined,
the information for this metric will be displayed on your dashboard.

Next: [Add a post-deployment task](post_deployment.md)
