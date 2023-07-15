# Add Keptn for deployment observability

## Annotate Namespace

> **_NOTE:_** The following configuration has already been deployed to your cluster.

Keptn uses the annotation `keptn.sh/lifecycle-toolkit: "enabled"` in the Namespace manifest to determine whether to monitor this namespace:

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

## Recommended Labels

Add to the Deployment manifest the [Recommended Kubernetes Labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/#labels).
In this example, the following labels are used:

```yaml
metadata:
  labels:
    app.kubernetes.io/part-of: demoapp
    app.kubernetes.io/name: featuredemo
    app.kubernetes.io/version: 1.0.0
```

With these labels, Keptn monitors each deployment and change that occurs in the namespace, producing OpenTelemetry traces and metrics. 
For visualizing DORA metrics and deployment traces, visit `http://grafana.127.0.0.1.nip.io/` where several Dashboards are pre-configured.

Next: [Add a post-deployment task](post_deployment.md)


