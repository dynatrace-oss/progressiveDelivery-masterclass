# Add Keptn for deployment observability

## Enable Keptn in Namespace

> **_NOTE:_** The following configuration has already been deployed to your cluster. This page is for your information only.

To enable Keptn, add the `keptn.sh/lifecycle-toolkit: "enabled"` annotation
to the `Namespace` manifest:

```
kind: Namespace
apiVersion: v1
metadata:
  name: demo
  labels:
    name: demo
  annotations:
    keptn.sh/lifecycle-toolkit: "enabled"
```
This annotation tells the webhook to handle the namespace.

## Integrate Keptn into Workloads

Integrate Keptn by labeling all the
[Workloads](https://kubernetes.io/docs/concepts/workloads/)
([Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/),
[StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/),
[DaemonSets](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/),
and
[ReplicaSets](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/))
in your application.
For this exercise, we only have a Deployment workload
and we use the following labels:

```yaml
metadata:
  labels:
    app.kubernetes.io/part-of: demoapp
    app.kubernetes.io/name: featuredemo
    app.kubernetes.io/version: 1.0.0
```

With these labels, Keptn monitors changes that occur in the workloads
in the enabled namespace,
producing OpenTelemetry traces and metrics. 

These labels are discussed more on the
[Recommended Kubernetes Labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/#labels) page.
You can instead use Keptn annotations to integrate your workloads.
See
[Annotate workload(s)](https://lifecycle.keptn.sh/docs/implementing/integrate/#annotate-workloads)
for more information.

For visualizing DORA metrics and deployment traces,
visit `http://grafana.127.0.0.1.nip.io/`
where several Dashboards are pre-configured.

## Integrate OpenTelemetry in Keptn

Earlier, we configured OpenTelemetry inside the `app.js` file
to track the usage of the application.
We can also configure Keptn to run OpenTelemetry,
which gives us a trace for the "act of deployment".

We have enabled and integrated Keptn for the cluster
and have an Open Telemetry collector running.
To integrate OpenTelemetry into Keptn,
we only need to create a
[KeptnConfig](https://lifecycle.keptn.sh/docs/yaml-crd-ref/config/)
resource to tell Keptn where the Open Telemetry collector is running
and how often to rerun the automatic app discovery:

```yaml
apiVersion: options.keptn.sh/v1alpha2
kind: KeptnConfig
metadata:
  name: klt-config
spec:
  OTelCollectorUrl: 'http://otel-collector.keptn-lifecycle-toolkit-system:4317`
  keptnAppCreationRequestTimeoutSeconds: 40
```

This uses the same URL for the OpenTelemetry collector
that we used earlier
and specifies that the automatic app discovery should be run every 40 seconds.

For more information about integrating and using
OpenTelemetry in Keptn, see
[Integrate OpenTelemetry into the Keptn Lifecycle Toolkit](https://lifecycle.keptn.sh/docs/implementing/otel/#integrate-opentelemetry-into-the-keptn-lifecycle-toolkit).

Next: [Define a custom Keptn metric](kmetrics.md)


