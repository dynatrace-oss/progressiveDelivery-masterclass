# Add Keptn for deployment observability]

## Annotate Namespace


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

