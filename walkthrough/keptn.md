## Annotate Namespace


```bash
curl --create-dirs -sL -o gitops/manifests/demo-application/namespace.yaml https://raw.githubusercontent.com/AloisReitbauer/progressiveDelivery-masterclass/main/gitops/manifests/demo-application/service.yaml

```

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

