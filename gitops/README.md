# GitOps for ArgoCD

kind create cluster --config cluster/kind-cluster.yaml

## Install ArgoCD

```
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

## Get ArgoCD Password and Port-Forward ArgoCD UI

```
argocd admin initial-password -n argocd
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

## Apply the "App of Apps"

```
kubectl -n argocd apply -f app-of-apps.yaml
```

The App of Apps will create all other apps which are included in the `applications` folder from within GtiHub Repository.

Sync waves allow you to ensure that certain resources are healthy before others are rolled out. It short, it's a way of saying "install A before B".

### Sync Wave -1
Applies custom argocd-cm for Application Health Status

### Sync Wave 0
- Cert Manager
- NGINX Ingress

### Sync Wave 2
- Keptn Lifecycle Toolkit
- OpenFeature Operator
- Prometheus CRDs

### Sync Wave 3
- `prometheus-grafana` application

### Sync Wave 4
- Jaeger Operator

### Sync Wave 5
- `featureflags` application
- OpenTelemetry Collector

### Sync Wave 6
- Keptn Lifecycle Toolkit Config

### Sync Wave 10
- `demo-application`

