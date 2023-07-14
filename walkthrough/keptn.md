# Add Keptn for deployment observability

> **_NOTE:_**  The following configuration has already been deployed to your cluster.

To enable Keptn on a specific namespace, you have to add the `keptn.sh/lifecycle-toolkit: "enabled"` annotation to it, and add the K8s recommended labels to your deployment. Keptn will then autodiscover your application and make it observable.

## Annotate Namespace

```yaml
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

```yaml
app.kubernetes.io/part-of: demoapp
app.kubernetes.io/name: featuredemo
app.kubernetes.io/version: 1.0.0
```